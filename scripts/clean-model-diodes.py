"""
clean-model-diodes.py
=====================
إزالة الخصائص الزائدة التي أضيفت بعد مصفوفة tracks في كائنات BoardModelConfig
"""

import re

TS_FILE = r"C:\Users\TOSHIBA\Desktop\alam-alsiana-main\src\lib\schematic-data.ts"

with open(TS_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# إزالة diodeValue وما بعدها إذا كانت تأتي بعد ], مباشرة
pattern = r'(\s*\],\s*)\n\s*diodeValue:[^\n]+\n\s*resistanceGround:[^\n]+\n\s*expectedState:[^\n]+\n'
cleaned = re.sub(pattern, r'\1\n', content)

# التأكد من أن الكائن الأخير قبل ] ينتهي بفاصلة },
cleaned = re.sub(r'(\n\s*expectedState:[^\n]+)(\n\s*})(\n\s*\])', r'\1\2,\3', cleaned)

with open(TS_FILE, "w", encoding="utf-8") as f:
    f.write(cleaned)

print("✅ تم تنظيف كائنات BoardModelConfig وإصلاح الفواصل بنجاح!")
