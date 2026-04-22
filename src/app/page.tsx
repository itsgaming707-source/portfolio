"use client";

import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const el = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [activeCert, setActiveCert] = useState<{ title: string, issuer: string, image: string } | null>(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const backgroundGlow = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(0, 150, 255, 0.15), transparent 40%)`;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'skills', 'certifications', 'contact'];
      let current = 'home';

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 250) {
            current = sectionId;
          }
        }
      }

      const tabNameMap: Record<string, string> = {
        home: "Home",
        about: "About",
        projects: "Projects",
        skills: "Skills",
        certifications: "Certifications",
        contact: "Contact"
      };

      setActiveTab(tabNameMap[current] || "Home");
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper for mobile menu
  const handleMobileNavClick = (tabName: string) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Nikhil Yadav"],
      typeSpeed: 75,
      backSpeed: 45,
      backDelay: 3000,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <>
      {/* Decorative Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-900/5 blur-[120px]"></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/5 shadow-lg">
        <div className="flex justify-end md:justify-center items-center max-w-6xl mx-auto px-6 md:px-8 h-16 w-full">
          {/* Desktop Links */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-10 font-sans tracking-tight text-sm"
          >
            <a href="#home" onClick={() => setActiveTab('Home')} className={`cursor-pointer transition-colors ${activeTab === 'Home' ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-zinc-400 hover:text-zinc-100'}`}>Home</a>
            <a href="#about" onClick={() => setActiveTab('About')} className={`cursor-pointer transition-colors ${activeTab === 'About' ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-zinc-400 hover:text-zinc-100'}`}>About</a>
            <a href="#projects" onClick={() => setActiveTab('Projects')} className={`cursor-pointer transition-colors ${activeTab === 'Projects' ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-zinc-400 hover:text-zinc-100'}`}>Projects</a>
            <a href="#skills" onClick={() => setActiveTab('Skills')} className={`cursor-pointer transition-colors ${activeTab === 'Skills' ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-zinc-400 hover:text-zinc-100'}`}>Skills</a>
            <a href="#certifications" onClick={() => setActiveTab('Certifications')} className={`cursor-pointer transition-colors ${activeTab === 'Certifications' ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-zinc-400 hover:text-zinc-100'}`}>Certifications</a>
            <a href="#contact" onClick={() => setActiveTab('Contact')} className={`cursor-pointer transition-colors ${activeTab === 'Contact' ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-zinc-400 hover:text-zinc-100'}`}>Contact</a>
          </motion.div>

          <div className="flex items-center md:hidden">
            {/* Mobile Menu Toggle Button */}
            <button
              className="text-zinc-400 hover:text-white transition-colors flex items-center justify-center p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
            >
              <div className="flex flex-col space-y-5 px-6 py-8 font-sans tracking-tight text-base">
                <a href="#home" onClick={() => handleMobileNavClick('Home')} className={`cursor-pointer transition-colors ${activeTab === 'Home' ? 'text-blue-400 font-medium' : 'text-zinc-400 hover:text-zinc-100'}`}>Home</a>
                <a href="#about" onClick={() => handleMobileNavClick('About')} className={`cursor-pointer transition-colors ${activeTab === 'About' ? 'text-blue-400 font-medium' : 'text-zinc-400 hover:text-zinc-100'}`}>About</a>
                <a href="#projects" onClick={() => handleMobileNavClick('Projects')} className={`cursor-pointer transition-colors ${activeTab === 'Projects' ? 'text-blue-400 font-medium' : 'text-zinc-400 hover:text-zinc-100'}`}>Projects</a>
                <a href="#skills" onClick={() => handleMobileNavClick('Skills')} className={`cursor-pointer transition-colors ${activeTab === 'Skills' ? 'text-blue-400 font-medium' : 'text-zinc-400 hover:text-zinc-100'}`}>Skills</a>
                <a href="#certifications" onClick={() => handleMobileNavClick('Certifications')} className={`cursor-pointer transition-colors ${activeTab === 'Certifications' ? 'text-blue-400 font-medium' : 'text-zinc-400 hover:text-zinc-100'}`}>Certifications</a>
                <a href="#contact" onClick={() => handleMobileNavClick('Contact')} className={`cursor-pointer transition-colors ${activeTab === 'Contact' ? 'text-blue-400 font-medium' : 'text-zinc-400 hover:text-zinc-100'}`}>Contact</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero Section */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden"
          style={{ background: "radial-gradient(circle at 50% 30%, #0a0a0a 0%, #000 70%)" }}
          onMouseMove={handleMouseMove}
        >
          {/* Interactive Mouse Glow */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: backgroundGlow
            }}
          />

          <div className="relative z-10 flex flex-col items-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-6 -mt-6 group"
            >
              <div className="profile-wrapper">
                <div className="w-44 h-44 md:w-48 md:h-48 rounded-full p-[2px] bg-gradient-to-b from-[#FFD700] via-[#C9A44C] to-[#eeca59] shadow-[0_0_25px_rgba(201,164,76,0.3)] relative transition-all duration-500 group-hover:scale-[1.05] group-hover:shadow-[0_0_40px_rgba(255,215,0,0.5)]">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-[#121212]">
                    <Image
                      alt="Nikhil Yadav Profile"
                      src="/main-photo.png"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl font-extrabold tracking-tight mb-4 text-center bg-gradient-to-r from-[#d6c1a3] via-[#f5e6c8] to-[#c7a77a] inline-block text-transparent bg-clip-text"
            >
              <span ref={el}></span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-8"
            >
              <p className="text-[#4dabf7] font-medium tracking-[0.25em] uppercase text-sm md:text-base">
                Data Analyst | SQL | Python | Power BI
              </p>
            </motion.div>


          </div>
        </section>

        {/* About Section */}
        <section id="about" className="pt-20 pb-32 px-6 bg-[#0a0a0a]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 } },
            }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-100 mb-10">
              About Me
            </motion.h2>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-4 text-zinc-300 leading-snug text-base md:text-lg font-light md:text-center text-left">
              <p>
                I&apos;m Nikhil Yadav, a BCA 2nd year student and an aspiring Data Analyst. I work with SQL, Python, and Power BI to understand data and find useful insights.
              </p>
              <p>
                I enjoy solving problems using data and creating simple dashboards that make information easy to understand. I&apos;m currently focused on building my skills through practice and real-world projects.
              </p>
              <p>
                I&apos;m looking for opportunities to learn, grow, and gain hands-on experience in data analytics.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32 px-6 bg-[#0a0a0a] border-t border-zinc-900/50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.18 } },
            }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center gap-6 mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Projects
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project 1 - Blinkit */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="group relative bg-[#121212] rounded-2xl p-8 border border-blue-500/30 overflow-hidden shadow-lg shadow-black/40 hover:shadow-[0_8px_40px_rgba(59,130,246,0.2)] hover:border-blue-400/50 transition-all duration-300 flex flex-col h-full"
              >

                <h3 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-blue-400 transition-colors pr-20">Blinkit Sales Analysis</h3>
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                  Performed end-to-end analysis of Blinkit sales data using Python to uncover trends in product performance, pricing, and outlet impact.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">Python</span>
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">Pandas</span>
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">Seaborn</span>
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">EDA</span>
                </div>
                <div className="mb-8">
                  <h4 className="text-zinc-200 text-sm font-semibold mb-3">Key Insights:</h4>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Tier 1 &amp; 2 outlets outperform Tier 3 in average sales</li>
                    <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Pricing has a stronger impact on sales than item visibility</li>
                    <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Supermarket Type 1 contributes highest sales volume</li>
                  </ul>
                </div>
                <div className="flex items-center gap-4 mt-auto pt-4">
                  <a href="https://github.com/nikhilydv1026/blinkit-sales-analysis-python" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 px-4 py-2 rounded-lg transition-colors border border-white/5">
                    <img src="/logo/github.png" alt="GitHub" className="w-5 h-5 invert" /> GitHub
                  </a>
                </div>
              </motion.div>

              {/* Project 2 - Customer Analytics */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="group relative bg-[#121212] rounded-2xl p-8 border border-teal-500/30 overflow-hidden shadow-lg shadow-black/40 hover:shadow-[0_8px_40px_rgba(20,184,166,0.2)] hover:border-teal-400/50 transition-all duration-300 flex flex-col h-full"
              >

                <h3 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-teal-400 transition-colors pr-20">Customer Analytics Project</h3>
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                  End-to-end customer behavior analysis using Python, SQL, and Power BI to identify trends and improve business decision-making.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">Python</span>
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">SQL</span>
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">Power BI</span>
                </div>
                <div className="mb-8">
                  <h4 className="text-zinc-200 text-sm font-semibold mb-3">Key Insights:</h4>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li className="flex items-start gap-2"><span className="text-teal-400 mt-0.5">•</span> Identified high-value customer segments</li>
                    <li className="flex items-start gap-2"><span className="text-teal-400 mt-0.5">•</span> Analyzed purchasing patterns across categories</li>
                    <li className="flex items-start gap-2"><span className="text-teal-400 mt-0.5">•</span> Built interactive dashboard for business insights</li>
                  </ul>
                </div>
                <div className="flex items-center gap-4 mt-auto pt-4">
                  <a href="https://github.com/nikhilydv1026/customer-analytics-project" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 px-4 py-2 rounded-lg transition-colors border border-white/5">
                    <img src="/logo/github.png" alt="GitHub" className="w-5 h-5 invert" /> GitHub
                  </a>
                </div>
              </motion.div>

              {/* Project 3 - Zepto */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="group relative bg-[#121212] rounded-2xl p-8 border border-zinc-800/60 overflow-hidden shadow-lg shadow-black/40 hover:border-zinc-400/40 hover:shadow-[0_8px_40px_rgba(161,161,170,0.1)] transition-all duration-300 flex flex-col h-full"
              >
                <h3 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-zinc-300 transition-colors">Zepto SQL Data Analysis</h3>
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                  Analyzed e-commerce inventory dataset using SQL to extract business insights related to pricing, stock, and product performance.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">SQL</span>
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">PostgreSQL</span>
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">Data Cleaning</span>
                </div>
                <div className="mb-8">
                  <h4 className="text-zinc-200 text-sm font-semibold mb-3">Key Insights:</h4>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">•</span> Identified top discounted and high-demand products</li>
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">•</span> Found high-value items that are out of stock</li>
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">•</span> Analyzed revenue contribution by category</li>
                  </ul>
                </div>
                <div className="flex items-center gap-4 mt-auto pt-4">
                  <a href="https://github.com/nikhilydv1026/zepto-sql-data-analysis" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 px-4 py-2 rounded-lg transition-colors border border-white/5">
                    <img src="/logo/github.png" alt="GitHub" className="w-5 h-5 invert" /> GitHub
                  </a>
                </div>
              </motion.div>

              {/* Project 4 - Spam Detection */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="group relative bg-[#121212] rounded-2xl p-8 border border-zinc-800/60 overflow-hidden shadow-lg shadow-black/40 hover:border-zinc-400/40 hover:shadow-[0_8px_40px_rgba(161,161,170,0.1)] transition-all duration-300 flex flex-col h-full"
              >
                <h3 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-zinc-300 transition-colors">Spam Detection Using Naive Bayes</h3>
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                  Built a spam classification system from scratch using pure Python without any machine learning libraries.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">Python</span>
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">Probability</span>
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs px-3 py-1 rounded-md">NLP</span>
                </div>
                <div className="mb-8">
                  <h4 className="text-zinc-200 text-sm font-semibold mb-3">Key Insights:</h4>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">•</span> Implemented Naive Bayes with Laplace smoothing</li>
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">•</span> Used log-space computation for numerical stability</li>
                    <li className="flex items-start gap-2"><span className="text-zinc-300 mt-0.5">•</span> Classifies messages with probability-based scoring</li>
                  </ul>
                </div>
                <div className="flex items-center gap-4 mt-auto pt-4">
                  <a href="https://github.com/nikhilydv1026/spam-detection-naive-bayes" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 px-4 py-2 rounded-lg transition-colors border border-white/5">
                    <img src="/logo/github.png" alt="GitHub" className="w-5 h-5 invert" /> GitHub
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Technical Skills Section */}
        <section id="skills" className="py-32 px-6 bg-[#121212] border-t border-zinc-900/50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 } },
            }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-col items-center justify-center mt-6 mb-20"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#4dabf7] via-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(77,171,247,0.3)] pb-2">
                Technical Skills
              </h2>
            </motion.div>

            <div className="flex flex-col gap-12 max-w-4xl mx-auto text-left">
              {/* Category: Data Analysis */}
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="relative pl-8 border-l-2 border-[#4dabf7]/40">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#4dabf7] shadow-[0_0_10px_#4dabf7]"></div>
                <div className="group relative -ml-4 -mr-4 px-4 py-2 mb-4 cursor-default overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-[#4dabf7]/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-out rounded-xl"></div>
                  <h4 className="relative text-xl font-bold text-[#4dabf7] tracking-wide group-hover:translate-x-2 transition-transform duration-400 ease-out">Data Analysis</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ y: -2 }} className="group px-5 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-3 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(55,118,171,0.3)] group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-zinc-200 font-medium">Python</span>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} className="group px-5 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-3 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300">
                    <div className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center">
                      <img src="/logo/sql-new-logo.png" alt="SQL Logo" className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(77,171,247,0.3)] scale-[1.8] md:scale-[2.0] translate-y-1 group-hover:scale-[1.95] md:group-hover:scale-[2.15] transition-transform duration-300 pointer-events-none" />
                    </div>
                    <span className="text-zinc-200 font-medium">PostgreSQL</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Category: Visualization */}
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="relative pl-8 border-l-2 border-[#4dabf7]/40">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#4dabf7] shadow-[0_0_10px_#4dabf7]"></div>
                <div className="group relative -ml-4 -mr-4 px-4 py-2 mb-4 cursor-default overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-[#4dabf7]/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-out rounded-xl"></div>
                  <h4 className="relative text-xl font-bold text-[#4dabf7] tracking-wide group-hover:translate-x-2 transition-transform duration-400 ease-out">Visualization</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ y: -2 }} className="group px-5 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-3 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300">
                    <div className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" className="w-full h-full text-[#F2C811] drop-shadow-[0_2px_10px_rgba(242,200,17,0.3)]" fill="currentColor">
                        <path d="M10.154 5.923v16.154h-4V5.923h4zm5.541-4.846v21H11.69v-21h4.005zm5.536 9.692v11.308h-4V10.769h4zM4.615 15.615v6.462h-4v-6.462h4z" />
                      </svg>
                    </div>
                    <span className="text-zinc-200 font-medium">Power BI</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Category: Cloud */}
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="relative pl-8 border-l-2 border-[#4dabf7]/40">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#4dabf7] shadow-[0_0_10px_#4dabf7]"></div>
                <div className="group relative -ml-4 -mr-4 px-4 py-2 mb-4 cursor-default overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-[#4dabf7]/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-out rounded-xl"></div>
                  <h4 className="relative text-xl font-bold text-[#4dabf7] tracking-wide group-hover:translate-x-2 transition-transform duration-400 ease-out">Cloud</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ y: -2 }} className="group px-5 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-3 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain drop-shadow-[0_2px_10px_rgba(255,153,0,0.3)] group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-zinc-200 font-medium">AWS <span className="text-zinc-500 font-normal ml-1 text-sm">(basic)</span></span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Category: Tools */}
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="relative pl-8 border-l-2 border-[#4dabf7]/40">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#4dabf7] shadow-[0_0_10px_#4dabf7]"></div>
                <div className="group relative -ml-4 -mr-4 px-4 py-2 mb-4 cursor-default overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-[#4dabf7]/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-out rounded-xl"></div>
                  <h4 className="relative text-xl font-bold text-[#4dabf7] tracking-wide group-hover:translate-x-2 transition-transform duration-400 ease-out">Tools</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ y: -2 }} className="group px-5 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-3 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-300 invert" />
                    <span className="text-zinc-200 font-medium">Git & GitHub</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Category: AI & Automation */}
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="relative pl-8 border-l-2 border-[#4dabf7]/40">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#4dabf7] shadow-[0_0_10px_#4dabf7]"></div>
                <div className="group relative -ml-4 -mr-4 px-4 py-2 mb-4 cursor-default overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-[#4dabf7]/10 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-out rounded-xl"></div>
                  <h4 className="relative text-xl font-bold text-[#4dabf7] tracking-wide group-hover:translate-x-2 transition-transform duration-400 ease-out">AI & Automation</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ y: -2 }} className="group px-5 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-3 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 drop-shadow-[0_2px_10px_rgba(16,163,127,0.4)] group-hover:scale-110 transition-transform duration-300" fill="none">
                      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="#10a37f"/>
                    </svg>
                    <span className="text-zinc-200 font-medium">ChatGPT</span>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} className="group px-5 py-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center gap-3 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 shadow-sm hover:shadow-[0_0_20px_rgba(77,171,247,0.15)] transition-all duration-300">
                    <img src="/logo/claude_logo.jpg" alt="Claude Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(204,133,61,0.4)] group-hover:scale-110 transition-transform duration-300 rounded-sm" />
                    <span className="text-zinc-200 font-medium">Claude</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-24 bg-[#0a0a0a] border-t border-zinc-900/50">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.2 } },
            }}
            className="max-w-6xl mx-auto px-6 lg:px-12"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center gap-6 mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Certifications
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Python Certification */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                onClick={() => setActiveCert({ title: "Data Analysis with Python", issuer: "IBM (Cognitive Class)", image: "/certificates/data analysis with python.png" })}
                className="group relative bg-[#121212] rounded-2xl p-6 border border-zinc-800/60 overflow-hidden cursor-pointer shadow-lg shadow-black/40 hover:shadow-[0_8px_40px_rgba(59,130,246,0.15)] hover:border-blue-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl mix-blend-overlay"></div>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6 border border-zinc-800">
                  <Image
                    src="/certificates/data analysis with python.png"
                    alt="Data Analysis with Python"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full font-medium transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      View Certificate
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-blue-400 transition-colors">
                  Data Analysis with Python
                </h3>
                <p className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  IBM (Cognitive Class)
                </p>
              </motion.div>

              {/* Data Analysis Cert */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                onClick={() => setActiveCert({ title: "Introduction to Data Analytics", issuer: "Simplilearn SkillUp", image: "/certificates/introduction to data analysis.png" })}
                className="group relative bg-[#121212] rounded-2xl p-6 border border-zinc-800/60 overflow-hidden cursor-pointer shadow-lg shadow-black/40 hover:shadow-[0_8px_40px_rgba(20,184,166,0.15)] hover:border-teal-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl mix-blend-overlay"></div>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6 border border-zinc-800">
                  <Image
                    src="/certificates/introduction to data analysis.png"
                    alt="Introduction to Data Analysis"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full font-medium transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      View Certificate
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-teal-400 transition-colors">
                  Intro to Data Analytics
                </h3>
                <p className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  Simplilearn SkillUp
                </p>
              </motion.div>

              {/* SQL Certification */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                onClick={() => setActiveCert({ title: "SQL & Relational Databases", issuer: "Skill Course (Learn More Pro)", image: "/certificates/sql.png" })}
                className="group relative bg-[#121212] rounded-2xl p-6 border border-zinc-800/60 overflow-hidden cursor-pointer shadow-lg shadow-black/40 hover:shadow-[0_8px_40px_rgba(16,185,129,0.15)] hover:border-emerald-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl mix-blend-overlay"></div>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6 border border-zinc-800">
                  <Image
                    src="/certificates/sql.png"
                    alt="SQL Database"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full font-medium transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      View Certificate
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-emerald-400 transition-colors">
                  SQL Foundation
                </h3>
                <p className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Skill Course (Learn More Pro)
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>


        {/* Modal for Certificate Zoom */}
        <AnimatePresence>
          {activeCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCert(null)}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-5xl w-full bg-[#111] rounded-2xl border border-zinc-800 shadow-2xl p-2 md:p-4"
              >
                <button
                  onClick={() => setActiveCert(null)}
                  className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-10 h-10 md:w-12 md:h-12 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full flex items-center justify-center transition-colors border border-zinc-700 shadow-xl z-10"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                <div className="relative w-full aspect-[1.4] rounded-lg md:rounded-xl overflow-hidden bg-black/50">
                  <Image
                    src={activeCert.image}
                    alt={activeCert.title}
                    fill
                    className="object-contain"
                    quality={100}
                  />
                </div>
                <div className="mt-4 md:mt-6 text-center pb-2">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{activeCert.title}</h3>
                  <p className="text-zinc-400 font-medium">Issued by: {activeCert.issuer}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>


      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-[#0a0a0a] border-t border-zinc-900/50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto flex flex-col items-center text-center"
        >
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 flex items-center justify-center gap-3">
              <span className="text-blue-400">👉</span> Let&apos;s Connect
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
            {/* Email Card */}
            <a
              href="mailto:nikhilydv1026@gmail.com"
              className="group flex flex-col items-center p-8 bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:border-blue-500/30 cursor-pointer"
            >
              <div className="w-14 h-14 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-300 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors duration-300">
                <img src="/logo/email.png" alt="Email Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-1">Email</h3>
              <p className="text-zinc-400 text-sm font-medium group-hover:text-zinc-200 transition-colors break-all">
                nikhilydv1026@gmail.com
              </p>
            </a>

            {/* LinkedIn Card */}
            <a
              href="https://www.linkedin.com/in/nikhilydv1026"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-8 bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(10,102,194,0.15)] hover:border-[#0A66C2]/30 cursor-pointer"
            >
              <div className="w-14 h-14 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-300 group-hover:text-[#0A66C2] group-hover:bg-[#0A66C2]/10 transition-colors duration-300">
                <img src="/logo/linkedin.png" alt="LinkedIn Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-1">LinkedIn</h3>
              <p className="text-zinc-400 text-sm font-medium group-hover:text-zinc-200 transition-colors">
                nikhilydv1026
              </p>
            </a>

            {/* GitHub Card */}
            <a
              href="https://github.com/nikhilydv1026"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-8 bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:border-zinc-400/30 cursor-pointer"
            >
              <div className="w-14 h-14 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-zinc-700/50 transition-colors duration-300">
                <img src="/logo/github.png" alt="GitHub Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-1">GitHub</h3>
              <p className="text-zinc-400 text-sm font-medium group-hover:text-zinc-200 transition-colors">
                nikhilydv1026
              </p>
            </a>
          </div>

          <p className="text-zinc-300 font-medium text-base md:text-lg flex items-center justify-center gap-2">
            <span className="text-xl">👉</span> &quot;Open to internships, collaborations, and opportunities.&quot;
          </p>
        </motion.div>
      </section>

      {/* SEO Footer */}
      <footer className="py-8 px-6 bg-black border-t border-zinc-900/50">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a
              href="https://www.linkedin.com/in/nikhilydv1026"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              Nikhil Yadav LinkedIn
            </a>
            <span className="text-zinc-700">·</span>
            <a
              href="https://github.com/nikhilydv1026"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors"
            >
              Nikhil Yadav GitHub
            </a>
            <span className="text-zinc-700">·</span>
            <a
              href="/nikhil-yadav"
              className="hover:text-blue-400 transition-colors"
            >
              About Nikhil Yadav
            </a>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Nikhil Yadav (Nikhil Ydv). All rights reserved.
          </p>
        </div>
      </footer>

    </>
  );
}






