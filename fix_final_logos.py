import codecs
with codecs.open('src/app/page.tsx', 'r', 'utf-8') as f:
    text = f.read()

# 1. Fix SQL
old_sql_block = '''<div className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" className="w-full h-full text-[#4dabf7] drop-shadow-[0_2px_10px_rgba(77,171,247,0.3)]" fill="currentColor">
                        <path d="M12 2C6.48 2 2 4.01 2 6.5C2 8.99 6.48 11 12 11C17.52 11 22 8.99 22 6.5C22 4.01 17.52 2 12 2ZM12 9C7.58 9 4 7.43 4 6.5C4 5.57 7.58 4 12 4C16.42 4 20 5.57 20 6.5C20 7.43 16.42 9 12 9ZM2 9.5V13.5C2 15.99 6.48 18 12 18C17.52 18 22 15.99 22 13.5V9.5C22 11.99 17.52 14 12 14C6.48 14 2 11.99 2 9.5ZM2 16.5V20.5C2 22.99 6.48 25 12 25C17.52 25 22 22.99 22 20.5V16.5C22 18.99 17.52 21 12 21C6.48 21 2 18.99 2 16.5Z"/>
                      </svg>
                    </div>'''
new_sql_block = '''<img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png" alt="SQL Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(77,171,247,0.3)] group-hover:scale-110 transition-transform duration-300" />'''

# 2. Fix GitHub
old_gh_block = '''<div className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" className="w-full h-full text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.6-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                    </div>'''
new_gh_block = '''<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-300 invert" />'''

if old_sql_block in text:
    text = text.replace(old_sql_block, new_sql_block)
    print("SQL Block Replaced.")
else:
    print("SQL block not found.")

if old_gh_block in text:
    text = text.replace(old_gh_block, new_gh_block)
    print("GitHub Block Replaced.")
else:
    print("GitHub block not found.")

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write(text)
