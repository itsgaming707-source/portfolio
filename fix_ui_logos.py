import codecs

with codecs.open('src/app/page.tsx', 'r', 'utf-8') as f:
    text = f.read()

def replace_block(old, new):
    global text
    if old in text:
        text = text.replace(old, new)
    else:
        print(f"Warning: Block not found:\n{old[:50]}...")

# 1. Python Replace
old_py = '''<div className="relative w-8 h-8 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                      <Image src="/logo/python logo.png" alt="Python Logo" fill sizes="(max-width: 768px) 32px, 32px" className="object-contain" />
                    </div>'''
new_py = '''<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(55,118,171,0.3)] group-hover:scale-110 transition-transform duration-300" />'''
replace_block(old_py, new_py)

# 2. SQL Replace
old_sql = '''<div className="relative w-8 h-8 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                      <Image src="/logo/sql.png" alt="SQL Logo" fill sizes="(max-width: 768px) 32px, 32px" className="object-contain" />
                    </div>'''
new_sql = '''<img src="https://cdn.simpleicons.org/mysql/4479A1" alt="SQL Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(68,121,161,0.3)] group-hover:scale-110 transition-transform duration-300" />'''
replace_block(old_sql, new_sql)

old_sql2 = '<img src="https://cdn.simpleicons.org/mysql/4479A1" alt="SQL Logo" '
new_sql2 = '''<div className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" className="w-full h-full text-[#4dabf7] drop-shadow-[0_2px_10px_rgba(77,171,247,0.3)]" fill="currentColor">
                        <path d="M12 2C6.48 2 2 4.01 2 6.5C2 8.99 6.48 11 12 11C17.52 11 22 8.99 22 6.5C22 4.01 17.52 2 12 2ZM12 9C7.58 9 4 7.43 4 6.5C4 5.57 7.58 4 12 4C16.42 4 20 5.57 20 6.5C20 7.43 16.42 9 12 9ZM2 9.5V13.5C2 15.99 6.48 18 12 18C17.52 18 22 15.99 22 13.5V9.5C22 11.99 17.52 14 12 14C6.48 14 2 11.99 2 9.5ZM2 16.5V20.5C2 22.99 6.48 25 12 25C17.52 25 22 22.99 22 20.5V16.5C22 18.99 17.52 21 12 21C6.48 21 2 18.99 2 16.5Z"/>
                      </svg>
                    </div>'''
# Wait, I'll directly stick to new_sql, a generic Database SVG is better than simpleicons MySQL since it covers general DBs smoothly.
new_sql_better = new_sql2
replace_block(new_sql, new_sql_better)
text = text.replace(old_sql, new_sql_better)

# 3. Power BI Replace
old_pb = '''<div className="relative w-8 h-8 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                      <Image src="/logo/power bi.png" alt="Power BI Logo" fill sizes="(max-width: 768px) 32px, 32px" className="object-contain" />
                    </div>'''
new_pb = '''<img src="https://cdn.simpleicons.org/powerbi/F2C811" alt="Power BI Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(242,200,17,0.3)] group-hover:scale-110 transition-transform duration-300" />'''
replace_block(old_pb, new_pb)

# 4. AWS Replace
old_aws = '''<div className="relative w-8 h-8 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                      <Image src="/logo/aws.png" alt="AWS Logo" fill sizes="(max-width: 768px) 32px, 32px" className="object-contain" />
                    </div>'''
new_aws = '''<img src="https://cdn.simpleicons.org/amazonaws/FF9900" alt="AWS Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(255,153,0,0.3)] group-hover:scale-110 transition-transform duration-300" />'''
replace_block(old_aws, new_aws)

# 5. Git & GitHub Replace
old_gh = '''<div className="relative w-8 h-8 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                      <Image src="/logo/github.png" alt="GitHub Logo" fill sizes="(max-width: 768px) 32px, 32px" className="object-contain" />
                    </div>'''
new_gh = '''<img src="https://cdn.simpleicons.org/github/white" alt="GitHub Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-300" />'''
replace_block(old_gh, new_gh)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write(text)

print('Logos replaced successfully with crisp SVGs!')
