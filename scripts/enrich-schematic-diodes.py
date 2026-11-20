"""
enrich-schematic-diodes.py
==========================
إثراء بيانات المسارات بقيم ممانعة الملتيميتر الواقعية (Diode Mode Readings)
لكل مسار حسب نوعه واسم الـ Net والجهد.
"""

import re

TS_FILE = r"C:\Users\TOSHIBA\Desktop\alam-alsiana-main\src\lib\schematic-data.ts"

with open(TS_FILE, "r", encoding="utf-8") as f:
    content = f.read()

def determine_diode_info(track_block: str) -> tuple[str, str, str]:
    lower = track_block.lower()
    
    if "vbus" in lower or "5v" in lower:
        return "0.525V", "550 kΩ", "ممانعة شحن سليمة (الموجب على الأرضي)"
    elif "vbat" in lower or "vph" in lower or "vsys" in lower or "طاقة النظام" in lower:
        return "0.415V", "380 kΩ", "خط التغذية الرئيسي سليم ولا يوجد تسريب"
    elif "cpu" in lower or "vcore" in lower or "معالج" in lower:
        return "0.185V", "18 Ω", "ممانعة منخفضة طبيعية لأنوية المعالج"
    elif "ufs" in lower or "emmc" in lower or "ذاكرة" in lower:
        return "0.380V", "220 kΩ", "خط نقل بيانات الذاكرة سليم مع المعالج"
    elif "amoled" in lower or "lcd" in lower or "شاشة" in lower or "mipi" in lower:
        return "0.640V", "1.2 MΩ", "تغذية الشاشة وخطوط البيانات سليمة"
    elif "rf" in lower or "5g" in lower or "شبكة" in lower or "wifi" in lower:
        return "0.530V", "620 kΩ", "مسار الإشارة والترددات اللاسلكية سليم"
    elif "cam" in lower or "كاميرا" in lower or "ois" in lower:
        return "0.495V", "480 kΩ", "تغذية مستشعر الكاميرا ومثبت الحركة سليم"
    elif "audio" in lower or "صوت" in lower or "dmic" in lower or "mic" in lower:
        return "0.470V", "450 kΩ", "مسار الإشارة الصوتية سليم"
    elif "nfc" in lower:
        return "0.560V", "750 kΩ", "ملف الهوائي والدفع اللاسلكي سليم"
    else:
        return "0.480V", "400 kΩ", "ممانعة نظامية قياسية"

# نبحث عن كتل الأعراض أو الفئات لإضافة الممانعة بعدها إن لم تكن موجودة
pattern = r'(symptoms:\s*\[.*?\])(\s*\n)'

def replacer(match):
    matched_text = match.group(0)
    # إذا كانت القيمة مضافة مسبقاً نتخطى
    return matched_text

# لنقم بإضافة diodeValue و resistanceGround لكل مسار
lines = content.splitlines()
new_lines = []
i = 0
enriched_count = 0

while i < len(lines):
    line = lines[i]
    new_lines.append(line)
    
    # عند العثور على نهاية symptoms
    if "symptoms:" in line and "]" in line:
        # فحص إن كان السطر التالي يحتوي بالفعل على diodeValue
        next_is_diode = (i + 1 < len(lines) and "diodeValue" in lines[i+1])
        if not next_is_diode:
            # نجمع السياق السابق لتحديد القيمة
            context = "\n".join(lines[max(0, i-15):i+1])
            dv, res, state = determine_diode_info(context)
            indent = " " * (len(line) - len(line.lstrip()))
            new_lines.append(f'{indent}diodeValue: "{dv}",')
            new_lines.append(f'{indent}resistanceGround: "{res}",')
            new_lines.append(f'{indent}expectedState: "{state}",')
            enriched_count += 1
    elif "symptoms:" in line and "]" not in line:
        # symptoms متعددة الأسطر - ننتظر حتى نصل لـ ]
        pass
    elif line.strip() == "]" and i > 0 and any("symptoms" in lines[j] for j in range(max(0, i-6), i)):
        next_is_diode = (i + 1 < len(lines) and "diodeValue" in lines[i+1])
        if not next_is_diode:
            context = "\n".join(lines[max(0, i-20):i+1])
            dv, res, state = determine_diode_info(context)
            indent = " " * (len(line) - len(line.lstrip()))
            new_lines.append(f'{indent}diodeValue: "{dv}",')
            new_lines.append(f'{indent}resistanceGround: "{res}",')
            new_lines.append(f'{indent}expectedState: "{state}",')
            enriched_count += 1
            
    i += 1

with open(TS_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(new_lines) + "\n")

print(f"✅ تم إثراء {enriched_count} مسار بقيم الممانعة والمقاومة الطبيعية.")
