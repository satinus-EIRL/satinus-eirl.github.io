# -*- coding: utf-8 -*-
"""Tarjeta 1200x630 para Open Graph / WhatsApp / LinkedIn / X."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

brand = Path(__file__).resolve().parent
logo_path = brand / "logo-master.png"
if not logo_path.exists():
    logo_path = brand / "logo-mark.png"

W, H = 1200, 630
bg = Image.new("RGB", (W, H), "#07080c")
draw = ImageDraw.Draw(bg)

# Marco suave
draw.rectangle((48, 48, W - 49, H - 49), outline="#1e2433", width=2)

logo = Image.open(logo_path).convert("RGBA")
mark = logo.resize((220, 220), Image.Resampling.LANCZOS)
lx = (W - mark.width) // 2
ly = 92
bg.paste(mark, (lx, ly), mark)

font_name = Path(r"C:\Windows\Fonts\segoeuib.ttf")
font_sub = Path(r"C:\Windows\Fonts\segoeui.ttf")
title_font = ImageFont.truetype(str(font_name), 56) if font_name.exists() else ImageFont.load_default()
sub_font = ImageFont.truetype(str(font_sub), 22) if font_sub.exists() else title_font

title = "SATINUS"
sub = "E.I.R.L.  ·  I+D de alta complejidad"

def center_text(text, y, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) / 2, y), text, font=font, fill=fill)

center_text(title, 340, title_font, "#eef0f6")
center_text(sub, 420, sub_font, "#8b93a8")
center_text("satinus.net", 500, sub_font, "#3b9eff")

out = brand / "og-share.png"
bg.save(out, optimize=True)
print("wrote", out, bg.size)
