with open('src/lib/schematic-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the cases where trailing quote of a string was turned into inch
text = text.replace('UFS 3.1 inch,', 'UFS 3.1",')
text = text.replace('وبلوتوث 5.2 inch,', 'وبلوتوث 5.2",')
text = text.replace('eMMC 5.1 inch,', 'eMMC 5.1",')
text = text.replace('UFS 2.2 inch,', 'UFS 2.2",')
text = text.replace('Bluetooth 5.1 inch,', 'Bluetooth 5.1",')

# Fix the unescaped double quotes in screen sizes
text = text.replace('AMOLED 6.6""', 'AMOLED 6.6 inch"')
text = text.replace('LTPO 2X 6.36""', 'LTPO 2X 6.36 inch"')
text = text.replace('OLED 6.1""', 'OLED 6.1 inch"')
text = text.replace('AMOLED 6.56""', 'AMOLED 6.56 inch"')
text = text.replace('AMOLED 6.72""', 'AMOLED 6.72 inch"')

with open('src/lib/schematic-data.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed specific line issues.")
