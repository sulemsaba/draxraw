"""Inventory of downloaded draxraw.infy.click assets: dimensions + orientation + validity."""
import os
from PIL import Image

ASSETS = "/home/z/my-project/download/draxraw-infy-assets"

rows = []
for name in sorted(os.listdir(ASSETS)):
    path = os.path.join(ASSETS, name)
    try:
        with Image.open(path) as im:
            w, h = im.size
            mode = im.mode
            fmt = im.format
            orient = "landscape" if w > h * 1.05 else ("portrait" if h > w * 1.05 else "square")
            alpha = "alpha" if mode in ("RGBA", "LA", "PA") else ""
            rows.append((name, fmt, f"{w}x{h}", orient, alpha, f"{os.path.getsize(path)//1024}KB"))
    except Exception as exc:  # noqa: BLE001
        rows.append((name, "INVALID", "-", "-", "-", str(exc)[:40]))

print(f"{'file':28} {'fmt':5} {'dims':12} {'orient':10} {'extra':6} size")
for r in rows:
    print(f"{r[0]:28} {r[1]:5} {r[2]:12} {r[3]:10} {r[4]:6} {r[5]}")
