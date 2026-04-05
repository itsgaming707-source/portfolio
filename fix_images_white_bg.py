import codecs
with codecs.open('src/app/page.tsx', 'r', 'utf-8') as f:
    text = f.read()

def replace_block(old, new):
    global text
    if old in text:
        text = text.replace(old, new)
    else:
        print("Warning: old block not found.")

# Power BI
old_pb = '''<img src="https://cdn.simpleicons.org/powerbi/F2C811" alt="Power BI Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(242,200,17,0.3)] group-hover:scale-110 transition-transform duration-300" />'''
new_pb = '''<div className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" className="w-full h-full text-[#F2C811] drop-shadow-[0_2px_10px_rgba(242,200,17,0.3)]" fill="currentColor">
                        <path d="M10.154 5.923v16.154h-4V5.923h4zm5.541-4.846v21H11.69v-21h4.005zm5.536 9.692v11.308h-4V10.769h4zM4.615 15.615v6.462h-4v-6.462h4z"/>
                      </svg>
                    </div>'''
replace_block(old_pb, new_pb)

# AWS
old_aws = '''<img src="https://cdn.simpleicons.org/amazonaws/FF9900" alt="AWS Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(255,153,0,0.3)] group-hover:scale-110 transition-transform duration-300" />'''
new_aws = '''<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain drop-shadow-[0_2px_10px_rgba(255,153,0,0.3)] group-hover:scale-110 transition-transform duration-300" />'''
replace_block(old_aws, new_aws)

# GitHub
old_gh = '''<img src="https://cdn.simpleicons.org/github/white" alt="GitHub Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-300" />'''
new_gh = '''<div className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" className="w-full h-full text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.6-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                    </div>'''
replace_block(old_gh, new_gh)

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write(text)

print("Icons converted to direct SVGs/reliable CDN!")
