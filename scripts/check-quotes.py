with open('src/lib/schematic-data.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

errors = 0
for i, l in enumerate(lines):
    count = l.count('"')
    if count % 2 != 0 and not l.strip().startswith('//'):
        print(f"Line {i+1}: {l.strip()}")
        errors += 1

if errors == 0:
    print("ALL LINES HAVE BALANCED QUOTES!")
