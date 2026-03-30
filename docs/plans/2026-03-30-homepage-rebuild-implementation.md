# Homepage Rebuild — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the homepage with a GSAP-driven hero (product convergence), scroll-driven canvas video (ambiance diffuseur), 5 product sections, and breathing sections (tagline, marquee, values).

**Architecture:** Replace the single CinematicScroll.tsx (1206 lines, 6 acts) with modular section components. Each section is its own component with its own ScrollTrigger. The ambiance section uses a canvas that scrubs through 121 pre-extracted WebP frames on scroll. The hero animates detoured product PNGs converging via GSAP.

**Tech Stack:** Next.js 14+ (App Router), GSAP ScrollTrigger, Lenis smooth scroll, Tailwind CSS v4, Canvas API for frame scrubbing.

---

## Task 1: Create ScrollCanvas component for frame scrubbing

**Files:**
- Create: `src/components/animations/ScrollCanvas.tsx`

**What:** A reusable canvas component that preloads N image frames and paints the current frame based on scroll progress. This is the core engine for the ambiance video section.

**Step 1: Create ScrollCanvas.tsx**

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollCanvasProps {
  frameCount: number;
  framePath: (index: number) => string; // e.g. (i) => `/frames/ambiance/frame_${String(i).padStart(4,'0')}.webp`
  scrollHeight?: string; // e.g. "600vh"
  className?: string;
}

export default function ScrollCanvas({
  frameCount,
  framePath,
  scrollHeight = "600vh",
  className = "",
}: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    // Preload all frames
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          render(); // Paint first frame when all loaded
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    function render() {
      if (!ctx || !canvas) return;
      const img = imagesRef.current[currentFrameRef.current];
      if (!img || !img.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cover-fit the image into canvas
      const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
      );
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;

      ctx.drawImage(img, x, y, w, h);
    }

    // ScrollTrigger: scrub through frames
    const obj = { frame: 0 };
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(self.progress * frameCount)
        );
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          render();
        }
      },
    });

    resize();
    window.addEventListener("resize", resize);

    return () => {
      st.kill();
      window.removeEventListener("resize", resize);
    };
  }, [frameCount, framePath]);

  return (
    <div ref={containerRef} style={{ height: scrollHeight }} className={className}>
      <div className="sticky top-0 h-screen w-full">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: No errors (component not yet imported)

**Step 3: Commit**

```bash
git add src/components/animations/ScrollCanvas.tsx
git commit -m "Add ScrollCanvas component for scroll-driven frame scrubbing"
```

---

## Task 2: Create HeroConvergence section

**Files:**
- Create: `src/components/sections/HeroConvergence.tsx`

**What:** The hero section where 5 product images start spread apart and converge to center on scroll, with golden mist particles and brand text reveal.

**Step 1: Create HeroConvergence.tsx**

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldenMist from "@/components/animations/GoldenMist";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    src: "/images/products/diffuseur-baguettes-v2.png",
    alt: "Diffuseur",
    startX: -35, // vw offset from center
    startY: 5,
    width: "clamp(120px, 18vw, 260px)",
    aspect: "904/1400",
  },
  {
    src: "/images/products/flacon-huile-essentielle-detour.webp",
    alt: "Huile essentielle",
    startX: -12,
    startY: 8,
    width: "clamp(80px, 10vw, 150px)",
    aspect: "600/900",
  },
  {
    src: "/images/products/bougie-parfumee-dimensions.webp",
    alt: "Bougie",
    startX: 8,
    startY: 3,
    width: "clamp(100px, 14vw, 200px)",
    aspect: "800/900",
  },
  {
    src: "/images/products/parfum-cristal-detour.webp",
    alt: "Cristal",
    startX: 28,
    startY: 6,
    width: "clamp(90px, 12vw, 180px)",
    aspect: "600/1000",
  },
];

export default function HeroConvergence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;

        // Phase 1 (0-0.6): Products converge from spread positions to center
        const converge = Math.min(1, p / 0.6);
        const eased = converge * converge * (3 - 2 * converge); // smoothstep

        productRefs.current.forEach((el, i) => {
          if (!el) return;
          const prod = PRODUCTS[i];
          const x = prod.startX * (1 - eased); // vw -> 0
          const y = prod.startY * (1 - eased);
          const scale = 0.85 + 0.15 * eased;
          el.style.transform = `translate(${x}vw, ${y}vh) scale(${scale})`;
          el.style.opacity = String(Math.min(1, p / 0.1)); // fade in at start
        });

        // Phase 2 (0.6-0.8): Title fades in
        if (titleRef.current) {
          const titleP = Math.max(0, Math.min(1, (p - 0.5) / 0.2));
          titleRef.current.style.opacity = String(titleP);
          titleRef.current.style.transform = `translateY(${30 * (1 - titleP)}px)`;
        }

        // Phase 3 (0.8-1.0): Everything fades out for next section
        if (p > 0.8) {
          const fadeOut = (p - 0.8) / 0.2;
          const opacity = 1 - fadeOut;
          productRefs.current.forEach((el) => {
            if (el) el.style.opacity = String(opacity);
          });
          if (titleRef.current) titleRef.current.style.opacity = String(opacity);
        }
      },
    });

    return () => st.kill();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-noir-profond px-8 text-center">
        <h1 className="font-heading text-4xl text-or-luxe">Libellule Senteurs</h1>
        <p className="mt-4 font-body text-lg text-blanc-casse/80">
          L&apos;essence du raffinement invisible
        </p>
      </section>
    );
  }

  return (
    <section ref={containerRef} style={{ height: "500vh" }} className="relative">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-noir-profond">
        <GoldenMist />

        {/* Products */}
        {PRODUCTS.map((prod, i) => (
          <div
            key={prod.alt}
            ref={(el) => { productRefs.current[i] = el; }}
            className="pointer-events-none absolute"
            style={{
              left: "50%",
              top: "50%",
              marginLeft: "-50%",
              width: prod.width,
              aspectRatio: prod.aspect,
              opacity: 0,
              transform: `translate(${prod.startX}vw, ${prod.startY}vh) scale(0.85)`,
              zIndex: 5 + i,
            }}
          >
            <Image
              src={prod.src}
              alt={prod.alt}
              fill
              sizes="(max-width: 768px) 30vw, 20vw"
              style={{ objectFit: "contain" }}
              priority={i === 0}
            />
          </div>
        ))}

        {/* Title */}
        <div
          ref={titleRef}
          className="absolute z-20 text-center"
          style={{ opacity: 0, bottom: "12%" }}
        >
          <p className="font-heading text-sm uppercase tracking-[0.3em] text-or-luxe/80">
            Libellule Senteurs
          </p>
          <h1 className="mt-3 font-heading text-4xl leading-tight text-blanc-casse md:text-6xl">
            L&apos;essence du raffinement
            <br />
            invisible
          </h1>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/sections/HeroConvergence.tsx
git commit -m "Add HeroConvergence section with product convergence animation"
```

---

## Task 3: Create ProductSection reusable component

**Files:**
- Create: `src/components/sections/ProductSection.tsx`

**What:** A reusable component for individual product sections (Diffuseur, Huile, Bougie, Parfum Noir, Cristal). Handles alternating layout (image left/right), dark/light backgrounds, and scroll-triggered entrance animations.

**Step 1: Create ProductSection.tsx**

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ProductSectionProps {
  id: string;
  label: string;
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  imageAspect?: string;
  imageSide?: "left" | "right" | "center";
  theme?: "light" | "dark";
}

export default function ProductSection({
  id,
  label,
  title,
  description,
  imageSrc,
  imageAlt,
  imageAspect = "3/4",
  imageSide = "right",
  theme = "dark",
}: ProductSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    if (!section || !image || !text) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
    });

    tl.fromTo(
      image,
      { scale: 0.8, opacity: 0, y: 60 },
      { scale: 1, opacity: 1, y: 0, duration: 1 }
    );

    tl.fromTo(
      text,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1 },
      0.2
    );

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-noir-profond" : "bg-blanc-casse";
  const textColor = isDark ? "text-blanc-casse" : "text-noir-profond";
  const labelColor = "text-or-luxe";

  const isCentered = imageSide === "center";

  if (isCentered) {
    return (
      <section
        id={id}
        ref={sectionRef}
        className={`relative flex min-h-screen flex-col items-center justify-center ${bgClass} px-8 py-32`}
      >
        <div ref={imageRef} className="relative w-full max-w-md" style={{ aspectRatio: imageAspect }}>
          <Image src={imageSrc} alt={imageAlt} fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 80vw, 400px" />
        </div>
        <div ref={textRef} className="mt-12 text-center">
          <p className={`font-heading text-xs uppercase tracking-[0.3em] ${labelColor}`}>{label}</p>
          <h2 className={`mt-3 font-heading text-3xl md:text-5xl ${textColor}`}>{title}</h2>
          {description && <p className={`mt-4 max-w-lg font-body text-lg ${textColor}/70`}>{description}</p>}
        </div>
      </section>
    );
  }

  const isLeft = imageSide === "left";

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative flex min-h-screen items-center ${bgClass} px-8 md:px-16 lg:px-24`}
    >
      <div className={`flex w-full flex-col gap-12 md:flex-row md:items-center ${isLeft ? "" : "md:flex-row-reverse"}`}>
        {/* Image */}
        <div ref={imageRef} className="relative w-full md:w-1/2" style={{ aspectRatio: imageAspect }}>
          <Image src={imageSrc} alt={imageAlt} fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 90vw, 50vw" />
        </div>

        {/* Text */}
        <div ref={textRef} className={`w-full md:w-1/2 ${isLeft ? "md:pl-16" : "md:pr-16"}`}>
          <p className={`font-heading text-xs uppercase tracking-[0.3em] ${labelColor}`}>{label}</p>
          <h2 className={`mt-3 font-heading text-3xl leading-tight md:text-5xl ${textColor}`}>{title}</h2>
          {description && (
            <p className={`mt-6 font-body text-lg leading-relaxed ${isDark ? "text-blanc-casse/70" : "text-noir-profond/70"}`}>
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/sections/ProductSection.tsx
git commit -m "Add reusable ProductSection component with scroll animations"
```

---

## Task 4: Create Tagline section

**Files:**
- Create: `src/components/sections/Tagline.tsx`

**What:** Full-screen dark section with a large gold text that reveals word by word on scroll.

**Step 1: Create Tagline.tsx**

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface TaglineProps {
  text?: string;
}

export default function Tagline({ text = "L'essence du raffinement invisible" }: TaglineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  const words = text.split(" ");

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        wordsRef.current.forEach((el, i) => {
          if (!el) return;
          const wordStart = i / words.length;
          const wordEnd = (i + 1) / words.length;
          const wordP = Math.max(0, Math.min(1, (p - wordStart) / (wordEnd - wordStart)));
          el.style.opacity = String(0.15 + 0.85 * wordP);
          el.style.transform = `translateY(${20 * (1 - wordP)}px)`;
        });
      },
    });

    return () => st.kill();
  }, [reducedMotion, words.length]);

  return (
    <section ref={containerRef} style={{ height: "200vh" }} className="relative">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center bg-noir-profond px-8">
        <p className="max-w-4xl text-center font-heading text-4xl leading-snug text-or-luxe md:text-6xl lg:text-7xl">
          {words.map((word, i) => (
            <span
              key={i}
              ref={(el) => { wordsRef.current[i] = el; }}
              className="mr-[0.3em] inline-block"
              style={{ opacity: 0.15 }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
```

**Step 2: Verify build, commit**

```bash
git add src/components/sections/Tagline.tsx
git commit -m "Add Tagline section with word-by-word scroll reveal"
```

---

## Task 5: Create BrandMarquee section

**Files:**
- Create: `src/components/sections/BrandMarquee.tsx`

**What:** Infinite horizontal scrolling text with stroke-only gold typography.

**Step 1: Create BrandMarquee.tsx**

```tsx
"use client";

interface BrandMarqueeProps {
  text?: string;
}

export default function BrandMarquee({
  text = "Libellule Senteurs · Parfums d'intérieur haut de gamme · ",
}: BrandMarqueeProps) {
  // Repeat text enough times to fill the screen
  const repeated = Array(6).fill(text).join("");

  return (
    <section className="relative flex h-screen items-center overflow-hidden bg-noir-profond">
      <div className="animate-marquee flex whitespace-nowrap">
        <span
          className="font-heading text-[8vw] leading-none"
          style={{
            WebkitTextStroke: "1.5px #C99700",
            WebkitTextFillColor: "transparent",
          }}
        >
          {repeated}
        </span>
        <span
          className="font-heading text-[8vw] leading-none"
          style={{
            WebkitTextStroke: "1.5px #C99700",
            WebkitTextFillColor: "transparent",
          }}
        >
          {repeated}
        </span>
      </div>
    </section>
  );
}
```

**Step 2: Add marquee animation to globals.css**

In `src/app/globals.css`, add after existing keyframes:

```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}
```

**Step 3: Commit**

```bash
git add src/components/sections/BrandMarquee.tsx src/app/globals.css
git commit -m "Add BrandMarquee section with infinite horizontal scroll"
```

---

## Task 6: Create ValuesCounters section

**Files:**
- Create: `src/components/sections/ValuesCounters.tsx`

**What:** Animated counters that tick up on scroll (4 fragrances, 100% naturel, etc.)

**Step 1: Create ValuesCounters.tsx**

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  { end: 4, suffix: "", label: "fragrances signature" },
  { end: 100, suffix: "%", label: "naturel" },
  { end: 1, suffix: "", label: "philosophie", display: "Fait main" },
  { end: 1, suffix: "", label: "origine", display: "Dakar, Sénégal" },
];

export default function ValuesCounters() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "top 20%",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        VALUES.forEach((val, i) => {
          const el = numberRefs.current[i];
          if (!el) return;
          if (val.display) {
            el.style.opacity = String(p);
          } else {
            const current = Math.round(val.end * p);
            el.textContent = `${current}${val.suffix}`;
          }
        });
      },
    });

    return () => st.kill();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative flex min-h-[70vh] items-center bg-noir-profond px-8 py-24">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-12 md:grid-cols-4">
        {VALUES.map((val, i) => (
          <div key={val.label} className="text-center">
            <span
              ref={(el) => { numberRefs.current[i] = el; }}
              className="block font-heading text-5xl text-or-luxe md:text-6xl"
            >
              {val.display || `0${val.suffix}`}
            </span>
            <span className="mt-3 block font-body text-sm uppercase tracking-widest text-blanc-casse/60">
              {val.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/sections/ValuesCounters.tsx
git commit -m "Add ValuesCounters section with scroll-driven counter animations"
```

---

## Task 7: Create AmbianceVideo section

**Files:**
- Create: `src/components/sections/AmbianceVideo.tsx`

**What:** Wraps ScrollCanvas with the ambiance frames. Adds an overlay text that fades in midway.

**Step 1: Create AmbianceVideo.tsx**

```tsx
"use client";

import { useCallback } from "react";
import ScrollCanvas from "@/components/animations/ScrollCanvas";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";

export default function AmbianceVideo() {
  const reducedMotion = useReducedMotion();

  const framePath = useCallback(
    (i: number) => `/frames/ambiance/frame_${String(i).padStart(4, "0")}.webp`,
    []
  );

  if (reducedMotion) {
    return (
      <section className="relative h-screen">
        <Image
          src="/frames/ambiance/frame_0060.webp"
          alt="Diffuseur dans un hôtel de luxe"
          fill
          style={{ objectFit: "cover" }}
        />
      </section>
    );
  }

  return <ScrollCanvas frameCount={121} framePath={framePath} scrollHeight="600vh" />;
}
```

**Step 2: Commit**

```bash
git add src/components/sections/AmbianceVideo.tsx
git commit -m "Add AmbianceVideo section wrapping ScrollCanvas with ambiance frames"
```

---

## Task 8: Assemble the new homepage

**Files:**
- Modify: `src/app/page.tsx`

**What:** Replace the single CinematicScroll with the 12 new sections in order.

**Step 1: Rewrite page.tsx**

```tsx
"use client";

import { useState, useCallback } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import LoadingScreen from "@/components/layout/LoadingScreen";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import HeroConvergence from "@/components/sections/HeroConvergence";
import Tagline from "@/components/sections/Tagline";
import ProductSection from "@/components/sections/ProductSection";
import AmbianceVideo from "@/components/sections/AmbianceVideo";
import BrandMarquee from "@/components/sections/BrandMarquee";
import ValuesCounters from "@/components/sections/ValuesCounters";
import Contact from "@/components/sections/Contact";
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
        {/* 1. Hero — Products converge */}
        <HeroConvergence />

        {/* 2. Tagline — Word by word reveal */}
        <Tagline />

        {/* 3. Diffuseur — Product section (light, image right) */}
        <ProductSection
          id="diffuseur"
          label="Le Diffuseur"
          title="Chaque espace mérite une signature olfactive"
          imageSrc="/images/products/diffuseur-baguettes-v2.png"
          imageAlt="Diffuseur à bâtonnets Libellule Senteurs"
          imageAspect="904/1400"
          imageSide="right"
          theme="light"
        />

        {/* 4. Ambiance Video — Scroll-driven canvas */}
        <AmbianceVideo />

        {/* 5. Huile Essentielle — Product section (light, image left) */}
        <ProductSection
          id="huile"
          label="L'Huile Essentielle"
          title="Des essences pures, une sérénité absolue"
          imageSrc="/images/products/flacon-huile-essentielle-detour.webp"
          imageAlt="Flacon d'huile essentielle Libellule Senteurs"
          imageAspect="600/900"
          imageSide="left"
          theme="light"
        />

        {/* 6. Marquee — Brand name scroll */}
        <BrandMarquee />

        {/* 7. Bougie — Product section (dark, image right) */}
        <ProductSection
          id="bougie"
          label="La Bougie"
          title="Une flamme, mille sensations"
          imageSrc="/images/products/bougie-parfumee-dimensions.webp"
          imageAlt="Bougie parfumée Libellule Senteurs"
          imageAspect="800/900"
          imageSide="right"
          theme="dark"
        />

        {/* 8. Values / Counters */}
        <ValuesCounters />

        {/* 9. Parfum Noir — Product section (dark, image left) */}
        <ProductSection
          id="parfum-noir"
          label="Le Parfum d'Ambiance"
          title="L'élégance dans chaque détail"
          imageSrc="/images/products/parfum-noir-boite-detour.webp"
          imageAlt="Parfum noir avec boîte Libellule Senteurs"
          imageAspect="800/1000"
          imageSide="left"
          theme="dark"
        />

        {/* 10. Cristal — Product section (dark, centered, dramatic) */}
        <ProductSection
          id="cristal"
          label="Le Cristal"
          title="Au-delà du parfum, une expérience"
          imageSrc="/images/products/parfum-cristal-detour.webp"
          imageAlt="Parfum cristal Libellule Senteurs"
          imageAspect="600/1000"
          imageSide="center"
          theme="dark"
        />

        {/* 11. Contact */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Clean build, no errors

**Step 3: Run dev and visual check**

Run: `npm run dev`
Open `http://localhost:3000` and scroll through all sections.

**Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "Rebuild homepage with modular sections and scroll-driven animations"
```

---

## Task 9: Polish and iterate

**What:** After initial assembly, review and fix:
- Product positioning/sizing in HeroConvergence (startX/startY values)
- Scroll heights per section (may need adjustment for pacing)
- Transition smoothness between light/dark sections
- Mobile fallback for all new sections
- Performance check (frame preloading, image optimization)

This task is iterative — review in browser, adjust values, commit.

---

## Execution Notes

- **Do NOT delete CinematicScroll.tsx yet** — keep it until the new page is verified
- The old unused sections (Collection.tsx, Experience.tsx, Storytelling.tsx, Values.tsx, ProductMorph.tsx) can be cleaned up after verification
- All new components follow the same patterns as existing code: GSAP ScrollTrigger, useReducedMotion, refs for animation targets
- Each section manages its own ScrollTrigger (no global coordinator needed — Lenis handles smooth scroll globally)
