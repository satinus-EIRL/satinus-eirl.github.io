# -*- coding: utf-8 -*-
"""Update favicon + brand-mark references across satinus-web HTML."""
from pathlib import Path
import re

ROOT = Path(r"c:\Users\jlfig\Desktop\satinus-web")

# Root-relative pages
ROOT_ICON_OLD = re.compile(
    r'<link rel="icon" href="favicon\.svg" type="image/svg\+xml" />\s*'
    r'<link rel="apple-touch-icon" href="assets/branding/icon-dark\.png" />',
    re.M,
)
ROOT_ICON_NEW = (
    '<link rel="icon" href="favicon.svg" type="image/svg+xml" />\n'
    '  <link rel="icon" href="assets/branding/favicon-32.png" type="image/png" sizes="32x32" />\n'
    '  <link rel="apple-touch-icon" href="assets/branding/apple-touch-icon.png" />'
)

ABS_ICON_OLD = re.compile(
    r'<link rel="icon" href="/favicon\.svg" type="image/svg\+xml" />\s*'
    r'<link rel="apple-touch-icon" href="/assets/branding/icon-dark\.png" />',
    re.M,
)
ABS_ICON_NEW = (
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml" />\n'
    '  <link rel="icon" href="/assets/branding/favicon-32.png" type="image/png" sizes="32x32" />\n'
    '  <link rel="apple-touch-icon" href="/assets/branding/apple-touch-icon.png" />'
)

count = 0
for html in ROOT.rglob("*.html"):
    if "node_modules" in html.parts or "dist" in html.parts:
        continue
    text = html.read_text(encoding="utf-8")
    orig = text
    text = ROOT_ICON_OLD.sub(ROOT_ICON_NEW, text)
    text = ABS_ICON_OLD.sub(ABS_ICON_NEW, text)
    # Prefer crisp PNG mark matching attached logo
    text = text.replace(
        'src="assets/branding/logo-mark.svg"',
        'src="assets/branding/logo-mark.png"',
    )
    text = text.replace(
        'src="/assets/branding/logo-mark.svg"',
        'src="/assets/branding/logo-mark.png"',
    )
    if text != orig:
        html.write_text(text, encoding="utf-8")
        count += 1
        print("updated", html.relative_to(ROOT))
print("files", count)

# Resize a lighter nav mark
from PIL import Image
brand = ROOT / "assets" / "branding"
im = Image.open(brand / "logo-master.png")
im.resize((128, 128), Image.Resampling.LANCZOS).save(brand / "logo-mark.png", optimize=True)
print("logo-mark.png -> 128")
