# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image

src = Path(
    r"C:\Users\jlfig\.cursor\projects\c-Users-jlfig-Desktop-hex-v8\assets"
    r"\c__Users_jlfig_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images"
    r"_WhatsApp_Image_2026-07-13_at_17.07.48-7fcdbfdd-1f3a-41b2-bec4-44a96fc8a8e9.png"
)
# Fix path join - the Path above may be wrong. Use full string.
src = Path(
    r"C:\Users\jlfig\.cursor\projects\c-Users-jlfig-Desktop-hex-v8\assets\c__Users_jlfig_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-07-13_at_17.07.48-7fcdbfdd-1f3a-41b2-bec4-44a96fc8a8e9.png"
)
brand = Path(r"c:\Users\jlfig\Desktop\satinus-web\assets\branding")
brand.mkdir(parents=True, exist_ok=True)
root = Path(r"c:\Users\jlfig\Desktop\satinus-web")

im = Image.open(src).convert("RGBA")
master = im.resize((1024, 1024), Image.Resampling.LANCZOS)
master.save(brand / "logo-master.png", optimize=True)
master.save(brand / "logo-mark.png", optimize=True)

for size, name in [
    (512, "icon-dark.png"),
    (180, "apple-touch-icon.png"),
    (192, "icon-192.png"),
    (32, "favicon-32.png"),
    (16, "favicon-16.png"),
]:
    master.resize((size, size), Image.Resampling.LANCZOS).save(brand / name, optimize=True)

master.resize((32, 32), Image.Resampling.LANCZOS).save(root / "favicon.png", optimize=True)
print("PNG assets written")
for p in sorted(brand.glob("*.png")):
    print(p.name, Image.open(p).size)
