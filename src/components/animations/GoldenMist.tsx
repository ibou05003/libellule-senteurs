"use client";

import { useEffect, useRef } from "react";
import { COLORS, BREAKPOINTS } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  phase: number;
};

/**
 * Ambient particle system rendered on an HTML canvas.
 *
 * Uses brand gold (#C99700) particles with organic sinusoidal drift, fade-in/out
 * over each particle's lifetime, and a soft glow halo. Particle counts are
 * reduced on mobile to avoid GPU pressure on lower-end devices.
 *
 * Skipped entirely when the user has prefers-reduced-motion set, both to
 * respect accessibility preferences and to avoid unnecessary animation overhead.
 */
export default function GoldenMist({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const isMobile = window.innerWidth < BREAKPOINTS.mobile;
    const particleCount = isMobile ? 30 : 100;

    // Extract RGB components once so we can construct rgba() strings at draw time
    // without redundant hex-to-rgb conversion on every frame.
    // COLORS.orLuxe = "#C99700" → r=201, g=151, b=0
    const hex = COLORS.orLuxe.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    const createParticle = (): Particle => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.3,
      // Slight upward bias (negative y = up in canvas coords) for a rising mist feel
      vy: (Math.random() - 0.5) * 0.3 - 0.2,
      size: Math.random() * 3 + 1,
      alpha: 0,
      life: 0,
      maxLife: Math.random() * 200 + 100,
      // Individual phase offset ensures particles drift out of sync with each other
      phase: Math.random() * Math.PI * 2,
    });

    // Pre-populate at staggered ages so the canvas doesn't look empty on first render
    for (let i = 0; i < particleCount; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, w(), h());

      for (const p of particles) {
        p.life++;

        // Organic noise-like movement driven by per-particle phase so no two particles
        // move identically — this avoids the "school of fish" synchronization artifact
        p.vx += Math.sin(time + p.phase) * 0.01;
        p.vy += Math.cos(time + p.phase * 0.7) * 0.008;

        // Velocity damping prevents runaway acceleration
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Fade in over first 10% of life, hold, then fade out over last 20%
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) {
          p.alpha = lifeRatio / 0.1;
        } else if (lifeRatio > 0.8) {
          p.alpha = (1 - lifeRatio) / 0.2;
        } else {
          p.alpha = 1;
        }
        // Cap opacity low so the effect reads as background atmosphere, not foreground noise
        p.alpha *= 0.4;

        // Recycle expired or out-of-bounds particles rather than splicing the array
        if (
          p.life >= p.maxLife ||
          p.x < -10 ||
          p.x > w() + 10 ||
          p.y < -10 ||
          p.y > h() + 10
        ) {
          Object.assign(p, createParticle());
        }

        // Core particle — small opaque circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fill();

        // Glow halo — 3× radius, 10% of core opacity for a soft bloom effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.1})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  // Render nothing when motion is reduced — no decorative canvas in the accessibility tree
  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
