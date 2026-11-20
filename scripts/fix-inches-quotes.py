with open('src/lib/schematic-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace inch symbols like 6.6", 6.1", 6.67", 6.56", 6.72"
bad_quotes = ['6.6"', '6.1"', '6.67"', '6.56"', '6.72"']
for b in bad_quotes:
    fixed = b.replace('"', ' بوصة')
    if b in content:
        print(f"Replacing {b} with {fixed}")
        content = content.replace(b, fixed)

with open('src/lib/schematic-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done fixing quotes.")
