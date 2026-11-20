import re

with open('src/lib/schematic-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all digit + " (inch marks) with digit + ' بوصة'
fixed_content = re.sub(r'(\d+\.?\d*)"', r'\1 بوصة', content)

with open('src/lib/schematic-data.ts', 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("Cleaned all remaining inch marks.")
