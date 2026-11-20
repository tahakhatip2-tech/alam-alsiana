"""
patch-remaining-images.py
=========================
تحديث الأسطر المتبقية (note12, a22, spark10, hot20i) في schematic-data.ts
"""
import re

TS_FILE = r"C:\Users\TOSHIBA\Desktop\alam-alsiana-main\src\lib\schematic-data.ts"

# السطر → المسار الجديد (أسطر لا تزال Unsplash)
PATCHES = {
    1353: "/boards/board-note12.jpg",
    1462: "/boards/board-a22.jpg",
    1680: "/boards/board-spark10.jpg",
    1765: "/boards/board-hot20i.jpg",
}

with open(TS_FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()

changes = 0
for line_no, new_path in PATCHES.items():
    idx = line_no - 1
    old = lines[idx]
    if "unsplash" in old.lower() or "boards" not in old:
        new_line = re.sub(r'image:\s*"[^"]+"', f'image: "{new_path}"', old)
        if new_line != old:
            lines[idx] = new_line
            changes += 1
            print(f"  ✅ السطر {line_no}: → {new_path}")
        else:
            print(f"  ⚠️  السطر {line_no}: لم يتغير (تحقق يدوياً)")
    else:
        print(f"  ⏭  السطر {line_no}: محدّث مسبقاً")

with open(TS_FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"\n✅ تم تحديث {changes} سطر إضافي")

# تحقق نهائي - اطبع كل أسطر image:
print("\n── قائمة image: النهائية في schematic-data.ts ──")
with open(TS_FILE, "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "image:" in line and "string" not in line and "interface" not in line:
            print(f"  {i:4d}: {line.strip()[:70]}")
