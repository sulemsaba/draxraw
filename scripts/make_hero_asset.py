"""Create an optimized hero image from img-1-full.jpg (4000x6000 -> 1400x2100 q84)."""
from PIL import Image

src = '/home/z/my-project/download/draxraw-infy-assets/img-1-full.jpg'
dst = '/home/z/my-project/public/images/hero-drax.jpg'

im = Image.open(src).convert('RGB')
im = im.resize((1400, 2100), Image.LANCZOS)
im.save(dst, 'JPEG', quality=84, optimize=True, progressive=True)

import os
print(f'{dst}: {im.size}, {os.path.getsize(dst)/1024:.0f} KB')
