import codecs
with codecs.open('src/app/page.tsx', 'r', 'utf-8') as f:
    text = f.read()

print("Contains 'N' span? ", '<span className="font-bold text-white relative z-10 select-none">N</span>' in text)
print("Contains 'animate-bounce'? ", 'animate-bounce' in text)
