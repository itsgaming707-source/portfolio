import codecs
with codecs.open('src/app/page.tsx', 'r', 'utf-8') as f:
    text = f.read()

# Remove the down arrow
import re
arrow_pattern = re.compile(r'<motion\.div\s+initial=\{\{\s*opacity:\s*0\s*\}\}\s+animate=\{\{\s*opacity:\s*1\s*\}\}\s+transition=\{\{\s*duration:\s*1,\s*delay:\s*1\s*\}\}\s+className="mt-16 animate-bounce"\s*>\s*<span className="material-symbols-outlined text-zinc-600\s+font-extralight">expand_more</span>\s*</motion\.div>', re.DOTALL)
text, count1 = arrow_pattern.subn('', text)
print(f"Removed down arrow {count1} times.")


# Remove floating logo
logo_pattern = re.compile(r'\{/\* Floating Logo \*/\}\s*<motion\.div\s+initial=\{\{\s*opacity:\s*0[\s\S]*?<span className="font-bold text-white relative z-10 select-none">N</span>\s*</motion\.div>', re.DOTALL)
text, count2 = logo_pattern.subn('', text)
print(f"Removed N logo {count2} times.")

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write(text)
