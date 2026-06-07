"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  type: "large" | "medium" | "small";
}

interface ThemeColors {
  particleCore: string;
  particleBright: string;
  lineColor: string;
  mouseLine: string;
  glowInner: string;
  glowOuter: string;
  cursorGlow: string;
}

const DARK_COLORS: ThemeColors = {
  particleCore: "56, 189, 248",
  particleBright: "186, 230, 253",
  lineColor: "14, 165, 233",
  mouseLine: "56, 189, 248",
  glowInner: "14, 165, 233",
  glowOuter: "56, 189, 248",
  cursorGlow: "56, 189, 248",
};

const LIGHT_COLORS: ThemeColors = {
  particleCore: "15, 23, 42",      // slate-900 (dark gray)
  particleBright: "51, 65, 85",    // slate-700
  lineColor: "100, 116, 139",      // slate-500
  mouseLine: "15, 23, 42",         // slate-900
  glowInner: "148, 163, 184",      // slate-400
  glowOuter: "203, 213, 225",      // slate-300
  cursorGlow: "15, 23, 42",
};

interface ParticleNetworkProps {
  theme?: "dark" | "light";
}

export default function ParticleNetwork({ theme = "dark" }: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const themeButtonRef = useRef({ x: -9999, y: -9999, active: false });
  const themeTransitionRef = useRef({ active: false, startTime: 0, fromTheme: theme, toTheme: theme });
  const animationRef = useRef<number>(0);
  const dprRef = useRef(1);
  const themeRef = useRef(theme);
  
  // Track theme changes for interpolation
  useEffect(() => {
    if (themeRef.current !== theme) {
      themeTransitionRef.current = {
        active: true,
        startTime: performance.now(),
        fromTheme: themeRef.current,
        toTheme: theme,
      };
      themeRef.current = theme;
    }
  }, [theme]);

  const getConfig = useCallback(() => {
    if (typeof window === "undefined") {
      return { count: 90, connectionDist: 180, mouseRadius: 220 };
    }
    const w = window.innerWidth;
    if (w < 640) {
      return { count: 55, connectionDist: 120, mouseRadius: 140 };
    }
    if (w < 1024) {
      return { count: 75, connectionDist: 150, mouseRadius: 180 };
    }
    return { count: 100, connectionDist: 190, mouseRadius: 240 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticle = (w: number, h: number): Particle => {
      const rand = Math.random();
      let type: "large" | "medium" | "small";
      let baseRadius: number;
      let opacity: number;

      if (rand < 0.08) {
        // 8% large glowing nodes
        type = "large";
        baseRadius = Math.random() * 2 + 2.5;
        opacity = Math.random() * 0.3 + 0.6;
      } else if (rand < 0.35) {
        // 27% medium nodes
        type = "medium";
        baseRadius = Math.random() * 1.2 + 1.2;
        opacity = Math.random() * 0.3 + 0.4;
      } else {
        // 65% small particles
        type = "small";
        baseRadius = Math.random() * 0.8 + 0.4;
        opacity = Math.random() * 0.3 + 0.25;
      }

      // Constant left-to-right drift — all positive vx
      // Larger nodes drift slightly slower for depth
      const baseVx = type === "large" ? 0.15 : type === "medium" ? 0.22 : 0.28;
      const vxVariation = Math.random() * 0.07; // 0.00-0.07 extra
      const initialVx = baseVx + vxVariation;

      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: initialVx,
        vy: (Math.random() - 0.5) * 0.04, // -0.02 to 0.02
        baseVx: initialVx,
        radius: baseRadius,
        baseRadius,
        opacity,
        type,
      };
    };

    const initParticles = () => {
      const config = getConfig();
      const particles: Particle[] = [];
      for (let i = 0; i < config.count; i++) {
        particles.push(createParticle(width, height));
      }
      particlesRef.current = particles;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          active: true,
        };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    };

    const lerpColor = (c1: string, c2: string, t: number) => {
      const p1 = c1.split(',').map(Number);
      const p2 = c2.split(',').map(Number);
      const r = Math.round(p1[0] + (p2[0] - p1[0]) * t);
      const g = Math.round(p1[1] + (p2[1] - p1[1]) * t);
      const b = Math.round(p1[2] + (p2[2] - p1[2]) * t);
      return `${r}, ${g}, ${b}`;
    };

    const animate = (time: number) => {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const config = getConfig();
      
      const themeTransition = themeTransitionRef.current;
      let currentColors = themeRef.current === "light" ? LIGHT_COLORS : DARK_COLORS;

      if (themeTransition.active) {
        const elapsed = time - themeTransition.startTime;
        let progress = elapsed / 400; // 0.4s matches CSS transition
        if (progress >= 1) {
          progress = 1;
          themeTransition.active = false;
        } else {
          // easeInOutSine approximation
          const ease = -(Math.cos(Math.PI * progress) - 1) / 2;
          const c1 = themeTransition.fromTheme === "light" ? LIGHT_COLORS : DARK_COLORS;
          const c2 = themeTransition.toTheme === "light" ? LIGHT_COLORS : DARK_COLORS;
          
          currentColors = {
            particleCore: lerpColor(c1.particleCore, c2.particleCore, ease),
            particleBright: lerpColor(c1.particleBright, c2.particleBright, ease),
            lineColor: lerpColor(c1.lineColor, c2.lineColor, ease),
            mouseLine: lerpColor(c1.mouseLine, c2.mouseLine, ease),
            glowInner: lerpColor(c1.glowInner, c2.glowInner, ease),
            glowOuter: lerpColor(c1.glowOuter, c2.glowOuter, ease),
            cursorGlow: lerpColor(c1.cursorGlow, c2.cursorGlow, ease),
          };
        }
      }

      const getColors = (x: number, y: number) => currentColors;
      const connectionDist = config.connectionDist;
      const mouseRadius = config.mouseRadius;
      const connectionDistSq = connectionDist * connectionDist;
      const mouseRadiusSq = mouseRadius * mouseRadius;

      ctx.clearRect(0, 0, width, height);

      // ── Draw connection lines FIRST (behind particles) ──
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistSq) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / connectionDist) * 0.55;
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY = (particles[i].y + particles[j].y) / 2;
            const colors = getColors(midX, midY);

            // Thicker lines for connections between larger nodes
            const bothLarge = particles[i].type !== "small" && particles[j].type !== "small";
            ctx.lineWidth = bothLarge ? 0.9 : 0.5;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${colors.lineColor}, ${opacity})`;
            ctx.stroke();
          }
        }
      }

      // ── Mouse connection lines ──
      if (mouse.active) {
        const mouseConnectionDist = mouseRadius * 0.85;
        const mouseConnectionDistSq = mouseConnectionDist * mouseConnectionDist;

        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseConnectionDistSq) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / mouseConnectionDist) * 0.4;
            const midX = (mouse.x + particles[i].x) / 2;
            const midY = (mouse.y + particles[i].y) / 2;
            const colors = getColors(midX, midY);

            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.strokeStyle = `rgba(${colors.mouseLine}, ${opacity})`;
            ctx.stroke();
          }
        }

        // Mouse glow cursor
        const colors = getColors(mouse.x, mouse.y);
        const cursorGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 60
        );
        cursorGlow.addColorStop(0, `rgba(${colors.cursorGlow}, 0.08)`);
        cursorGlow.addColorStop(1, `rgba(${colors.cursorGlow}, 0)`);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
        ctx.fillStyle = cursorGlow;
        ctx.fill();
      }

      // ── Theme Button connection lines ──
      const themeButton = themeButtonRef.current;
      if (themeButton.active) {
        const btnRadius = 240;
        const btnRadiusSq = btnRadius * btnRadius;

        for (let i = 0; i < particles.length; i++) {
          const dx = themeButton.x - particles[i].x;
          const dy = themeButton.y - particles[i].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < btnRadiusSq) {
            const dist = Math.sqrt(distSq);
            const opacity = (1 - dist / btnRadius) * 0.6;
            const midX = (themeButton.x + particles[i].x) / 2;
            const midY = (themeButton.y + particles[i].y) / 2;
            const colors = getColors(midX, midY);

            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(themeButton.x, themeButton.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.strokeStyle = `rgba(${colors.mouseLine}, ${opacity})`;
            ctx.stroke();
          }
        }

        // Glow behind button
        const colors = getColors(themeButton.x, themeButton.y);
        const btnGlow = ctx.createRadialGradient(
          themeButton.x, themeButton.y, 0,
          themeButton.x, themeButton.y, 100
        );
        btnGlow.addColorStop(0, `rgba(${colors.cursorGlow}, 0.15)`);
        btnGlow.addColorStop(1, `rgba(${colors.cursorGlow}, 0)`);
        ctx.beginPath();
        ctx.arc(themeButton.x, themeButton.y, 100, 0, Math.PI * 2);
        ctx.fillStyle = btnGlow;
        ctx.fill();
      }

      // ── Update and draw particles ──
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse attraction — only affect Y axis to preserve drift direction
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mDistSq = mdx * mdx + mdy * mdy;

          if (mDistSq < mouseRadiusSq && mDistSq > 200) {
            const mDist = Math.sqrt(mDistSq);
            const force = p.type === "small" ? 0.008 : 0.005;
            // Only nudge Y — don't fight the rightward drift
            p.vy += (mdy / mDist) * force;
          }
        }

        // Theme button attraction
        if (themeButton.active) {
          const bdx = themeButton.x - p.x;
          const bdy = themeButton.y - p.y;
          const bDistSq = bdx * bdx + bdy * bdy;
          if (bDistSq < 60000) { // 240px radius
            const bDist = Math.sqrt(bDistSq);
            const force = 0.04;
            p.vx += (bdx / bDist) * force;
            p.vy += (bdy / bDist) * force;
          }
        }

        // Gently pull vy back toward zero so vertical drift doesn't accumulate
        p.vy *= 0.995;
        // Gently pull vx back toward baseVx
        p.vx += (p.baseVx - p.vx) * 0.02;

        // Clamp vertical speed to keep it subtle
        if (p.vy > 0.04) p.vy = 0.04;
        if (p.vy < -0.04) p.vy = -0.04;

        // Move particle (vx is constant, never damped)
        p.x += p.vx;
        p.y += p.vy;

        // Right edge exit → respawn from left edge at random Y
        if (p.x > width + 30) {
          p.x = -30;
          p.y = Math.random() * height;
        }
        // Vertical wrap (soft)
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // ── Draw particle based on type ──
        const colors = getColors(p.x, p.y);
        if (p.type === "large") {
          // Outer glow
          const glowRadius = p.baseRadius * 6;
          const outerGlow = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, glowRadius
          );
          outerGlow.addColorStop(0, `rgba(${colors.glowInner}, ${p.opacity * 0.25})`);
          outerGlow.addColorStop(0.4, `rgba(${colors.glowOuter}, ${p.opacity * 0.08})`);
          outerGlow.addColorStop(1, `rgba(${colors.glowOuter}, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = outerGlow;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colors.particleCore}, ${p.opacity})`;
          ctx.fill();

          // Bright center
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.baseRadius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colors.particleBright}, ${p.opacity * 0.8})`;
          ctx.fill();

        } else if (p.type === "medium") {
          // Subtle glow
          const glowRadius = p.baseRadius * 3.5;
          const glow = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, glowRadius
          );
          glow.addColorStop(0, `rgba(${colors.glowInner}, ${p.opacity * 0.15})`);
          glow.addColorStop(1, `rgba(${colors.glowOuter}, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colors.particleCore}, ${p.opacity * 0.85})`;
          ctx.fill();

        } else {
          // Small particle — simple dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colors.particleCore}, ${p.opacity * 0.7})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    initParticles();

    // Small delay to ensure DOM is ready
    const startTimer = setTimeout(() => {
      animate(performance.now());
    }, 50);

    const handleResize = () => {
      resize();
      initParticles();
    };

    const handleThemeHover = (e: Event) => {
      const customEvent = e as CustomEvent;
      themeButtonRef.current = customEvent.detail;
    };

    const handleThemeSwitch = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { x, y } = customEvent.detail;
      
      // Explode particles near the click
      for (let p of particlesRef.current) {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          const force = (300 - dist) / 100;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("theme-hover", handleThemeHover as EventListener);
    window.addEventListener("theme-switch", handleThemeSwitch as EventListener);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("theme-hover", handleThemeHover as EventListener);
      window.removeEventListener("theme-switch", handleThemeSwitch as EventListener);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [getConfig]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 1,
          pointerEvents: "auto",
          display: "block",
        }}
      />
    </div>
  );
}
