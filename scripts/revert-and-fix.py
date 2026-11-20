with open('src/lib/schematic-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# First revert all ' بوصة' back to '"'
text = text.replace(' بوصة', '"')

# Now specifically replace screen size inch marks inside labels only
# For example: 6.6", 6.1", 6.67", 6.56", 6.72", 6.36" when preceded by text
import re
text = re.sub(r'(\d+\.\d+)"(?=[,\s\w])', r'\1 inch', text)

with open('src/lib/schematic-data.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Properly restored and fixed inches.")
