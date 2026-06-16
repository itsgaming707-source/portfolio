"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function SplashScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [showSplash, setShowSplash] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // 0s -> 'h', 0.12s -> 'he', 0.24s -> 'hel', 0.36s -> 'hell', 0.48s -> 'hello'
    // 'hello' animation completes at ~1.08s (0.48s delay + 0.6s duration)
    // Wait 1 second -> total ~2.1s
    const exitTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2100);

    // Call onComplete early so the site fades in underneath while splash screen fades out
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  const text = "hello";

  if (!isMounted) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
        setIsMounted(false);
      }}
    >
      {showSplash && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            overflow: "hidden",
          }}
        >
          {/* Subtle radial ambient glow */}
          <div
            style={{
              position: "absolute",
              width: "min(600px, 90vw)",
              height: "min(600px, 90vw)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(245,245,245,0.04) 0%, rgba(245,245,245,0.015) 40%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          {/* Cinematic Light Streaks */}
          <motion.div
            initial={{ opacity: 0, x: "-150%", y: "-150%", rotate: 35 }}
            exit={{ 
              opacity: [0, 1, 1, 0],
              x: ["-100%", "200%"],
              y: ["-100%", "200%"] 
            }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "absolute",
              width: "200vw",
              height: "1px",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
              boxShadow: "0 0 20px 2px rgba(255,255,255,0.3)",
              zIndex: 20,
            }}
          />
          <motion.div
            initial={{ opacity: 0, x: "-150%", y: "-150%", rotate: 35 }}
            exit={{ 
              opacity: [0, 0.5, 0.5, 0],
              x: ["-100%", "200%"],
              y: ["-100%", "200%"] 
            }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            style={{
              position: "absolute",
              width: "200vw",
              height: "2px",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              boxShadow: "0 0 15px 1px rgba(255,255,255,0.2)",
              zIndex: 20,
              marginTop: "150px",
            }}
          />

          {/* Letter by letter reveal */}
          <motion.div
            className="splash-hello-container"
            exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ fontFamily: greatVibes.style.fontFamily, zIndex: 10 }}
          >
            {text.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.12, // Faster typing speed
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
