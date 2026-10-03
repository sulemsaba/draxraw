"""Extract dominant colors from Drax Raw brand assets to find the missing brand color."""
from PIL import Image
from collections import Counter
import colorsys, os

candidates = [
    '/home/z/my-project/assets/draxraw.png',
    '/home/z/my-project/assets/draxhis image .jpg',
    '/home/z/my-project/public/images/drax-portrait.png',
]

def dominant(path, n=8):
    im = Image.open(path).convert('RGBA')
    im.thumbnail((220, 220))
    px = [p for p in im.getdata() if p[3] > 200]  # ignore transparent
    # quantize to reduce noise
    q = [(r // 16 * 16, g // 16 * 16, b // 16 * 16) for r, g, b, a in px]
    total = len(q)
    out = []
    for (r, g, b), c in Counter(q).most_common(60):
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        # skip near-neutral pixels for "accent" detection
        out.append((c / total, f'#{r:02X}{g:02X}{b:02X}', round(h * 360), round(s * 100), round(v * 100)))
    return out

for path in candidates:
    if not os.path.exists(path):
        print('MISSING', path)
        continue
    print('=' * 60)
    print(os.path.basename(path), Image.open(path).size)
    for pct, hx, hue, sat, val in dominant(path):
        if pct < 0.01:
            break
        tag = ''
        if sat > 25 and 30 <= hue <= 70:
            tag = '  <-- GOLD/AMBER family'
        elif sat > 25:
            tag = f'  (saturated, hue={hue})'
        print(f'  {pct*100:5.1f}%  {hx}  h={hue} s={sat} v={val}{tag}')
