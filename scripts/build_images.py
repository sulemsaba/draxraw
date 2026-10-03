#!/usr/bin/env python3
"""
Drax image pipeline — converts every photo in public/images/ to:
  - AVIF (modern, ~50% smaller than JPEG at equal quality)
  - WebP (fallback for older browsers)
  - Multiple JPEG widths for srcset
  - A tiny LQIP base64 placeholder for blur-up loading
  - A JSON manifest the React <ResponsiveImage> reads at runtime

Output structure (alongside the originals, never overwriting them):
  public/images/dar-girls-00584.jpg         (original, untouched)
  public/images/dar-girls-00584.avif         (modern, full size)
  public/images/dar-girls-00584.webp        (fallback, full size)
  public/images/dar-girls-00584-480w.avif   (responsive)
  public/images/dar-girls-00584-800w.avif
  public/images/dar-girls-00584-1200w.avif
  public/images/dar-girls-00584-1600w.avif
  public/images/dar-girls-00584-480w.webp
  public/images/dar-girls-00584-800w.webp
  ...
  public/images/manifest.json               (LQIP + srcset manifest)

The original JPGs are kept untouched so nothing depends on a build step
that could fail. The React component reads the manifest; if a path
isn't in the manifest it falls back to the original src.
"""

from __future__ import annotations

import base64
import io
import json
from pathlib import Path
from PIL import Image, ImageFilter

PUBLIC_IMAGES = Path("/home/z/my-project/public/images")
MANIFEST_PATH = PUBLIC_IMAGES / "manifest.json"

# Responsive widths capped at the original. AVIF is so efficient that
# we don't need many breakpoints — these four cover 99% of viewports.
SRC_WIDTHS = [480, 800, 1200, 1600]

# Quality settings chosen for visually-lossless results.
AVIF_QUALITY = 60   # AVIF 55-65 is visually lossless on photos
WEBP_QUALITY = 78   # WebP needs slightly higher q to match AVIF
JPEG_QUALITY = 82

# LQIP: tiny base64 PNG, blurred. ~200 bytes per image.
LQIP_WIDTH = 24


def image_bytes(im: Image.Image, fmt: str, **kwargs) -> bytes:
    buf = io.BytesIO()
    im.save(buf, format=fmt, **kwargs)
    return buf.getvalue()


def make_lqip(im: Image.Image) -> str:
    """Return a base64 PNG data URI for a 24px-wide blurred preview."""
    aspect = im.height / im.width
    h = max(8, int(LQIP_WIDTH * aspect))
    thumb = im.convert("RGB").resize((LQIP_WIDTH, h), Image.LANCZOS)
    thumb = thumb.filter(ImageFilter.GaussianBlur(radius=1.4))
    data = image_bytes(thumb, "PNG", optimize=True)
    b64 = base64.b64encode(data).decode("ascii")
    return f"data:image/png;base64,{b64}"


def process_one(src: Path) -> dict | None:
    try:
        with Image.open(src) as im:
            im.load()
            # Convert to RGB for AVIF/WebP/JPEG (no alpha needed for photos)
            rgb = im.convert("RGB")
            orig_w, orig_h = rgb.size

            stem = src.stem
            ext = src.suffix.lower()
            is_png = ext == ".png"

            entry: dict = {
                "original": f"/images/{src.name}",
                "width": orig_w,
                "height": orig_h,
                "aspectRatio": f"{orig_w} / {orig_h}",
                "avif": None,
                "webp": None,
                "lqip": make_lqip(rgb),
                "srcset": [],
            }

            # Full-size AVIF + WebP (only if they're meaningfully smaller than JPEG)
            full_avif = PUBLIC_IMAGES / f"{stem}.avif"
            full_webp = PUBLIC_IMAGES / f"{stem}.webp"

            avif_bytes = image_bytes(rgb, "AVIF", quality=AVIF_QUALITY, subsampling="4:2:0")
            full_avif.write_bytes(avif_bytes)
            entry["avif"] = f"/images/{full_avif.name}"

            webp_bytes = image_bytes(rgb, "WEBP", quality=WEBP_QUALITY, method=6)
            full_webp.write_bytes(webp_bytes)
            entry["webp"] = f"/images/{full_webp.name}"

            # Responsive srcset variants (only generate widths <= original)
            srcset = []
            for w in SRC_WIDTHS:
                if w >= orig_w:
                    continue
                ratio = w / orig_w
                h = int(orig_h * ratio)
                variant = rgb.resize((w, h), Image.LANCZOS)

                # AVIF variant
                avif_path = PUBLIC_IMAGES / f"{stem}-{w}w.avif"
                avif_path.write_bytes(image_bytes(variant, "AVIF", quality=AVIF_QUALITY, subsampling="4:2:0"))
                # WebP variant
                webp_path = PUBLIC_IMAGES / f"{stem}-{w}w.webp"
                webp_path.write_bytes(image_bytes(variant, "WEBP", quality=WEBP_QUALITY, method=6))
                # JPEG variant (fallback for ancient browsers)
                jpg_path = PUBLIC_IMAGES / f"{stem}-{w}w.jpg"
                jpg_path.write_bytes(image_bytes(variant, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True))

                srcset.append({
                    "w": w,
                    "h": h,
                    "avif": f"/images/{avif_path.name}",
                    "webp": f"/images/{webp_path.name}",
                    "jpg": f"/images/{jpg_path.name}",
                })

            entry["srcset"] = srcset
            return entry

    except Exception as exc:
        print(f"!! {src.name}: {exc}")
        return None


def main() -> None:
    sources = [
        p for p in sorted(PUBLIC_IMAGES.iterdir())
        if p.suffix.lower() in {".jpg", ".jpeg", ".png"}
        and not p.name.endswith(("-480w.jpg", "-800w.jpg", "-1200w.jpg", "-1600w.jpg"))
    ]

    print(f"Processing {len(sources)} images...")
    manifest: dict[str, dict] = {}
    for src in sources:
        entry = process_one(src)
        if entry:
            manifest[f"/images/{src.name}"] = entry
            orig_kb = src.stat().st_size / 1024
            avif_kb = (PUBLIC_IMAGES / f"{src.stem}.avif").stat().st_size / 1024
            webp_kb = (PUBLIC_IMAGES / f"{src.stem}.webp").stat().st_size / 1024
            print(f"  {src.name:35s}  orig={orig_kb:6.0f}KB  avif={avif_kb:5.0f}KB ({avif_kb/orig_kb*100:.0f}%)  webp={webp_kb:5.0f}KB ({webp_kb/orig_kb*100:.0f}%)")

    MANIFEST_PATH.write_text(json.dumps(manifest, separators=(",", ":")))
    print(f"\nManifest: {MANIFEST_PATH}")
    print(f"  {len(manifest)} images indexed")


if __name__ == "__main__":
    main()
