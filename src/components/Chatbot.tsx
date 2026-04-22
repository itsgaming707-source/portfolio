"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import newPhoto from "../../new photo.png";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Restore state from localStorage on mount
  useEffect(() => {
    const aiState = localStorage.getItem("aiState");

    if (aiState === "closed") {
      // User explicitly closed it → stay closed
      setIsOpen(false);
      setHasInitialized(true);
    } else if (aiState === "open") {
      // Previously open → open instantly, no delay
      setIsOpen(true);
      setHasInitialized(true);
    } else {
      // First visit (no value) → smooth delayed open, then persist
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasInitialized(true);
        localStorage.setItem("aiState", "open");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    localStorage.setItem("aiState", "open");
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("aiState", "closed");
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Close on ESC or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const quickActions = [
    "🚀 Explore Nikhil's Skills",
    "📊 View Nikhil's Projects",
    "🧠 Explain a Project in Detail",
    "🛠️ Tools & Technologies Nikhil Uses",
    "📞 Contact Nikhil",
  ];

  const lastSentRef = useRef<number>(0);

  const handleSendMessage = async (msg: string) => {
    if (!msg.trim() || isLoading) return;

    // Debounce: prevent rapid-fire calls (1 second cooldown)
    const now = Date.now();
    if (now - lastSentRef.current < 1000) return;
    lastSentRef.current = now;

    // Step 1: Show user message immediately
    setMessages(prev => [...prev, { role: "user" as const, content: msg }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();

      // Step 2: Append Gemini's dynamic reply
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply || "No response received." },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 flex items-center justify-center gap-3 z-[100] cursor-pointer group"
          >
            {/* Chat Bubble */}
            <div className="relative bg-white text-gray-700 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium tracking-tight whitespace-nowrap hidden sm:block group-hover:shadow-xl transition-shadow duration-300">
              <span className="leading-snug">Hi! How can I assist you </span>
              <br />
              <span className="leading-snug">today?</span>
              {/* Bubble Tail */}
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 rounded-sm" />
            </div>

            {/* Avatar */}
            <div className="relative w-14 h-14 rounded-full border-2 border-gray-600 shadow-[0_0_25px_rgba(0,0,0,0.5)] overflow-hidden bg-black flex-shrink-0 group-hover:border-gray-500 transition-colors duration-300">
              <img
                src={newPhoto.src}
                alt="Nikhil Yadav"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-[360px] max-w-[calc(100vw-32px)] h-[560px] max-h-[calc(100vh-64px)] z-[100] flex flex-col bg-[#0a0a0a]/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {/* Header */}
            <header className="px-6 py-5 flex justify-between items-center border-b border-white/5 relative bg-gradient-to-b from-white/[0.04] to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7C5CFF]/20 to-[#7C5CFF]/10 flex items-center justify-center border border-[#7C5CFF]/20 shadow-[0_0_15px_rgba(124,92,255,0.2)] overflow-hidden">
                  <img src={newPhoto.src} alt="Nikhil.AI" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-100 tracking-wide">Nikhil.AI</h3>
                  <p className="text-[10px] text-[#7C5CFF]/80 uppercase tracking-widest mt-0.5">Assistant</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </header>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-hide flex flex-col justify-start relative">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-2 mb-2 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7C5CFF]/20 to-[#6b4ce6]/10 flex items-center justify-center mb-4 border border-[#7C5CFF]/20 shadow-[0_0_30px_rgba(124,92,255,0.15)] overflow-hidden">
                    <img src={newPhoto.src} alt="Nikhil.AI" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-gray-100 font-medium text-lg mb-2 tracking-tight">How can I help?</h4>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-[90%] mx-auto font-light">
                    Ask me anything about Nikhil&apos;s skills, projects, or professional background.
                  </p>

                  <div className="flex flex-col items-stretch w-full gap-3 mt-8 px-2">
                    {quickActions.map((question, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(question)}
                        className="w-full text-center px-4 py-2.5 bg-white/5 hover:bg-[#7C5CFF]/15 text-gray-300 hover:text-[#7C5CFF] transition-all rounded-xl text-[13px] font-medium border border-white/5 hover:border-[#7C5CFF]/30"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col gap-1 w-full ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`${msg.role === "user"
                        ? "bg-gradient-to-tr from-[#6b4ce6] to-[#9176ff] text-white rounded-2xl rounded-tr-[4px]"
                        : "bg-white/10 text-gray-100 rounded-2xl rounded-tl-[4px] border border-white/5"
                      } px-4 py-2.5 max-w-[85%] shadow-sm`}
                  >
                    <p className="leading-relaxed text-[13.5px] whitespace-pre-line font-light">
                      {msg.content.split(/(\[.*?\]\(.*?\)|https?:\/\/[^\s]+)/g).map((part, i) => {
                        const mdMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                        if (mdMatch) {
                          return (
                            <a key={i} href={mdMatch[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 opacity-90 hover:opacity-100 transition-opacity font-medium pointer-events-auto">
                              {mdMatch[1]}
                            </a>
                          );
                        }
                        const urlMatch = part.match(/^(https?:\/\/[^\s]+)$/);
                        if (urlMatch) {
                          return (
                            <a key={i} href={urlMatch[1]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 opacity-90 hover:opacity-100 transition-opacity font-medium pointer-events-auto">
                              {urlMatch[1]}
                            </a>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Loader */}
              {isLoading && (
                <div className="flex flex-col items-start gap-1 w-full">
                  <div className="bg-white/10 border border-white/5 p-3.5 rounded-2xl rounded-tl-[4px] flex gap-1.5 items-center justify-center shadow-sm">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-transparent pt-2">
              <div className="flex items-center gap-2 bg-white/5 p-1 pl-4 rounded-full border border-white/10 focus-within:border-[#7C5CFF]/50 focus-within:bg-white/[0.07] transition-all shadow-inner">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-gray-200 w-full placeholder:text-gray-500 font-light disabled:opacity-50"
                  placeholder="Message Nikhil.AI..."
                  type="text"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-9 h-9 shrink-0 bg-[#7C5CFF] hover:bg-[#6b4ce6] disabled:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95"
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    arrow_upward
                  </span>
                </button>
              </div>
              <div className="text-center mt-3 mb-1">
                <p className="text-[10px] text-gray-500 tracking-wide">AI can make mistakes. Verify important info.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
