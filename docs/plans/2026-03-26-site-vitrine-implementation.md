# Site Vitrine Libellule Senteurs — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an Awwwards-level luxury showcase website for Libellule Senteurs, a premium home fragrance brand based in Dakar.

**Architecture:** Single Next.js 14+ project (App Router) with Remotion integrated for pre-rendering a product morph image sequence. GSAP drives all scroll-based animations, Lenis provides smooth scroll, Canvas 2D renders golden mist particles in real-time. Single-page site with 10 scroll sections.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, GSAP (ScrollTrigger, SplitText, Draggable), Lenis, Framer Motion, Remotion 4, Three.js

**Design doc:** `docs/plans/2026-03-26-site-vitrine-design.md`

---

## Phase 1: Project Scaffolding

### Task 1: Initialize Next.js project

**Step 1: Create Next.js app**

Run:
```bash
cd /Users/ibrahima/Projects/libellule-senteurs
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Note: The directory already contains files (assets/, docs/, briefing docs). Say yes if prompted to continue in non-empty directory.

**Step 2: Verify it runs**

Run: `npm run dev`
Expected: Dev server starts on localhost:3000

**Step 3: Commit**

```bash
git init
git add -A
git commit -m "Initialize Next.js 14 project with TypeScript and Tailwind"
```

### Task 2: Install dependencies

**Step 1: Install animation libraries**

```bash
npm install gsap @gsap/react lenis framer-motion
```

**Step 2: Install Remotion**

```bash
npm install remotion @remotion/cli @remotion/three @remotion/google-fonts @remotion/bundler three @react-three/fiber @types/three
```

**Step 3: Install zod (for Remotion parametrizable compositions)**

```bash
npm install zod
```

**Step 4: Verify build still works**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add animation and Remotion dependencies"
```

### Task 3: Configure Tailwind theme with brand tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Create: `src/lib/constants.ts`

**Step 1: Update tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "or-luxe": "#C99700",
        "noir-profond": "#000000",
        "blanc-casse": "#F8F8F8",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Playfair Display", "serif"],
        body: ["var(--font-jost)", "Jost", "sans-serif"],
      },
      spacing: {
        section: "clamp(80px, 12vh, 160px)",
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 2: Create src/lib/constants.ts**

```ts
export const COLORS = {
  orLuxe: "#C99700",
  noirProfond: "#000000",
  blancCasse: "#F8F8F8",
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

export const PRODUCT_MORPH = {
  totalFrames: 90,
  fps: 30,
  framePrefix: "/frames/morph-",
  frameExtension: ".png",
} as const;
```

**Step 3: Update globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-or-luxe: #C99700;
  --color-noir-profond: #000000;
  --color-blanc-casse: #F8F8F8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  background-color: var(--color-noir-profond);
  color: var(--color-blanc-casse);
}

body {
  font-family: var(--font-jost), "Jost", sans-serif;
  line-height: 1.7;
  overflow-x: hidden;
}

::selection {
  background-color: var(--color-or-luxe);
  color: var(--color-noir-profond);
}
```

**Step 4: Commit**

```bash
git add tailwind.config.ts src/app/globals.css src/lib/constants.ts
git commit -m "Configure Tailwind theme with Libellule Senteurs brand tokens"
```

### Task 4: Setup fonts and root layout

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Update layout.tsx with Google Fonts and metadata**

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Libellule Senteurs — Parfums d'interieur Haut de Gamme",
  description:
    "L'essence du raffinement invisible. Libellule Senteurs transforme chaque espace en une experience sensorielle unique. Parfums d'interieur premium, Dakar.",
  keywords: ["parfum interieur", "luxe", "Dakar", "bougie parfumee", "diffuseur"],
  openGraph: {
    title: "Libellule Senteurs — Parfums d'interieur Haut de Gamme",
    description: "L'essence du raffinement invisible.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Step 2: Verify fonts load**

Run: `npm run dev`, open browser, inspect computed styles. Headings should use Playfair Display, body text should use Jost.

**Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "Setup Google Fonts (Playfair Display, Jost) and SEO metadata"
```

### Task 5: Copy optimized assets to public/

**Step 1: Copy WebP images to public**

```bash
mkdir -p public/images/products public/images/mockups public/images/textures
cp assets/optimized/products/*.webp public/images/products/
cp assets/optimized/mockups/*.webp public/images/mockups/
cp assets/optimized/textures/*.webp public/images/textures/
```

**Step 2: Commit**

```bash
git add public/images/
git commit -m "Add optimized WebP product and mockup images"
```

---

## Phase 2: Layout Components

### Task 6: Create LoadingScreen component

**Files:**
- Create: `src/components/layout/LoadingScreen.tsx`

**Step 1: Build the loading screen**

The loading screen draws the dragonfly logo SVG path-by-path, then fades out. Uses CSS stroke-dashoffset animation (not GSAP, to avoid FOUC before JS loads).

For now, use a simplified SVG placeholder until the real logo SVG is ready. The component should:
- Show full-screen black background
- Animate a gold (#C99700) SVG dragonfly being drawn stroke by stroke
- Show a minimal progress bar at bottom
- After animation completes (~2.5s), fade out and unmount
- Accept an `onComplete` callback

The SVG will be a placeholder circle + stylized wings until the real logo paths are provided.

```tsx
"use client";

import { useState, useEffect } from "react";

type LoadingScreenProps = {
  onComplete: () => void;
};

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"drawing" | "revealing" | "done">("drawing");

  useEffect(() => {
    const drawTimer = setTimeout(() => setPhase("revealing"), 2000);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(drawTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-noir-profond"
      style={{
        opacity: phase === "revealing" ? 0 : 1,
        transition: "opacity 0.8s ease-out",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-32 h-32"
        fill="none"
        stroke="#C99700"
        strokeWidth="1.5"
      >
        {/* Circle */}
        <circle
          cx="100"
          cy="100"
          r="80"
          className="loading-draw"
          style={{ animationDelay: "0s" }}
        />
        {/* Simplified dragonfly wing left */}
        <path
          d="M100 100 Q60 60 80 30 Q100 50 100 100"
          className="loading-draw"
          style={{ animationDelay: "0.5s" }}
        />
        {/* Wing right */}
        <path
          d="M100 100 Q140 60 120 30 Q100 50 100 100"
          className="loading-draw"
          style={{ animationDelay: "0.8s" }}
        />
        {/* Body */}
        <path
          d="M100 100 L100 150"
          className="loading-draw"
          style={{ animationDelay: "1.1s" }}
        />
      </svg>

      {/* Progress bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-px bg-blanc-casse/20">
        <div
          className="h-full bg-or-luxe"
          style={{
            animation: "loading-progress 2s ease-out forwards",
          }}
        />
      </div>
    </div>
  );
}
```

**Step 2: Add the CSS animations to globals.css**

Append to globals.css:

```css
/* Loading screen SVG draw animation */
.loading-draw {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 1.5s ease-out forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes loading-progress {
  from { width: 0; }
  to { width: 100%; }
}
```

**Step 3: Verify visually**

Temporarily render `<LoadingScreen onComplete={() => {}} />` in page.tsx, run dev server, confirm the SVG draws and fades.

**Step 4: Commit**

```bash
git add src/components/layout/LoadingScreen.tsx src/app/globals.css
git commit -m "Add loading screen with SVG path-draw animation"
```

### Task 7: Create Navigation component

**Files:**
- Create: `src/components/layout/Navigation.tsx`

**Step 1: Build transparent fixed nav**

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 transition-all duration-500 ${
        scrolled ? "bg-noir-profond/80 backdrop-blur-md py-4" : ""
      }`}
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-3">
        {/* Placeholder until SVG logo is ready */}
        <span className="font-heading text-xl text-or-luxe">
          Libellule Senteurs
        </span>
      </a>

      {/* Nav links — hidden on mobile */}
      <div className="hidden md:flex items-center gap-8 font-body text-sm tracking-widest uppercase text-blanc-casse/80">
        <a href="#histoire" className="hover:text-or-luxe transition-colors duration-300">
          Notre Histoire
        </a>
        <a href="#collection" className="hover:text-or-luxe transition-colors duration-300">
          Collection
        </a>
        <a href="#experience" className="hover:text-or-luxe transition-colors duration-300">
          Experience
        </a>
        <a href="#contact" className="hover:text-or-luxe transition-colors duration-300">
          Contact
        </a>
      </div>

      {/* CTA */}
      <a
        href="#contact"
        className="hidden md:block px-6 py-2 border border-or-luxe/40 text-or-luxe text-xs tracking-widest uppercase font-body hover:bg-or-luxe hover:text-noir-profond transition-all duration-300"
      >
        Nous contacter
      </a>
    </nav>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/layout/Navigation.tsx
git commit -m "Add transparent fixed navigation with scroll effect"
```

### Task 8: Create CustomCursor component

**Files:**
- Create: `src/components/layout/CustomCursor.tsx`

**Step 1: Build custom cursor with GSAP quickTo**

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    cursor.style.display = "block";

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-or-luxe/60 pointer-events-none z-[99] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden"
      aria-hidden="true"
    />
  );
}
```

**Step 2: Commit**

```bash
git add src/components/layout/CustomCursor.tsx
git commit -m "Add custom gold cursor with GSAP quickTo delay"
```

### Task 9: Create Footer component

**Files:**
- Create: `src/components/layout/Footer.tsx`

**Step 1: Build minimal footer**

```tsx
export default function Footer() {
  return (
    <footer className="bg-noir-profond border-t border-blanc-casse/10 py-16 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <p className="font-heading text-lg text-or-luxe">Libellule Senteurs</p>
          <p className="text-blanc-casse/50 text-sm mt-1">
            Parfums d&apos;interieur Haut de Gamme
          </p>
        </div>

        <div className="flex items-center gap-6 text-blanc-casse/50 text-sm">
          <a
            href="https://instagram.com/libellulesenteurs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-or-luxe transition-colors"
          >
            Instagram
          </a>
          <a
            href="mailto:contacts@libellulessenteurs.com"
            className="hover:text-or-luxe transition-colors"
          >
            Email
          </a>
          <span className="text-blanc-casse/30">
            (+221) 77 000 00 00
          </span>
        </div>

        <p className="text-blanc-casse/30 text-xs">
          &copy; {new Date().getFullYear()} Libellule Senteurs. Dakar, Senegal.
        </p>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "Add minimal footer component"
```

### Task 10: Setup smooth scroll with Lenis

**Files:**
- Create: `src/hooks/useSmoothScroll.ts`
- Create: `src/hooks/useReducedMotion.ts`

**Step 1: Create useReducedMotion hook**

```ts
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

**Step 2: Create useSmoothScroll hook**

```ts
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return lenisRef;
}
```

**Step 3: Commit**

```bash
git add src/hooks/useSmoothScroll.ts src/hooks/useReducedMotion.ts
git commit -m "Add Lenis smooth scroll with GSAP ScrollTrigger sync"
```

### Task 11: Assemble page.tsx shell

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Create the page shell that assembles all sections**

```tsx
"use client";

import { useState, useCallback } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import LoadingScreen from "@/components/layout/LoadingScreen";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useSmoothScroll();

  const handleLoadingComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleLoadingComplete} />}
      <CustomCursor />
      <Navigation />

      <main>
        {/* Phase 3: Hero section */}
        <section id="hero" className="h-screen bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Hero — a venir</p>
        </section>

        {/* Phase 3: Product Morph */}
        <section id="morph" className="h-[300vh] bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Product Morph — a venir</p>
        </section>

        {/* Phase 4: Storytelling */}
        <section id="histoire" className="min-h-screen bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Notre Histoire — a venir</p>
        </section>

        {/* Phase 4: Values */}
        <section id="valeurs" className="min-h-screen bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Valeurs — a venir</p>
        </section>

        {/* Phase 5: Collection */}
        <section id="collection" className="min-h-screen bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Collection — a venir</p>
        </section>

        {/* Phase 5: Experience */}
        <section id="experience" className="min-h-screen bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Experience — a venir</p>
        </section>

        {/* Phase 5: Contact */}
        <section id="contact" className="min-h-screen bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Contact — a venir</p>
        </section>
      </main>

      <Footer />
    </>
  );
}
```

**Step 2: Verify full page loads with loading screen, nav, all placeholder sections, footer**

Run: `npm run dev`

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "Assemble page shell with all section placeholders"
```

---

## Phase 3: Hero + Product Morph (the showpiece)

### Task 12: Build GoldenMist Canvas animation

**Files:**
- Create: `src/components/animations/GoldenMist.tsx`

Canvas 2D particle system: ~100 gold particles with Perlin-like organic motion, fading trails, varying sizes. Reduced to ~30 particles on mobile. Respects prefers-reduced-motion.

Implementation: useRef for canvas, requestAnimationFrame loop, each particle has x, y, vx, vy, size, alpha, lifespan. Noise-based velocity using sin/cos with phase offsets. Gold color (#C99700) with varying alpha.

**Step 1: Implement the Canvas particle system**

(Full implementation — ~100 lines of Canvas 2D code with particle class, spawn/update/draw loop, resize handler, mobile detection for particle count)

**Step 2: Commit**

### Task 13: Build Hero section

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Create: `src/components/animations/TextReveal.tsx`

Hero section: fullscreen, dark background, GoldenMist canvas behind, central product image (diffuser on dark background from generated images), text revealed letter-by-letter with GSAP SplitText (or manual split if SplitText plugin not available — use character-by-character with stagger), scroll indicator at bottom.

**Step 1: Create TextReveal component**

A reusable component that splits text into spans (words or characters) and animates them with GSAP ScrollTrigger or on-enter.

**Step 2: Create Hero section**

Composites GoldenMist background + product image (next/image) + text reveal + scroll indicator.

**Step 3: Replace placeholder in page.tsx, verify visually**

**Step 4: Commit**

### Task 14: Build ScrollFramePlayer animation component

**Files:**
- Create: `src/components/animations/ScrollFramePlayer.tsx`

This is the core engine for the Product Morph. It:
1. Preloads all 90 frame images progressively
2. Uses GSAP ScrollTrigger with `pin: true` and `scrub: true`
3. On scroll progress (0-1), maps to frame index (0-89)
4. Draws current frame to a canvas element via drawImage
5. On mobile: falls back to a simple crossfade between frame 0 and frame 89

**Step 1: Implement ScrollFramePlayer**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCT_MORPH } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type ScrollFramePlayerProps = {
  className?: string;
};

export default function ScrollFramePlayer({ className }: ScrollFramePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const { totalFrames, framePrefix, frameExtension } = PRODUCT_MORPH;
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const num = String(i).padStart(3, "0");
      img.src = `${framePrefix}${num}${frameExtension}`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) setLoaded(true);
      };
      images.push(img);
    }
    framesRef.current = images;
  }, []);

  useEffect(() => {
    if (!loaded || reduced) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images = framesRef.current;

    // Size canvas to first frame
    const first = images[0];
    canvas.width = first.naturalWidth;
    canvas.height = first.naturalHeight;

    // Draw first frame
    ctx.drawImage(first, 0, 0);

    const obj = { frame: 0 };

    gsap.to(obj, {
      frame: images.length - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        pin: canvas.parentElement,
        scrub: 0.5,
      },
      onUpdate: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images[Math.round(obj.frame)], 0, 0);
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loaded, reduced]);

  if (reduced) {
    // Reduced motion fallback: just show the final branded image
    return (
      <div className={className}>
        <img
          src={`${PRODUCT_MORPH.framePrefix}${String(PRODUCT_MORPH.totalFrames).padStart(3, "0")}${PRODUCT_MORPH.frameExtension}`}
          alt="Libellule Senteurs — produit brande"
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

### Task 15: Build ProductMorph section

**Files:**
- Create: `src/components/sections/ProductMorph.tsx`

Wraps ScrollFramePlayer with the text overlays that appear during the morph:
- Phase 1 text: "Un objet. Un espace. Une attente..."
- Phase 3 text: "Libellule Senteurs" + "C'est lui donner une ame."

Text overlays animate with GSAP based on scroll progress (tied to same ScrollTrigger).

**Step 1: Implement ProductMorph section**

**Step 2: Replace placeholder in page.tsx, verify scroll behavior**

**Step 3: Commit**

### Task 16: Setup Remotion and create ProductMorphSequence composition

**Files:**
- Create: `src/remotion/Root.tsx`
- Create: `src/remotion/ProductMorphSequence.tsx`
- Create: `remotion.config.ts` (project root)

**Step 1: Create remotion.config.ts at project root**

```ts
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
```

**Step 2: Create src/remotion/Root.tsx**

```tsx
import { Composition, Folder } from "remotion";
import { ProductMorphSequence } from "./ProductMorphSequence";

export const RemotionRoot = () => {
  return (
    <Folder name="Libellule">
      <Composition
        id="ProductMorph"
        component={ProductMorphSequence}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1080}
      />
    </Folder>
  );
};
```

**Step 3: Create ProductMorphSequence composition**

This composition:
- Frame 0-30: White/cream product on blanc-casse background, no branding
- Frame 30-60: Background transitions white->black, golden particles fade in
- Frame 60-90: Logo fades in on product, golden glow, fully branded

Uses `useCurrentFrame()`, `interpolate()`, `Img` from remotion, `staticFile()`.

**Step 4: Verify in Remotion Studio**

```bash
npx remotion studio
```

**Step 5: Render the image sequence**

```bash
npx remotion render ProductMorph --image-format=png --sequence --output public/frames/morph-
```

This generates morph-001.png through morph-090.png in public/frames/.

**Step 6: Commit**

```bash
git add src/remotion/ remotion.config.ts public/frames/
git commit -m "Add Remotion Product Morph composition and render 90-frame sequence"
```

---

## Phase 4: Content Sections (Storytelling + Values)

### Task 17: Build Storytelling section

**Files:**
- Create: `src/components/sections/Storytelling.tsx`

Scroll-driven text reveal: each word transitions from dark gray to white/gold as user scrolls. GSAP ScrollTrigger with scrub. SVG dragonfly filigree in background with subtle wing animation.

**Step 1: Implement word-by-word scroll reveal**

**Step 2: Add dragonfly SVG filigree background**

**Step 3: Commit**

### Task 18: Build Values section

**Files:**
- Create: `src/components/sections/Values.tsx`

4 values (Elegance, Raffinement, Nature, Serenite) with gold SVG icons, staggered entrance via GSAP ScrollTrigger. Background subtly shifts tone between values.

**Step 1: Create 4 minimal SVG icons** (inline, gold stroke, ~40x40)

**Step 2: Implement staggered entrance animation**

**Step 3: Commit**

---

## Phase 5: Interactive Sections (Collection + Experience + Contact)

### Task 19: Build ProductCard component

**Files:**
- Create: `src/components/ui/ProductCard.tsx`

Product card with 3D tilt on hover (transform: perspective + rotateX/Y following mouse position). Gold light reflection follows cursor. Uses GSAP for the mouse tracking.

**Step 1: Implement ProductCard with 3D hover**

**Step 2: Commit**

### Task 20: Build Collection section (draggable carousel)

**Files:**
- Create: `src/components/sections/Collection.tsx`

Horizontal draggable carousel using GSAP Draggable + InertiaPlugin. Shows all products from the brand. On mobile: native horizontal scroll with snap.

**Step 1: Implement draggable carousel**

**Step 2: Commit**

### Task 21: Build Experience section (horizontal scroll)

**Files:**
- Create: `src/components/sections/Experience.tsx`

Vertical scroll triggers horizontal scroll of panels. Each panel shows a product in context (hotel, salon, spa, boutique) with internal parallax. Uses GSAP ScrollTrigger pin + horizontal scroll technique.

On mobile: falls back to vertical stacked sections.

**Step 1: Implement horizontal scroll section**

**Step 2: Commit**

### Task 22: Build Contact section

**Files:**
- Create: `src/components/sections/Contact.tsx`

Minimal form: name, email, message. Gold underline animation on focus. Coordinates and social links. No backend for now (form submits to mailto: or shows a success message).

**Step 1: Implement contact form with animated inputs**

**Step 2: Commit**

---

## Phase 6: Polish & Performance

### Task 23: Add section transition effects

Add golden mist/wave transition between key sections (especially Hero -> Product Morph). Use subtle gradient overlaps or animated dividers.

### Task 24: Add infinite marquee

Add a scrolling marquee with fragrance names between sections (between Values and Collection, and between Collection and Experience). Uses GSAP horizontal infinite scroll.

### Task 25: Performance optimization

- Verify all images use next/image with WebP
- Add `loading="lazy"` to below-fold images
- Verify Canvas animations pause when not in viewport
- Test with Lighthouse, target 90+ performance score
- Add `prefers-reduced-motion` verification for all animations

### Task 26: Mobile QA pass

- Verify all responsive breakpoints
- Test touch interactions (swipe carousel, no custom cursor)
- Verify Product Morph mobile fallback (simple fade)
- Test on Safari iOS (WebM compatibility, smooth scroll)
- Verify no horizontal overflow

### Task 27: Final visual polish

- Fine-tune all animation timings and easings
- Verify gold color consistency (#C99700) across all elements
- Check typography spacing (line-height 1.6-1.8 body)
- Verify loading screen works on cold load
- Cross-browser test (Chrome, Firefox, Safari, Edge)

### Task 28: Build and deploy prep

**Step 1: Production build**

```bash
npm run build
```

**Step 2: Fix any build errors**

**Step 3: Final commit**

```bash
git add -A
git commit -m "Final polish and production build"
```
