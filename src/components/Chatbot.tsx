"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
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
      {/* FLOATING ACTION BUTTON (FAB) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 px-6 h-12 bg-gradient-to-b from-[#1a1a1a] to-black rounded-full flex items-center justify-center gap-2 text-[#D4AF37] shadow-[0_4px_20px_-4px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_30px_-4px_rgba(212,175,55,0.6)] z-[100] transition-shadow border border-[#D4AF37]/50 hover:border-[#D4AF37]/80"
          >
            <span
              className="material-symbols-outlined text-xl text-[#F3E5AB]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              smart_toy
            </span>
            <span className="font-semibold tracking-wide text-[15px] pr-1">Nikhil.AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* MAIN CHAT WIDGET */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-5 right-5 w-[350px] max-w-[calc(100vw-40px)] h-[500px] max-h-[calc(100vh-40px)] z-[100] flex flex-col bg-[#131313]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Header */}
            <header className="bg-[#1c1b1b]/80 backdrop-blur-xl px-5 py-4 flex justify-between items-center border-b border-white/5 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(77,142,255,0.2)]">
                  <span
                    className="material-symbols-outlined text-blue-400 text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    smart_toy
                  </span>
                </div>
                <span className="font-semibold text-base text-blue-200 tracking-tight">
                  Nikhil&apos;s AI Assistant
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </header>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide flex flex-col justify-start">
              {/* Auto Welcome Message */}
              <div
                className="flex flex-col gap-1.5 max-w-[85%] self-start group"
              >
                <div className="bg-[#1c1b1b] border border-white/10 p-3 rounded-2xl rounded-tl-none relative shadow-sm">
                  <p className="text-gray-200 leading-relaxed text-sm whitespace-pre-line">
                    Hi, I&apos;m Nikhil&apos;s AI Assistant 🤖{"\n"}I can help you explore his skills, projects, and experience as a Data Analyst.
                  </p>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider ml-1 px-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  Nikhil.AI • Just now
                </span>
              </div>

              {/* Quick Action Chips */}
              {messages.length === 0 && (
                <div
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {quickActions.map((question, i) => (
                    <button key={i} onClick={() => handleSendMessage(question)} className="px-3 py-1.5 bg-[#1c1b1b] hover:bg-blue-500/20 hover:text-blue-300 text-gray-300 transition-all duration-200 rounded-full text-xs font-medium border border-white/10">
                      {question}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col gap-1.5 max-w-[85%] ${msg.role === "user" ? "self-end" : "self-start"
                    } group`}
                >
                  <div
                    className={`${msg.role === "user"
                      ? "bg-blue-600 border border-blue-500 rounded-2xl rounded-tr-none"
                      : "bg-[#1c1b1b] border border-white/10 rounded-2xl rounded-tl-none"
                      } p-3 relative shadow-sm`}
                  >
                    <p className={`leading-relaxed text-sm whitespace-pre-line ${msg.role === "user" ? "text-white" : "text-gray-200"}`}>
                      {msg.content.split(/(\[.*?\]\(.*?\)|https?:\/\/[^\s]+)/g).map((part, i) => {
                        const mdMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                        if (mdMatch) {
                          return (
                            <a key={i} href={mdMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-medium">
                              {mdMatch[1]}
                            </a>
                          );
                        }
                        const urlMatch = part.match(/^(https?:\/\/[^\s]+)$/);
                        if (urlMatch) {
                          return (
                            <a key={i} href={urlMatch[1]} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-medium">
                              {urlMatch[1]}
                            </a>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </p>
                  </div>
                  <span className={`text-[10px] text-gray-500 tracking-wider px-1 opacity-80 ${msg.role === "user" ? "self-end mr-1" : "self-start ml-1"}`}>
                    {msg.role === "user" ? "You" : "Nikhil.AI"}
                  </span>
                </div>
              ))}

              {/* Typing Loader */}
              {isLoading && (
                <div className="flex flex-col gap-1.5 max-w-[85%] self-start">
                  <div className="bg-[#1c1b1b] border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center justify-center w-16 h-10 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area container pinned to bottom */}
            <div className="mt-auto p-4 bg-[#0e0e0e]/80 border-t border-white/5 sticky bottom-0">
              <div className="flex items-center gap-2 bg-[#1c1b1b] p-1.5 pl-4 rounded-xl border border-white/10 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-gray-200 w-full placeholder:text-gray-500 disabled:opacity-50"
                  placeholder="Type a message..."
                  type="text"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-8 h-8 shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-white shadow-lg transition-transform hover:scale-95 active:scale-90"
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    send
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
