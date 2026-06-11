import codecs
with codecs.open('src/app/page.tsx', 'r', 'utf-8') as f:
    text = f.read()

old = '''                <div className="w-40 h-40 rounded-full overflow-hidden border border-zinc-800 shadow-[0_0_40px_rgba(173,198,255,0.05)] relative transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(173,198,255,0.15)] group-hover:border-zinc-700">
                  <Image
                    alt="Nikhil Yadav Profile"
                    src="/main-photo.png"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>'''

new = '''                <div className="w-40 h-40 rounded-full p-[2px] bg-gradient-to-br from-[#FFD700] via-[#C9A44C] to-[#eeca59] shadow-[0_0_30px_rgba(201,164,76,0.3)] relative transition-all duration-500 group-hover:scale-[1.05] group-hover:shadow-[0_0_50px_rgba(255,215,0,0.5)]">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-[#121212]">
                    <Image
                      alt="Nikhil Yadav Profile"
                      src="/main-photo.png"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                </div>'''

if old in text:
    text = text.replace(old, new)
    with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
        f.write(text)
    print("Replaced!")
else:
    print("Not found. Check spacing.")




