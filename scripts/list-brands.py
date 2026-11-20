import re

with open('src/lib/schematic-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

models = re.findall(r'id:\s*"([a-z0-9-]+)",\s*name:\s*"([^"]+)",\s*brand:\s*"([^"]+)"', text)
print(f"Total models parsed: {len(models)}")
by_brand = {}
for mid, name, brand in models:
    by_brand.setdefault(brand, []).append((mid, name))

for b, items in by_brand.items():
    print(f"\nBrand: {b} ({len(items)} models):")
    for mid, name in items:
        print(f"   [{mid}] {name}")
