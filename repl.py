import codecs
with codecs.open('src/app/page.tsx', 'r', 'utf-8') as f:
    text = f.read()

old = 'src="https://lh3.googleusercontent.com/aida-public/AB6AXuAonJQQUK1H25-lXkzF1CV1waw5sOQFWFw5db1putrRlModl1jvWhNKj8NSWUYnL2OW7ExPDZXE2l3Q0BpeFz0-ol9KpznmcFDe_79OjfWcxJ-4vem0IIFWuBkVBaTe-xSKgS1-gadIjO0YtZkj9fySnvBXYveTYWrJV5VocFRTqvPCT_UGolHWGqDwN1n41g3PJQ2CcgLTeAWVL_69FZaUcIO4ha278773XAyfEqz-4Kbau7SfXbUH-LYf42G4c0qjqji_MOzD0YY"'
new = 'src="/main-photo.png"'

if old in text:
    text = text.replace(old, new)
    with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
        f.write(text)
    print("Replaced!")
else:
    print("Not found.")
