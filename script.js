const fs = require('fs'); const content = fs.readFileSync('src/app/page.tsx', 'utf-8'); const start = content.indexOf('<div className=\"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6\">'); const endStr = '          </motion.div>\n        </section>'; const end = content.indexOf(endStr, start); const repl = \<div className=\"flex flex-col gap-12 max-w-4xl mx-auto text-left\">
              {/* Category: Data Analysis */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className=\"relative pl-8 border-l-2 border-[#4dabf7]/30\">
                <div className=\"absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#4dabf7]/80\"></div>
                <h4 className=\"text-lg font-bold text-[#4dabf7] mb-6 tracking-wide\">Data Analysis</h4>
                <div className=\"flex flex-wrap gap-4\">
                  <motion.div whileHover={{ scale: 1.05 }} className=\"group px-6 py-4 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-4 hover:border-[#4dabf7] hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300\">
                    <svg className=\"w-6 h-6 text-zinc-400 group-hover:text-[#4dabf7] transition-colors\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"m18 16 4-4-4-4\"/><path d=\"m6 8-4 4 4 4\"/><path d=\"m14.5 4-5 16\"/></svg>
                    <span className=\"text-zinc-200 font-medium text-base\">Python</span>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className=\"group px-6 py-4 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-4 hover:border-[#4dabf7] hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300\">
                    <svg className=\"w-6 h-6 text-zinc-400 group-hover:text-[#4dabf7] transition-colors\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\"/><path d=\"M3 5V19A9 3 0 0 0 21 19V5\"/><path d=\"M3 12A9 3 0 0 0 21 12\"/></svg>
                    <span className=\"text-zinc-200 font-medium text-base\">SQL</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Category: Visualization */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className=\"relative pl-8 border-l-2 border-[#4dabf7]/30\">
                <div className=\"absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#4dabf7]/80\"></div>
                <h4 className=\"text-lg font-bold text-[#4dabf7] mb-6 tracking-wide\">Visualization</h4>
                <div className=\"flex flex-wrap gap-4\">
                  <motion.div whileHover={{ scale: 1.05 }} className=\"group px-6 py-4 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-4 hover:border-[#4dabf7] hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300\">
                    <svg className=\"w-6 h-6 text-zinc-400 group-hover:text-[#4dabf7] transition-colors\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><line x1=\"18\" x2=\"18\" y1=\"20\" y2=\"10\"/><line x1=\"12\" x2=\"12\" y1=\"20\" y2=\"4\"/><line x1=\"6\" x2=\"6\" y1=\"20\" y2=\"14\"/></svg>
                    <span className=\"text-zinc-200 font-medium text-base\">Power BI</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Category: Cloud */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className=\"relative pl-8 border-l-2 border-[#4dabf7]/30\">
                <div className=\"absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#4dabf7]/80\"></div>
                <h4 className=\"text-lg font-bold text-[#4dabf7] mb-6 tracking-wide\">Cloud</h4>
                <div className=\"flex flex-wrap gap-4\">
                  <motion.div whileHover={{ scale: 1.05 }} className=\"group px-6 py-4 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-4 hover:border-[#4dabf7] hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300\">
                    <svg className=\"w-6 h-6 text-zinc-400 group-hover:text-[#4dabf7] transition-colors\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z\"/></svg>
                    <span className=\"text-zinc-200 font-medium text-base\">AWS <span className=\"text-zinc-500 font-normal ml-1 text-sm\">(basic)</span></span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Category: Tools */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className=\"relative pl-8 border-l-2 border-[#4dabf7]/30\">
                <div className=\"absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#4dabf7]/80\"></div>
                <h4 className=\"text-lg font-bold text-[#4dabf7] mb-6 tracking-wide\">Tools</h4>
                <div className=\"flex flex-wrap gap-4\">
                  <motion.div whileHover={{ scale: 1.05 }} className=\"group px-6 py-4 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-4 hover:border-[#4dabf7] hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300\">
                    <svg className=\"w-6 h-6 text-zinc-400 group-hover:text-[#4dabf7] transition-colors\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4\"/><path d=\"M9 18c-4.51 2-5-2-7-2\"/></svg>
                    <span className=\"text-zinc-200 font-medium text-base\">Git & GitHub</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
\; fs.writeFileSync('src/app/page.tsx', content.substring(0, start) + repl + content.substring(end));
