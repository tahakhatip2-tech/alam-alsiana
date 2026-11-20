"""
fix-commas.py
=============
إضافة فاصلة ناقصة قبل diodeValue في schematic-data.ts
"""

import re

TS_FILE = r"C:\Users\TOSHIBA\Desktop\alam-alsiana-main\src\lib\schematic-data.ts"

with open(TS_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# إصلاح أي سطر ينتهي بقوس مصفوفة ] وبدون فاصلة قبل سطر diodeValue
fixed = re.sub(r'(\])\s*\n(\s*diodeValue:)', r'\1,\n\2', content)

# أيضاً إصلاح أي سطر ينتهي بدون فاصلة قبل diodeValue
fixed = re.sub(r'([^\s,;{])\s*\n(\s*diodeValue:)', r'\1,\n\2', fixed)

with open(TS_FILE, "w", encoding="utf-8") as f:
    f.write(fixed)

print("✅ تم إصلاح الفواصل قبل diodeValue بنجاح!")
