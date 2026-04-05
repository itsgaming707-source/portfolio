import codecs
with codecs.open('src/app/page.tsx', 'r', 'utf-8') as f:
    text = f.read()

print("Contains 'Floating Logo'? ", 'Floating Logo' in text)
print("Contains 'expand_more'? ", 'expand_more' in text)
