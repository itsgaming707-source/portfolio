"use client";

import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import ParticleNetwork from "@/components/ParticleNetwork";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const el = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [activeCert, setActiveCert] = useState<{ title: string, issuer: string, image: string } | null>(null);
  const [activeTab, setActiveTab] = useState("Home");
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleThemeToggle = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const nextTheme = isDark ? "light" : "dark";
      window.dispatchEvent(new CustomEvent("theme-switch", { detail: { x, y, nextTheme } }));
    }
    toggleTheme();
  };

  const handleThemeHover = (e: React.MouseEvent<HTMLElement>, active: boolean) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    window.dispatchEvent(new CustomEvent("theme-hover", { detail: { active, x, y } }));
  };

  const backgroundGlow = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, ${isDark ? 'rgba(0, 150, 255, 0.15)' : 'rgba(225, 29, 72, 0.08)'}, transparent 40%)`;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stickyContainerRef,
    offset: ["start start", "end start"]
  });

  const [targetX, setTargetX] = useState(0);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const profileScale = useTransform(scrollYProgress, (p) => {
    if (typeof window === 'undefined') return 1;
    const progress = Math.min(p / 0.6, 1);
    const ease = progress * progress * (3 - 2 * progress);
    return window.innerWidth < 768 ? 1 - (ease * 0.3) : 1 - (ease * 0.1); // Scales down slightly so About size stays the same
  });

  const profileX = useTransform(scrollYProgress, (p) => {
    if (typeof window === 'undefined') return 0;
    const w = window.innerWidth;
    let targetX = 0;
    if (w >= 1024) {
      targetX = -(w / 2) + 260; // Always exactly 260px from the left edge of the screen
    } else if (w >= 768) {
      targetX = -w * 0.38; // Responsive for medium screens
    }
    const progress = Math.min(p / 0.6, 1);
    const ease = progress * progress * (3 - 2 * progress);
    return ease * targetX;
  });

  const profileOpacity = useTransform(scrollYProgress, (p) => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 768) return 1;
    const progress = Math.min(p / 0.4, 1);
    return 1 - progress;
  });

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
        <div className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] ${isDark ? 'bg-blue-500/5' : 'bg-rose-400/8'}`}></div>
        <div className={`absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px] ${isDark ? 'bg-blue-900/5' : 'bg-rose-300/6'}`}></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 border-b transition-colors duration-400 ${isDark ? 'bg-black/40 backdrop-blur-md border-white/5 shadow-lg' : 'bg-[rgba(255,253,251,0.72)] backdrop-blur-[12px] border-slate-900/[0.06] shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.03)]'}`}>
        <div className="flex justify-between md:justify-center items-center max-w-6xl mx-auto px-6 md:px-8 h-16 w-full">
          {/* Theme Toggle - Desktop (left side) */}
          <motion.button
            onClick={handleThemeToggle}
            onPointerEnter={(e) => handleThemeHover(e, true)}
            onPointerLeave={(e) => handleThemeHover(e, false)}
            className={`hidden md:flex absolute left-6 flex-col items-center gap-1 cursor-pointer group`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            <motion.div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-400 ${isDark ? 'border-zinc-600 bg-zinc-900/50 group-hover:border-zinc-400' : 'border-zinc-300 bg-white/80 group-hover:border-zinc-500'}`}
              animate={{ rotate: isDark ? 0 : 180 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {isDark ? (
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </motion.div>
            <span className={`text-[10px] font-semibold tracking-wider uppercase transition-colors duration-400 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {isDark ? 'DARK' : 'LIGHT'}
            </span>
          </motion.button>

          {/* Desktop Links */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-10 font-sans tracking-tight text-sm"
          >
            <a href="#home" onClick={() => setActiveTab('Home')} className={`cursor-pointer transition-colors ${activeTab === 'Home' ? (isDark ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-[#e11d48] font-semibold border-b-2 border-[#e11d48] pb-0.5') : (isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]')}`}>Home</a>
            <a href="#about" onClick={() => setActiveTab('About')} className={`cursor-pointer transition-colors ${activeTab === 'About' ? (isDark ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-[#e11d48] font-semibold border-b-2 border-[#e11d48] pb-0.5') : (isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]')}`}>About</a>
            <a href="#projects" onClick={() => setActiveTab('Projects')} className={`cursor-pointer transition-colors ${activeTab === 'Projects' ? (isDark ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-[#e11d48] font-semibold border-b-2 border-[#e11d48] pb-0.5') : (isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]')}`}>Projects</a>
            <a href="#skills" onClick={() => setActiveTab('Skills')} className={`cursor-pointer transition-colors ${activeTab === 'Skills' ? (isDark ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-[#e11d48] font-semibold border-b-2 border-[#e11d48] pb-0.5') : (isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]')}`}>Skills</a>
            <a href="#certifications" onClick={() => setActiveTab('Certifications')} className={`cursor-pointer transition-colors ${activeTab === 'Certifications' ? (isDark ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-[#e11d48] font-semibold border-b-2 border-[#e11d48] pb-0.5') : (isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]')}`}>Certifications</a>
            <a href="#contact" onClick={() => setActiveTab('Contact')} className={`cursor-pointer transition-colors ${activeTab === 'Contact' ? (isDark ? 'text-blue-400 font-medium border-b border-blue-400/50 pb-1' : 'text-[#e11d48] font-semibold border-b-2 border-[#e11d48] pb-0.5') : (isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]')}`}>Contact</a>
          </motion.div>

          <div className="flex items-center gap-4 md:hidden">
            {/* Theme Toggle - Mobile */}
            <button
              onClick={handleThemeToggle}
              onPointerEnter={(e) => handleThemeHover(e, true)}
              onPointerLeave={(e) => handleThemeHover(e, false)}
              className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors duration-300 ${isDark ? 'border-zinc-700 text-amber-400' : 'border-zinc-300 text-slate-700'}`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            {/* Mobile Menu Toggle Button */}
            <button
              className={`transition-colors flex items-center justify-center p-1 ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
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
              className={`md:hidden backdrop-blur-xl border-b overflow-hidden ${isDark ? 'bg-[#0a0a0a]/95 border-white/5' : 'bg-white/95 border-black/5'}`}
            >
              <div className="flex flex-col space-y-5 px-6 py-8 font-sans tracking-tight text-base">
                <a href="#home" onClick={() => handleMobileNavClick('Home')} className={`cursor-pointer transition-colors ${activeTab === 'Home' ? 'text-[#e11d48] font-semibold' : isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]'}`}>Home</a>
                <a href="#about" onClick={() => handleMobileNavClick('About')} className={`cursor-pointer transition-colors ${activeTab === 'About' ? 'text-[#e11d48] font-semibold' : isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]'}`}>About</a>
                <a href="#projects" onClick={() => handleMobileNavClick('Projects')} className={`cursor-pointer transition-colors ${activeTab === 'Projects' ? 'text-[#e11d48] font-semibold' : isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]'}`}>Projects</a>
                <a href="#skills" onClick={() => handleMobileNavClick('Skills')} className={`cursor-pointer transition-colors ${activeTab === 'Skills' ? 'text-[#e11d48] font-semibold' : isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]'}`}>Skills</a>
                <a href="#certifications" onClick={() => handleMobileNavClick('Certifications')} className={`cursor-pointer transition-colors ${activeTab === 'Certifications' ? 'text-[#e11d48] font-semibold' : isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]'}`}>Certifications</a>
                <a href="#contact" onClick={() => handleMobileNavClick('Contact')} className={`cursor-pointer transition-colors ${activeTab === 'Contact' ? 'text-[#e11d48] font-semibold' : isDark ? 'text-zinc-400 hover:text-zinc-100' : 'text-slate-600 hover:text-[#e11d48]'}`}>Contact</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        <div className="relative">
          {/* Sticky Profile Image */}
          <div ref={stickyContainerRef} className="absolute inset-x-0 top-0 h-[calc(100svh+220px)] md:h-[calc(100svh+280px)] pointer-events-none z-30">
            <div className="sticky top-[calc(22vh+56px)] md:top-[calc(28vh+56px)] flex justify-center w-full h-0">
              <motion.div
                style={{ x: profileX, scale: profileScale, opacity: profileOpacity }}
                className="pointer-events-auto relative flex justify-center items-center origin-center group cursor-pointer"
              >
                {/* Background Glow */}
                <div
                  className="absolute rounded-full transition-transform duration-500 pointer-events-none"
                  style={{
                    width: "150%",
                    height: "150%",
                    background: isDark
                      ? "radial-gradient(circle, rgba(244,208,63,0.2) 0%, rgba(220,201,163,0.08) 40%, transparent 60%)"
                      : "radial-gradient(circle, rgba(225,29,72,0.15) 0%, rgba(251,113,133,0.08) 35%, rgba(253,164,175,0.03) 55%, transparent 65%)",
                    transform: isDark ? "scale(1.8)" : "scale(2.2)",
                    filter: isDark ? "blur(15px)" : "blur(20px)",
                    zIndex: -1,
                  }}
                />

                {/* Profile Image Wrapper */}
                <div className={`w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] rounded-full p-[2px] relative transition-all duration-500 group-hover:scale-[1.05] ${isDark
                  ? "bg-gradient-to-b from-[#FFD700] via-[#F4D03F] to-[#eeca59] shadow-[0_0_25px_rgba(244,208,63,0.25)] group-hover:shadow-[0_0_40px_rgba(244,208,63,0.45)]"
                  : "bg-gradient-to-b from-[#E11D48] via-[#FB7185] to-[#BE123C] shadow-[0_0_25px_rgba(225,29,72,0.25)] group-hover:shadow-[0_0_40px_rgba(225,29,72,0.45)]"
                  }`}>
                  <div className={`w-full h-full rounded-full overflow-hidden relative ${isDark ? 'bg-[#121212]' : 'bg-white'}`}>
                    <Image
                      alt="Nikhil Yadav Profile"
                      src="/main-photo.png"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Hero Section */}
          <section
            id="home"
            className="relative min-h-[100svh] flex flex-col items-center pt-[22vh] md:pt-[28vh] px-4 md:px-6 overflow-hidden"
            style={{ background: isDark ? "#000000" : "linear-gradient(135deg, #FFF7F8 0%, #FFFFFF 35%, #FFF5F7 70%, #FFFFFF 100%)", transition: "background 0.4s ease" }}
            onMouseMove={handleMouseMove}
          >
            {/* Particle Network Background */}
            <ParticleNetwork theme={theme} />

            {/* Blue/Rose gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: isDark
                  ? "radial-gradient(circle at center, rgba(14,165,233,0.05) 0%, transparent 60%)"
                  : "radial-gradient(circle at center, rgba(225,29,72,0.07) 0%, rgba(251,113,133,0.03) 40%, transparent 65%)",
                zIndex: 2,
              }}
            />

            {/* Interactive Mouse Glow */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                background: backgroundGlow,
                zIndex: 3,
              }}
            />

            <div className="relative z-10 flex flex-col items-center w-full" style={{ zIndex: 10 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative mt-[56px] -mb-[56px] group"
              >
                <div className="profile-wrapper w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] pointer-events-none opacity-0" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`text-[clamp(2.5rem,8vw,4rem)] md:text-7xl font-extrabold tracking-tight mb-3 md:mb-4 text-center inline-block text-transparent bg-clip-text max-w-[90vw] overflow-hidden ${isDark ? 'bg-gradient-to-r from-[#d6c1a3] via-[#f5e6c8] to-[#c7a77a]' : 'bg-gradient-to-r from-[#0F172A] via-[#E11D48] to-[#0F172A]'}`}
              >
                <span ref={el} className="px-2"></span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-8"
              >
                <p className={`font-semibold tracking-widest md:tracking-[0.25em] uppercase text-[14px] sm:text-[15px] md:text-base text-center leading-relaxed md:leading-normal max-w-[280px] sm:max-w-md md:max-w-full mx-auto ${isDark ? 'text-[#4dabf7]' : 'text-[#e11d48]'}`}>
                  Data Analyst | SQL | Python | Power BI
                </p>
              </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.a
              href="#about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className={`absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 ${isDark ? 'text-zinc-500 hover:text-blue-400' : 'text-slate-400 hover:text-rose-500'} transition-colors duration-300`}
              onClick={() => setActiveTab('About')}
            >
              <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.a>
          </section>

          {/* About Section */}
          <section id="about" className={`relative py-28 md:py-32 px-6 transition-colors duration-400 border-t ${isDark ? 'border-white/5' : 'border-slate-100/50'}`} style={{ background: isDark ? '#071122' : 'linear-gradient(180deg, #FFFFFF 0%, #FFF7F8 50%, #FFFFFF 100%)' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: -60 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 } },
              }}
              className="max-w-2xl mx-auto text-center"
            >
              <motion.h2 variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-10 ${isDark ? 'text-zinc-100' : 'text-[#0f172a]'}`}>
                About Me
              </motion.h2>
              <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className={`space-y-4 leading-snug text-base md:text-lg font-light text-center ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
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
        </div>

        {/* Projects Section */}
        <section id="projects" className={`py-32 px-6 border-t transition-colors duration-400 ${isDark ? 'border-zinc-900/50' : 'border-slate-100'}`} style={{ background: isDark ? '#0a0a0a' : 'linear-gradient(135deg, #FFFFFF 0%, #FFF7F8 40%, #FFFFFF 80%, #FFF5F7 100%)' }}>
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
              <h2 className={`text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-blue-400 via-teal-400 to-emerald-400' : 'from-[#e11d48] via-rose-500 to-[#be123c]'}`}>
                Projects
              </h2>
              <div className={`h-px flex-1 bg-gradient-to-r ${isDark ? 'from-zinc-800 to-transparent' : 'from-rose-200 to-transparent'}`}></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project 1 - Blinkit */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className={`group relative rounded-2xl p-8 border overflow-hidden shadow-lg transition-all duration-300 flex flex-col h-full ${isDark ? 'bg-[#121212] border-blue-500/30 shadow-black/40 hover:shadow-[0_8px_40px_rgba(59,130,246,0.2)] hover:border-blue-400/50' : 'bg-white border-slate-100 shadow-slate-200/50 hover:shadow-[0_8px_40px_rgba(225,29,72,0.1)] hover:border-rose-300'}`}
              >

                <h3 className={`text-2xl font-bold mb-3 transition-colors pr-20 ${isDark ? 'text-zinc-100 group-hover:text-blue-400' : 'text-[#0f172a] group-hover:text-[#e11d48]'}`}>Blinkit Sales Analysis</h3>
                <p className={`mb-6 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Performed end-to-end analysis of Blinkit sales data using Python to uncover trends in product performance, pricing, and outlet impact.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>Python</span>
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>Pandas</span>
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>Seaborn</span>
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>EDA</span>
                </div>
                <div className="mb-8">
                  <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>Key Insights:</h4>
                  <ul className={`space-y-2 text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-blue-400' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Tier 1 &amp; 2 outlets outperform Tier 3 in average sales</li>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-blue-400' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Pricing has a stronger impact on sales than item visibility</li>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-blue-400' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Supermarket Type 1 contributes highest sales volume</li>
                  </ul>
                </div>
                <div className="flex items-center gap-4 mt-auto pt-4">
                  <a href="https://github.com/nikhilydv1026/blinkit-sales-analysis-python" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300 border ${isDark ? 'text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border-white/5' : 'text-white bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] border-transparent shadow-[0_4px_12px_rgba(225,29,72,0.15)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.3)] hover:-translate-y-0.5'}`}>
                    <img src="/logo/github.png" alt="GitHub" className="w-5 h-5 invert" /> GitHub
                  </a>
                </div>
              </motion.div>

              {/* Project 2 - Customer Analytics */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className={`group relative rounded-2xl p-8 border overflow-hidden shadow-lg transition-all duration-300 flex flex-col h-full ${isDark ? 'bg-[#121212] border-teal-500/30 shadow-black/40 hover:shadow-[0_8px_40px_rgba(20,184,166,0.2)] hover:border-teal-400/50' : 'bg-white border-slate-100 shadow-slate-200/50 hover:shadow-[0_8px_40px_rgba(225,29,72,0.1)] hover:border-rose-300'}`}
              >

                <h3 className={`text-2xl font-bold mb-3 transition-colors pr-20 ${isDark ? 'text-zinc-100 group-hover:text-teal-400' : 'text-[#0f172a] group-hover:text-[#e11d48]'}`}>Customer Analytics Project</h3>
                <p className={`mb-6 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  End-to-end customer behavior analysis using Python, SQL, and Power BI to identify trends and improve business decision-making.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>Python</span>
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>SQL</span>
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>Power BI</span>
                </div>
                <div className="mb-8">
                  <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>Key Insights:</h4>
                  <ul className={`space-y-2 text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-teal-400' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Identified high-value customer segments</li>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-teal-400' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Analyzed purchasing patterns across categories</li>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-teal-400' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Built interactive dashboard for business insights</li>
                  </ul>
                </div>
                <div className="flex items-center gap-4 mt-auto pt-4">
                  <a href="https://github.com/nikhilydv1026/customer-analytics-project" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300 border ${isDark ? 'text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border-white/5' : 'text-white bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] border-transparent shadow-[0_4px_12px_rgba(225,29,72,0.15)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.3)] hover:-translate-y-0.5'}`}>
                    <img src="/logo/github.png" alt="GitHub" className="w-5 h-5 invert" /> GitHub
                  </a>
                </div>
              </motion.div>

              {/* Project 3 - Zepto */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className={`group relative rounded-2xl p-8 border overflow-hidden shadow-lg transition-all duration-300 flex flex-col h-full ${isDark ? 'bg-[#121212] border-zinc-800/60 shadow-black/40 hover:border-zinc-400/40 hover:shadow-[0_8px_40px_rgba(161,161,170,0.1)]' : 'bg-white border-slate-100 shadow-slate-200/50 hover:shadow-[0_8px_40px_rgba(225,29,72,0.1)] hover:border-rose-300'}`}
              >
                <h3 className={`text-2xl font-bold mb-3 transition-colors pr-20 ${isDark ? 'text-zinc-100 group-hover:text-zinc-300' : 'text-[#0f172a] group-hover:text-[#e11d48]'}`}>Zepto SQL Data Analysis</h3>
                <p className={`mb-6 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Analyzed e-commerce inventory dataset using SQL to extract business insights related to pricing, stock, and product performance.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>SQL</span>
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>PostgreSQL</span>
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>Data Cleaning</span>
                </div>
                <div className="mb-8">
                  <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>Key Insights:</h4>
                  <ul className={`space-y-2 text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-zinc-300' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Identified top discounted and high-demand products</li>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-zinc-300' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Found high-value items that are out of stock</li>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-zinc-300' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Analyzed revenue contribution by category</li>
                  </ul>
                </div>
                <div className="flex items-center gap-4 mt-auto pt-4">
                  <a href="https://github.com/nikhilydv1026/zepto-sql-data-analysis" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300 border ${isDark ? 'text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border-white/5' : 'text-white bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] border-transparent shadow-[0_4px_12px_rgba(225,29,72,0.15)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.3)] hover:-translate-y-0.5'}`}>
                    <img src="/logo/github.png" alt="GitHub" className="w-5 h-5 invert" /> GitHub
                  </a>
                </div>
              </motion.div>

              {/* Project 4 - Spam Detection */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className={`group relative rounded-2xl p-8 border overflow-hidden shadow-lg transition-all duration-300 flex flex-col h-full ${isDark ? 'bg-[#121212] border-zinc-800/60 shadow-black/40 hover:border-zinc-400/40 hover:shadow-[0_8px_40px_rgba(161,161,170,0.1)]' : 'bg-white border-slate-100 shadow-slate-200/50 hover:shadow-[0_8px_40px_rgba(225,29,72,0.1)] hover:border-rose-300'}`}
              >
                <h3 className={`text-2xl font-bold mb-3 transition-colors pr-20 ${isDark ? 'text-zinc-100 group-hover:text-zinc-300' : 'text-[#0f172a] group-hover:text-[#e11d48]'}`}>Spam Detection Using Naive Bayes</h3>
                <p className={`mb-6 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Built a spam classification system from scratch using pure Python without any machine learning libraries.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>Python</span>
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>Probability</span>
                  <span className={`text-xs px-3 py-1 rounded-md ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-rose-50 text-rose-700 font-medium'}`}>NLP</span>
                </div>
                <div className="mb-8">
                  <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>Key Insights:</h4>
                  <ul className={`space-y-2 text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-zinc-300' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Implemented Naive Bayes with Laplace smoothing</li>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-zinc-300' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Used log-space computation for numerical stability</li>
                    <li className="flex items-start gap-2"><span className={`${isDark ? 'text-zinc-300' : 'text-[#e11d48] font-bold'} mt-0.5`}>•</span> Classifies messages with probability-based scoring</li>
                  </ul>
                </div>
                <div className="flex items-center gap-4 mt-auto pt-4">
                  <a href="https://github.com/nikhilydv1026/spam-detection-naive-bayes" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300 border ${isDark ? 'text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border-white/5' : 'text-white bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] border-transparent shadow-[0_4px_12px_rgba(225,29,72,0.15)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.3)] hover:-translate-y-0.5'}`}>
                    <img src="/logo/github.png" alt="GitHub" className="w-5 h-5 invert" /> GitHub
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Technical Skills Section */}
        <section id="skills" className={`py-32 px-6 border-t transition-colors duration-400 ${isDark ? 'border-zinc-900/50' : 'border-slate-100'}`} style={{ background: isDark ? '#121212' : 'linear-gradient(180deg, #FFF7F8 0%, #FFFFFF 50%, #FFF5F7 100%)' }}>
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
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight pb-2 bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-[#4dabf7] via-cyan-400 to-teal-400 drop-shadow-[0_0_15px_rgba(77,171,247,0.3)]' : 'from-[#e11d48] via-rose-500 to-[#be123c]'}`}>
                Technical Skills
              </h2>
            </motion.div>

            <div className="flex flex-col gap-12 max-w-4xl mx-auto text-left">
              {/* Category: Data Analysis */}
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className={`relative pl-8 border-l-2 ${isDark ? 'border-[#4dabf7]/40' : 'border-[#e11d48]/30'}`}>
                <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${isDark ? 'bg-[#4dabf7] shadow-[0_0_10px_#4dabf7]' : 'bg-[#e11d48] shadow-[0_0_10px_rgba(225,29,72,0.5)]'}`}></div>
                <div className="group relative -ml-4 -mr-4 px-4 py-2 mb-4 cursor-default overflow-hidden rounded-xl">
                  <div className={`absolute inset-0 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-out rounded-xl bg-gradient-to-r ${isDark ? 'from-teal-500/10 to-[#4dabf7]/10' : 'from-rose-500/5 to-[#e11d48]/5'}`}></div>
                  <h4 className={`relative text-xl font-bold tracking-wide group-hover:translate-x-2 transition-transform duration-400 ease-out ${isDark ? 'text-[#4dabf7]' : 'text-[#e11d48]'}`}>Data Analysis</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ y: -2 }} className={`group px-5 py-3 border rounded-xl flex items-center gap-3 shadow-sm transition-all duration-300 ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 hover:shadow-[0_0_20px_rgba(77,171,247,0.15)]' : 'bg-white border-slate-100 hover:border-[#e11d48]/50 hover:bg-[#e11d48]/5 hover:shadow-[0_0_20px_rgba(225,29,72,0.1)]'}`}>
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(55,118,171,0.3)] group-hover:scale-110 transition-transform duration-300" />
                    <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-[#0f172a]'}`}>Python</span>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} className={`group px-5 py-3 border rounded-xl flex items-center gap-3 shadow-sm transition-all duration-300 ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 hover:shadow-[0_0_20px_rgba(77,171,247,0.15)]' : 'bg-white border-slate-100 hover:border-[#e11d48]/50 hover:bg-[#e11d48]/5 hover:shadow-[0_0_20px_rgba(225,29,72,0.1)]'}`}>
                    <div className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center">
                      <img src="/logo/sql-new-logo.png" alt="SQL Logo" className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(77,171,247,0.3)] scale-[1.8] md:scale-[2.0] translate-y-1 group-hover:scale-[1.95] md:group-hover:scale-[2.15] transition-transform duration-300 pointer-events-none" />
                    </div>
                    <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-[#0f172a]'}`}>PostgreSQL</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Category: Visualization */}
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className={`relative pl-8 border-l-2 ${isDark ? 'border-[#4dabf7]/40' : 'border-[#e11d48]/30'}`}>
                <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${isDark ? 'bg-[#4dabf7] shadow-[0_0_10px_#4dabf7]' : 'bg-[#e11d48] shadow-[0_0_10px_rgba(225,29,72,0.5)]'}`}></div>
                <div className="group relative -ml-4 -mr-4 px-4 py-2 mb-4 cursor-default overflow-hidden rounded-xl">
                  <div className={`absolute inset-0 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-out rounded-xl bg-gradient-to-r ${isDark ? 'from-teal-500/10 to-[#4dabf7]/10' : 'from-rose-500/5 to-[#e11d48]/5'}`}></div>
                  <h4 className={`relative text-xl font-bold tracking-wide group-hover:translate-x-2 transition-transform duration-400 ease-out ${isDark ? 'text-[#4dabf7]' : 'text-[#e11d48]'}`}>Visualization</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ y: -2 }} className={`group px-5 py-3 border rounded-xl flex items-center gap-3 shadow-sm transition-all duration-300 ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 hover:shadow-[0_0_20px_rgba(77,171,247,0.15)]' : 'bg-white border-slate-100 hover:border-[#e11d48]/50 hover:bg-[#e11d48]/5 hover:shadow-[0_0_20px_rgba(225,29,72,0.1)]'}`}>
                    <div className="relative w-6 h-6 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" className="w-full h-full text-[#F2C811] drop-shadow-[0_2px_10px_rgba(242,200,17,0.3)]" fill="currentColor">
                        <path d="M10.154 5.923v16.154h-4V5.923h4zm5.541-4.846v21H11.69v-21h4.005zm5.536 9.692v11.308h-4V10.769h4zM4.615 15.615v6.462h-4v-6.462h4z" />
                      </svg>
                    </div>
                    <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-[#0f172a]'}`}>Power BI</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Category: Cloud */}
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className={`relative pl-8 border-l-2 ${isDark ? 'border-[#4dabf7]/40' : 'border-[#e11d48]/30'}`}>
                <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${isDark ? 'bg-[#4dabf7] shadow-[0_0_10px_#4dabf7]' : 'bg-[#e11d48] shadow-[0_0_10px_rgba(225,29,72,0.5)]'}`}></div>
                <div className="group relative -ml-4 -mr-4 px-4 py-2 mb-4 cursor-default overflow-hidden rounded-xl">
                  <div className={`absolute inset-0 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-out rounded-xl bg-gradient-to-r ${isDark ? 'from-teal-500/10 to-[#4dabf7]/10' : 'from-rose-500/5 to-[#e11d48]/5'}`}></div>
                  <h4 className={`relative text-xl font-bold tracking-wide group-hover:translate-x-2 transition-transform duration-400 ease-out ${isDark ? 'text-[#4dabf7]' : 'text-[#e11d48]'}`}>Cloud</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ y: -2 }} className={`group px-5 py-3 border rounded-xl flex items-center gap-3 shadow-sm transition-all duration-300 ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 hover:shadow-[0_0_20px_rgba(77,171,247,0.15)]' : 'bg-white border-slate-100 hover:border-[#e11d48]/50 hover:bg-[#e11d48]/5 hover:shadow-[0_0_20px_rgba(225,29,72,0.1)]'}`}>
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain drop-shadow-[0_2px_10px_rgba(255,153,0,0.3)] group-hover:scale-110 transition-transform duration-300" />
                    <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-[#0f172a]'}`}>AWS <span className={`font-normal ml-1 text-sm ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>(basic)</span></span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Category: Tools */}
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className={`relative pl-8 border-l-2 ${isDark ? 'border-[#4dabf7]/40' : 'border-[#e11d48]/30'}`}>
                <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${isDark ? 'bg-[#4dabf7] shadow-[0_0_10px_#4dabf7]' : 'bg-[#e11d48] shadow-[0_0_10px_rgba(225,29,72,0.5)]'}`}></div>
                <div className="group relative -ml-4 -mr-4 px-4 py-2 mb-4 cursor-default overflow-hidden rounded-xl">
                  <div className={`absolute inset-0 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-out rounded-xl bg-gradient-to-r ${isDark ? 'from-teal-500/10 to-[#4dabf7]/10' : 'from-rose-500/5 to-[#e11d48]/5'}`}></div>
                  <h4 className={`relative text-xl font-bold tracking-wide group-hover:translate-x-2 transition-transform duration-400 ease-out ${isDark ? 'text-[#4dabf7]' : 'text-[#e11d48]'}`}>Tools</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ y: -2 }} className={`group px-5 py-3 border rounded-xl flex items-center gap-3 shadow-sm transition-all duration-300 ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 hover:shadow-[0_0_20px_rgba(77,171,247,0.15)]' : 'bg-white border-slate-100 hover:border-[#e11d48]/50 hover:bg-[#e11d48]/5 hover:shadow-[0_0_20px_rgba(225,29,72,0.1)]'}`}>
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub Logo" className={`w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-300 ${isDark ? 'invert' : ''}`} />
                    <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-[#0f172a]'}`}>Git & GitHub</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Category: AI & Automation */}
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className={`relative pl-8 border-l-2 ${isDark ? 'border-[#4dabf7]/40' : 'border-[#e11d48]/30'}`}>
                <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${isDark ? 'bg-[#4dabf7] shadow-[0_0_10px_#4dabf7]' : 'bg-[#e11d48] shadow-[0_0_10px_rgba(225,29,72,0.5)]'}`}></div>
                <div className="group relative -ml-4 -mr-4 px-4 py-2 mb-4 cursor-default overflow-hidden rounded-xl">
                  <div className={`absolute inset-0 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-out rounded-xl bg-gradient-to-r ${isDark ? 'from-teal-500/10 to-[#4dabf7]/10' : 'from-rose-500/5 to-[#e11d48]/5'}`}></div>
                  <h4 className={`relative text-xl font-bold tracking-wide group-hover:translate-x-2 transition-transform duration-400 ease-out ${isDark ? 'text-[#4dabf7]' : 'text-[#e11d48]'}`}>AI & Automation</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ y: -2 }} className={`group px-5 py-3 border rounded-xl flex items-center gap-3 shadow-sm transition-all duration-300 ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 hover:shadow-[0_0_20px_rgba(77,171,247,0.15)]' : 'bg-white border-slate-100 hover:border-[#e11d48]/50 hover:bg-[#e11d48]/5 hover:shadow-[0_0_20px_rgba(225,29,72,0.1)]'}`}>
                    <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 drop-shadow-[0_2px_10px_rgba(16,163,127,0.4)] group-hover:scale-110 transition-transform duration-300" fill="none">
                      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="#10a37f" />
                    </svg>
                    <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-[#0f172a]'}`}>ChatGPT</span>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} className={`group px-5 py-3 border rounded-xl flex items-center gap-3 shadow-sm transition-all duration-300 ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-[#4dabf7]/60 hover:bg-[#4dabf7]/5 hover:shadow-[0_0_20px_rgba(77,171,247,0.15)]' : 'bg-white border-slate-100 hover:border-[#e11d48]/50 hover:bg-[#e11d48]/5 hover:shadow-[0_0_20px_rgba(225,29,72,0.1)]'}`}>
                    <img src="/logo/claude_logo.jpg" alt="Claude Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain drop-shadow-[0_2px_10px_rgba(204,133,61,0.4)] group-hover:scale-110 transition-transform duration-300 rounded-sm" />
                    <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-[#0f172a]'}`}>Claude</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className={`py-24 border-t transition-colors duration-400 ${isDark ? 'border-zinc-900/50' : 'border-slate-100'}`} style={{ background: isDark ? '#0a0a0a' : 'linear-gradient(135deg, #FFFFFF 0%, #FFF7F8 50%, #FFFFFF 100%)' }}>
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
              <h2 className={`text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-blue-400 via-teal-400 to-emerald-400' : 'from-[#e11d48] via-rose-500 to-[#be123c]'}`}>
                Certifications
              </h2>
              <div className={`h-px flex-1 bg-gradient-to-r ${isDark ? 'from-zinc-800 to-transparent' : 'from-rose-200 to-transparent'}`}></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Python Certification */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                onClick={() => setActiveCert({ title: "Data Analysis with Python", issuer: "IBM (Cognitive Class)", image: "/certificates/data analysis with python.png" })}
                className={`group relative rounded-2xl p-6 border overflow-hidden cursor-pointer shadow-lg transition-all duration-300 ${isDark ? 'bg-[#121212] border-zinc-800/60 shadow-black/40 hover:shadow-[0_8px_40px_rgba(59,130,246,0.15)] hover:border-blue-500/30' : 'bg-white border-slate-100 shadow-slate-200/50 hover:shadow-[0_8px_40px_rgba(225,29,72,0.1)] hover:border-rose-300'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl mix-blend-overlay ${isDark ? 'from-blue-500/10 to-transparent' : 'from-rose-500/10 to-transparent'}`}></div>
                <div className={`relative aspect-[4/3] rounded-lg overflow-hidden mb-6 border ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
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
                <h3 className={`text-xl font-bold mb-2 transition-colors ${isDark ? 'text-zinc-100 group-hover:text-blue-400' : 'text-[#0f172a] group-hover:text-[#e11d48]'}`}>
                  Data Analysis with Python
                </h3>
                <p className={`text-sm font-medium flex items-center gap-2 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-blue-500' : 'bg-[#e11d48]'}`}></span>
                  IBM (Cognitive Class)
                </p>
              </motion.div>

              {/* Data Analysis Cert */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                onClick={() => setActiveCert({ title: "Introduction to Data Analytics", issuer: "Simplilearn SkillUp", image: "/certificates/introduction to data analysis.png" })}
                className={`group relative rounded-2xl p-6 border overflow-hidden cursor-pointer shadow-lg transition-all duration-300 ${isDark ? 'bg-[#121212] border-zinc-800/60 shadow-black/40 hover:shadow-[0_8px_40px_rgba(20,184,166,0.15)] hover:border-teal-500/30' : 'bg-white border-slate-100 shadow-slate-200/50 hover:shadow-[0_8px_40px_rgba(225,29,72,0.1)] hover:border-rose-300'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl mix-blend-overlay ${isDark ? 'from-teal-500/10 to-transparent' : 'from-rose-500/10 to-transparent'}`}></div>
                <div className={`relative aspect-[4/3] rounded-lg overflow-hidden mb-6 border ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
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
                <h3 className={`text-xl font-bold mb-2 transition-colors ${isDark ? 'text-zinc-100 group-hover:text-teal-400' : 'text-[#0f172a] group-hover:text-[#e11d48]'}`}>
                  Intro to Data Analytics
                </h3>
                <p className={`text-sm font-medium flex items-center gap-2 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-teal-500' : 'bg-[#e11d48]'}`}></span>
                  Simplilearn SkillUp
                </p>
              </motion.div>

              {/* SQL Certification */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                onClick={() => setActiveCert({ title: "SQL & Relational Databases", issuer: "Skill Course (Learn More Pro)", image: "/certificates/sql.png" })}
                className={`group relative rounded-2xl p-6 border overflow-hidden cursor-pointer shadow-lg transition-all duration-300 ${isDark ? 'bg-[#121212] border-zinc-800/60 shadow-black/40 hover:shadow-[0_8px_40px_rgba(16,185,129,0.15)] hover:border-emerald-500/30' : 'bg-white border-slate-100 shadow-slate-200/50 hover:shadow-[0_8px_40px_rgba(225,29,72,0.1)] hover:border-rose-300'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl mix-blend-overlay ${isDark ? 'from-emerald-500/10 to-transparent' : 'from-rose-500/10 to-transparent'}`}></div>
                <div className={`relative aspect-[4/3] rounded-lg overflow-hidden mb-6 border ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
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
                <h3 className={`text-xl font-bold mb-2 transition-colors ${isDark ? 'text-zinc-100 group-hover:text-emerald-400' : 'text-[#0f172a] group-hover:text-[#e11d48]'}`}>
                  SQL Foundation
                </h3>
                <p className={`text-sm font-medium flex items-center gap-2 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-500' : 'bg-[#e11d48]'}`}></span>
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
                className={`relative max-w-5xl w-full rounded-2xl border shadow-2xl p-2 md:p-4 ${isDark ? 'bg-[#111] border-zinc-800' : 'bg-white border-slate-200'}`}
              >
                <button
                  onClick={() => setActiveCert(null)}
                  className={`absolute -top-4 -right-4 md:-top-6 md:-right-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors border shadow-xl z-10 ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border-zinc-700' : 'bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-200'}`}
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
                  <h3 className={`text-xl md:text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>{activeCert.title}</h3>
                  <p className={`font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Issued by: {activeCert.issuer}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>


      {/* Contact Section */}
      <section id="contact" className={`py-24 px-6 border-t transition-colors duration-400 ${isDark ? 'border-zinc-900/50' : 'border-slate-100'}`} style={{ background: isDark ? '#0a0a0a' : 'linear-gradient(180deg, #FFF5F7 0%, #FFFFFF 50%, #FFF7F8 100%)' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto flex flex-col items-center text-center"
        >
          <div className="mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold flex items-center justify-center gap-3 ${isDark ? 'text-zinc-100' : 'text-[#0f172a]'}`}>
              <span className={isDark ? 'text-blue-400' : 'text-[#e11d48]'}>👉</span> Let&apos;s Connect
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
            {/* Email Card */}
            <a
              href="mailto:nikhilydv1026@gmail.com"
              className={`group flex flex-col items-center p-8 backdrop-blur-md border rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${isDark ? 'bg-zinc-900/30 border-white/5 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:border-blue-500/30' : 'bg-white border-slate-200/80 hover:shadow-[0_0_25px_rgba(225,29,72,0.12)] hover:border-rose-300'}`}
            >
              <div className={`w-14 h-14 mb-4 rounded-full flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-zinc-800/50 text-zinc-300 group-hover:text-blue-400 group-hover:bg-blue-500/10' : 'bg-slate-100 text-slate-600 group-hover:text-[#e11d48] group-hover:bg-rose-50'}`}>
                <img src="/logo/email.png" alt="Email Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-zinc-100' : 'text-[#0f172a]'}`}>Email</h3>
              <p className={`text-sm font-medium transition-colors break-all ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-slate-600 group-hover:text-slate-800'}`}>
                nikhilydv1026@gmail.com
              </p>
            </a>

            {/* LinkedIn Card */}
            <a
              href="https://www.linkedin.com/in/nikhilydv1026"
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col items-center p-8 backdrop-blur-md border rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${isDark ? 'bg-zinc-900/30 border-white/5 hover:shadow-[0_0_25px_rgba(10,102,194,0.15)] hover:border-[#0A66C2]/30' : 'bg-white border-slate-200/80 hover:shadow-[0_0_25px_rgba(225,29,72,0.12)] hover:border-rose-300'}`}
            >
              <div className={`w-14 h-14 mb-4 rounded-full flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-zinc-800/50 text-zinc-300 group-hover:text-[#0A66C2] group-hover:bg-[#0A66C2]/10' : 'bg-slate-100 text-slate-600 group-hover:text-[#e11d48] group-hover:bg-rose-50'}`}>
                <img src="/logo/linkedin.png" alt="LinkedIn Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-zinc-100' : 'text-[#0f172a]'}`}>LinkedIn</h3>
              <p className={`text-sm font-medium transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-slate-600 group-hover:text-slate-800'}`}>
                nikhilydv1026
              </p>
            </a>

            {/* GitHub Card */}
            <a
              href="https://github.com/nikhilydv1026"
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col items-center p-8 backdrop-blur-md border rounded-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${isDark ? 'bg-zinc-900/30 border-white/5 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:border-zinc-400/30' : 'bg-white border-slate-200/80 hover:shadow-[0_0_25px_rgba(225,29,72,0.12)] hover:border-rose-300'}`}
            >
              <div className={`w-14 h-14 mb-4 rounded-full flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-zinc-800/50 text-zinc-300 group-hover:text-white group-hover:bg-zinc-700/50' : 'bg-slate-100 text-slate-600 group-hover:text-[#e11d48] group-hover:bg-rose-50'}`}>
                <img src="/logo/github.png" alt="GitHub Logo" className={`w-6 h-6 md:w-7 md:h-7 object-contain group-hover:scale-110 transition-transform duration-300 ${isDark ? 'invert' : ''}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-zinc-100' : 'text-[#0f172a]'}`}>GitHub</h3>
              <p className={`text-sm font-medium transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-slate-600 group-hover:text-slate-800'}`}>
                nikhilydv1026
              </p>
            </a>
          </div>

          <p className={`font-medium text-base md:text-lg flex items-center justify-center gap-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
            <span className="text-xl">👉</span> &quot;Open to internships, collaborations, and opportunities.&quot;
          </p>
        </motion.div>
      </section>

      {/* SEO Footer */}
      <footer className={`py-8 px-6 border-t transition-colors duration-400 ${isDark ? 'border-zinc-900/50' : 'border-slate-100'}`} style={{ background: isDark ? '#000000' : '#faf8f6' }}>
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a
              href="https://www.linkedin.com/in/nikhilydv1026"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${isDark ? 'hover:text-blue-400' : 'text-slate-500 hover:text-[#e11d48]'}`}
            >
              Nikhil Yadav LinkedIn
            </a>
            <span className={isDark ? 'text-zinc-700' : 'text-slate-300'}>·</span>
            <a
              href="https://github.com/nikhilydv1026"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${isDark ? 'hover:text-zinc-200' : 'text-slate-500 hover:text-[#e11d48]'}`}
            >
              Nikhil Yadav GitHub
            </a>
            <span className={isDark ? 'text-zinc-700' : 'text-slate-300'}>·</span>
            <a
              href="/nikhil-yadav"
              className={`transition-colors ${isDark ? 'hover:text-blue-400' : 'text-slate-500 hover:text-[#e11d48]'}`}
            >
              About Nikhil Yadav
            </a>
          </div>
          <p className={`text-xs ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
            © {new Date().getFullYear()} Nikhil Yadav (Nikhil Ydv). All rights reserved.
          </p>
        </div>
      </footer>

    </>
  );
}






