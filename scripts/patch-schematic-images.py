"""
patch-schematic-images.py
=========================
يستبدل روابط Unsplash بمسارات الصور الحقيقية في schematic-data.ts
بناءً على رقم السطر الذي وجده السكريبت السابق.
"""

import re

TS_FILE = r"C:\Users\TOSHIBA\Desktop\alam-alsiana-main\src\lib\schematic-data.ts"

# خريطة: رقم السطر (1-based) → المسار الجديد
# مستخرجة من نتيجة Select-String أعلاه + معرفتنا بترتيب الموديلات
LINE_PATCHES = {
    # السطر 482 → a23      (فشل iFixit → نبقيه Unsplash لكن نغيّر صورة أوضح)
    482:  "/boards/board-a23.jpg",        # سيُنشأ من مصدر بديل لاحقاً
    # السطر 621 → redmi9   ✅
    621:  "/boards/board-redmi9.jpg",
    # السطر 760 → a53      ✅
    760:  "/boards/board-a53.jpg",
    # السطر 893 → iphone11 ✅
    893:  "/boards/board-iphone11.jpg",
    # السطر 1026 → a14     ✅
    1026: "/boards/board-a14.jpg",
    # السطر 1135 → note10  ✅
    1135: "/boards/board-note10.jpg",
    # السطر 1244 → iphone12 ✅
    1244: "/boards/board-iphone12.jpg",
    # السطر 1353 → note12  (فشل → Unsplash يبقى)
    # السطر 1462 → a22     (فشل → Unsplash يبقى)
    # السطر 1571 → iphone13 ✅
    1571: "/boards/board-iphone13.jpg",
    # السطر 1680 → spark10 (فشل → Unsplash يبقى)
    # السطر 1765 → hot20i  (فشل → Unsplash يبقى)
}

# الموديلات الفاشلة — نحتفظ بـ Unsplash مؤقتاً لكن نطبع تذكيراً
PENDING = {482: "a23", 1353: "note12", 1462: "a22", 1680: "spark10", 1765: "hot20i"}

with open(TS_FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()

changes = 0
for line_no, new_path in LINE_PATCHES.items():
    idx = line_no - 1          # تحويل إلى 0-based
    old = lines[idx]
    # استبدال قيمة image: "..." بالمسار الجديد
    new_line = re.sub(r'image:\s*"[^"]+"', f'image: "{new_path}"', old)
    if new_line != old:
        lines[idx] = new_line
        status = "⚠️ (مؤقت)" if line_no in PENDING else "✅"
        print(f"  السطر {line_no}: {old.strip()[:60]}")
        print(f"           → {new_line.strip()[:60]} {status}")
        changes += 1

with open(TS_FILE, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"\n✅ تم تحديث {changes} سطر في schematic-data.ts")

# تقرير الموديلات المعلّقة
print("\n⚠️  الموديلات التي لا تزال بحاجة إلى صور حقيقية:")
for ln, mid in PENDING.items():
    print(f"   - {mid} (السطر {ln})")
