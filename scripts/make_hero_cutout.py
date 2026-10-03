#!/usr/bin/env python3
"""Prepare the two new hero/about assets.

1. hero-drax-cutout.png : transparent cutout of Drax operating the
   cinema camera (assets/draxraw.png). Trimmed to content, mild
   palette quantization to keep the page light. Alpha preserved.
2. about-drax.jpg : the seated studio portrait (assets/draxhis image .jpg),
   resized for the About section.
"""
from PIL import Image
import os

OUT = 'public/images'
os.makedirs(OUT, exist_ok=True)

# ---- 1. hero cutout --------------------------------------------------
src = Image.open('assets/draxraw.png').convert('RGBA')
bbox = src.getchannel('A').getbbox()
print('content bbox:', bbox)
cut = src.crop(bbox)
print('cropped size:', cut.size)

# cap width at 640 (2x of ~320px display width is plenty for a cutout)
target_w = 640
if cut.width > target_w:
    ratio = target_w / cut.width
    cut = cut.resize((target_w, round(cut.height * ratio)), Image.LANCZOS)
print('resized:', cut.size)

# quantize to 128 colours with alpha (P mode keeps transparency)
quant = cut.quantize(colors=160, method=Image.FASTOCTREE)
quant.save(f'{OUT}/hero-drax-cutout.png', optimize=True)
print('cutout:', os.path.getsize(f'{OUT}/hero-drax-cutout.png') // 1024, 'KB')

# full-colour fallback if quantization is too heavy
cut.save(f'{OUT}/hero-drax-cutout-rgb.png', optimize=True)
print('cutout rgb:', os.path.getsize(f'{OUT}/hero-drax-cutout-rgb.png') // 1024, 'KB')

# ---- 2. about portrait -----------------------------------------------
p = Image.open('assets/draxhis image .jpg').convert('RGB')
p = p.resize((760, round(p.height * 760 / p.width)), Image.LANCZOS)
p.save(f'{OUT}/about-drax.jpg', quality=84, progressive=True, optimize=True)
print('about:', os.path.getsize(f'{OUT}/about-drax.jpg') // 1024, 'KB', p.size)
