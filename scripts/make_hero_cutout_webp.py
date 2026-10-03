#!/usr/bin/env python3
"""Rebuild the hero cutout WITHOUT alpha damage.

FASTOCTREE palette quantization collapsed semi-transparent edge
pixels into opaque ones (visible box behind the subject). WebP
keeps a full 8-bit alpha channel at a fraction of the PNG weight.
"""
from PIL import Image
import os

src = Image.open('assets/draxraw.png').convert('RGBA')
bbox = src.getchannel('A').getbbox()
cut = src.crop(bbox)
print('cropped:', cut.size)

target_w = 640
if cut.width > target_w:
    ratio = target_w / cut.width
    cut = cut.resize((target_w, round(cut.height * ratio)), Image.LANCZOS)

out = 'public/images/hero-drax-cutout.webp'
cut.save(out, quality=88, method=6)
print('webp:', os.path.getsize(out) // 1024, 'KB', cut.size)

# verify alpha survived
import numpy as np
a = np.array(Image.open(out).convert('RGBA').getchannel('A'))
print('alpha min/max', a.min(), a.max(), 'transparent%', round((a < 10).mean() * 100, 1))
