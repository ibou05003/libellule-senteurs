# Refonte "Condensation" Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the homepage from 12 sections (~1200vh) to 5 impactful sections (~500vh) to win the Libellule Senteurs client pitch.

**Architecture:** Replace scroll-jacking-heavy page with a 5-section layout: static hero, single scroll-driven canvas, multi-block product collection, storytelling + horizontal carousel, and contact with WhatsApp. Reuse existing ScrollCanvas, GoldenMist, Contact components. Create 4 new section components.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS v4, GSAP ScrollTrigger, Lenis smooth scroll, next/image

**Design doc:** `docs/plans/2026-03-30-refonte-condensation-design.md`

---

## Task 1: Create Hero component (static, 100vh)

**Files:**
- Create: `src/components/sections/HeroStatic.tsx`

**Step 1: Create the component**

```tsx
"use client";

import Image from "next/image";

export default function HeroStatic() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background image — collection spread */}
      <Image
        src="/images/mockups/collection-complete-packagings.webp"
        alt="Collection complete Libellule Senteurs"
        fill
        priority
        style={{ objectFit: "cover", objectPosition: "center 55%" }}
        sizes="100vw"
      />

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-noir-profond/80 via-noir-profond/30 to-noir-profond/20" />

      {/* Golden mist particles — lazy import to avoid blocking LCP */}
      <div className="absolute inset-0 z-[1]">
        <GoldenMistLazy />
      </div>

      {/* Brand content — centered */}
      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center animate-hero-fade-in">
        {/* Logo SVG */}
        <svg
          viewBox="0 0 36 36"
          className="mb-6 h-12 w-12 md:h-14 md:w-14"
          fill="none"
          stroke="#C99700"
          strokeWidth="1"
          aria-hidden="true"
        >
          <circle cx="18" cy="18" r="14" opacity="0.5" />
          <path d="M18 18 Q10 10 14 4 Q18 10 18 18" fill="#C99700" opacity="0.65" />
          <path d="M18 18 Q26 10 22 4 Q18 10 18 18" fill="#C99700" opacity="0.45" />
          <path d="M18 18 L18 28" strokeLinecap="round" opacity="0.5" />
        </svg>

        <h1 className="font-heading text-2xl tracking-[0.15em] text-or-luxe md:text-3xl lg:text-4xl">
          Libellule Senteurs
        </h1>
        <p className="mt-3 font-body text-xs tracking-[0.3em] uppercase text-blanc-casse/70 md:text-sm">
          Parfums d&apos;interieur haut de gamme &middot; Dakar
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-[2] -translate-x-1/2 animate-hero-fade-in-delayed">
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-blanc-casse/40">
            Decouvrir
          </span>
          <div className="h-8 w-px animate-pulse bg-gradient-to-b from-or-luxe/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* Lazy wrapper to keep GoldenMist out of the critical path */
import dynamic from "next/dynamic";
const GoldenMistLazy = dynamic(
  () => import("@/components/animations/GoldenMist"),
  { ssr: false }
);
```

**Step 2: Add CSS animations to globals.css**

Add these keyframes at the end of `src/app/globals.css` (before the `@media (prefers-reduced-motion)` block):

```css
/* Hero entrance — simple CSS fade, no GSAP needed */
@keyframes hero-fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-hero-fade-in {
  animation: hero-fade-in 0.8s ease-out 0.2s both;
}

.animate-hero-fade-in-delayed {
  animation: hero-fade-in 0.8s ease-out 0.8s both;
}
```

**Step 3: Reduce GoldenMist particle count**

In `src/components/animations/GoldenMist.tsx`, line 55, change:

```ts
// Before
const particleCount = isMobile ? 30 : 100;
// After
const particleCount = isMobile ? 20 : 40;
```

And remove the glow halo on mobile. Around line 168, wrap the glow draw:

```ts
// After the core particle draw (line 166), add mobile check:
if (!isMobile) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.1})`;
  ctx.fill();
}
```

This requires hoisting `isMobile` to be accessible in the animate closure (it already is — declared on line 54).

**Step 4: Build and verify**

Run: `npm run build`
Expected: builds without errors (HeroStatic is not yet wired into page.tsx)

**Step 5: Commit**

```bash
git add src/components/sections/HeroStatic.tsx src/components/animations/GoldenMist.tsx src/app/globals.css
git commit -m "Add static hero component and optimize GoldenMist particles"
```

---

## Task 2: Refactor AmbianceVideo to absorb Tagline

**Files:**
- Modify: `src/components/sections/AmbianceVideo.tsx`

**Step 1: Update AmbianceVideo — reduce height, integrate tagline**

Replace the full content of `src/components/sections/AmbianceVideo.tsx`:

```tsx
"use client";

import { useCallback, useRef } from "react";
import ScrollCanvas from "@/components/animations/ScrollCanvas";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";

export default function AmbianceCanvas() {
  const reducedMotion = useReducedMotion();
  const textRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  const framePath = useCallback(
    (i: number) => `/frames/ambiance/frame_${String(i).padStart(4, "0")}.webp`,
    []
  );

  const handleProgress = useCallback((p: number) => {
    // Tagline text fades in during middle of scroll, then out
    if (textRef.current) {
      let opacity = 0;
      if (p > 0.3 && p < 0.7) {
        // Fade in between 30-45%
        opacity = Math.min(1, (p - 0.3) / 0.15);
      } else if (p >= 0.7) {
        // Fade out between 70-85%
        opacity = Math.max(0, 1 - (p - 0.7) / 0.15);
      }
      textRef.current.style.opacity = String(opacity);
      textRef.current.style.transform = `translateY(${10 * (1 - opacity)}px)`;
    }

    // Cinematic vignette intensifies
    if (vignetteRef.current) {
      const vigP = Math.min(1, p / 0.4);
      vignetteRef.current.style.opacity = String(0.3 + 0.4 * vigP);
    }
  }, []);

  if (reducedMotion) {
    return (
      <section id="ambiance" className="relative h-screen">
        <Image
          src="/frames/ambiance/frame_0060.webp"
          alt="Diffuseur dans un interieur luxueux"
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-noir-profond/40">
          <p className="max-w-3xl text-center font-heading text-2xl leading-snug text-or-luxe md:text-4xl">
            Chaque espace a une ame — nous lui donnons une voix
          </p>
        </div>
      </section>
    );
  }

  return (
    <div id="ambiance">
      <ScrollCanvas
        frameCount={121}
        framePath={framePath}
        scrollHeight="200vh"
        onProgress={handleProgress}
      >
        {/* Cinematic vignette */}
        <div
          ref={vignetteRef}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.3,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Tagline — absorbed from the old Tagline section */}
        <div
          ref={textRef}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4"
          style={{ opacity: 0 }}
        >
          <p className="max-w-3xl text-center font-heading text-2xl leading-snug text-or-luxe md:text-5xl lg:text-7xl">
            Chaque espace a une ame
            <br />
            <span className="text-blanc-casse">— nous lui donnons une voix</span>
          </p>
        </div>

        {/* Bottom gradient transition: dark → light for next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent to-blanc-casse" />
      </ScrollCanvas>
    </div>
  );
}
```

Key changes:
- `scrollHeight` reduced from `"250vh"` to `"200vh"`
- Tagline text integrated directly as overlay (replacing old standalone section)
- Bottom gradient added for transition to light Collection section
- Progress thresholds adjusted for shorter scroll distance
- Component name exported as `AmbianceCanvas` (alias — still default export)

**Step 2: Build and verify**

Run: `npm run build`
Expected: builds without errors

**Step 3: Commit**

```bash
git add src/components/sections/AmbianceVideo.tsx
git commit -m "Integrate tagline into ambiance canvas and reduce scroll height"
```

---

## Task 3: Create Collection section (3 product blocks)

**Files:**
- Create: `src/components/sections/CollectionShowcase.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/* ── Product data ── */
const DIFFUSEUR = {
  label: "Le Diffuseur",
  title: "Chaque espace merite une signature olfactive",
  description:
    "Nos batonnets en bois naturel diffusent lentement un sillage delicat qui transforme chaque piece en sanctuaire de serenite.",
  image: "/images/products/diffuseur-baguettes-v2.png",
  alt: "Diffuseur a batonnets Libellule Senteurs",
  aspect: "904/1400",
};

const DUO_LIGHT = [
  {
    id: "bougie",
    label: "La Bougie",
    title: "Une flamme, mille sensations",
    description:
      "La cire fond doucement, liberant des notes soigneusement composees qui enveloppent votre interieur.",
    image: "/images/products/bougie-sans-marque.webp",
    alt: "Bougie parfumee Libellule Senteurs",
    aspect: "3/2",
  },
  {
    id: "huile",
    label: "L'Huile Essentielle",
    title: "Des essences pures, une serenite absolue",
    description:
      "Extraites avec soin, nos huiles capturent la quintessence de chaque plante pour une aromatherapie d'exception.",
    image: "/images/products/flacon-huile-essentielle-detour.webp",
    alt: "Flacon d'huile essentielle Libellule Senteurs",
    aspect: "3/4",
  },
];

const DUO_DARK = [
  {
    id: "parfum-noir",
    label: "Le Parfum d'Ambiance",
    title: "L'elegance dans chaque detail",
    description:
      "Un parfum d'ambiance raffine, presente dans un ecrin noir qui allie sophistication et caractere.",
    image: "/images/products/parfum-noir-boite-detour.webp",
    alt: "Parfum noir avec boite Libellule Senteurs",
    aspect: "800/1000",
  },
  {
    id: "cristal",
    label: "Le Cristal",
    title: "Au-dela du parfum, une experience",
    description:
      "Le flacon cristal incarne la purete de nos creations — un objet precieux qui sublime chaque interieur.",
    image: "/images/products/parfum-cristal-detour.webp",
    alt: "Parfum cristal Libellule Senteurs",
    aspect: "600/1000",
    featured: true,
  },
];

/* ── Shared CTA style ── */
function ProductCTA({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="#contact"
      className={`mt-6 inline-block border py-2.5 text-xs uppercase tracking-[0.2em] font-body transition-all duration-500 cursor-pointer ${
        dark
          ? "border-or-luxe/40 text-or-luxe hover:bg-or-luxe hover:text-noir-profond"
          : "border-noir-profond/30 text-noir-profond hover:bg-noir-profond hover:text-blanc-casse"
      }`}
      style={{ paddingInline: "2rem" }}
    >
      Decouvrir
    </a>
  );
}

/* ── Main component ── */
export default function CollectionShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const starImageRef = useRef<HTMLDivElement>(null);
  const duoLightRef = useRef<HTMLDivElement>(null);
  const duoDarkRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const kills: Array<gsap.core.Timeline | ScrollTrigger> = [];

    // Star product — parallax on image
    if (starImageRef.current && starRef.current) {
      const parallax = ScrollTrigger.create({
        trigger: starRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (starImageRef.current) {
            starImageRef.current.style.transform = `translateY(${(self.progress - 0.5) * -40}px)`;
          }
        },
      });
      kills.push(parallax);
    }

    // Star product — entrance
    if (starRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: starRef.current, start: "top 85%", toggleActions: "play none none none" },
      });
      tl.from(starRef.current.querySelectorAll("[data-animate]"), {
        opacity: 0, y: 40, stagger: 0.12, duration: 0.7, ease: "power2.out",
      });
      kills.push(tl);
    }

    // Duo light — staggered entrance
    if (duoLightRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: duoLightRef.current, start: "top 80%", toggleActions: "play none none none" },
      });
      tl.from(duoLightRef.current.querySelectorAll("[data-card]"), {
        opacity: 0, y: 60, stagger: 0.2, duration: 0.8, ease: "power2.out",
      });
      kills.push(tl);
    }

    // Duo dark — staggered entrance
    if (duoDarkRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: duoDarkRef.current, start: "top 80%", toggleActions: "play none none none" },
      });
      tl.from(duoDarkRef.current.querySelectorAll("[data-card]"), {
        opacity: 0, y: 60, stagger: 0.2, duration: 0.8, ease: "power2.out",
      });
      kills.push(tl);
    }

    return () => kills.forEach((k) => k.kill());
  }, [reducedMotion]);

  return (
    <section id="collection" ref={sectionRef}>
      {/* ── Bloc A: Star product (light) ── */}
      <div
        ref={starRef}
        className="bg-blanc-casse px-4 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center md:gap-16">
          {/* Image — 60% */}
          <div className="relative w-full md:w-[58%]">
            <div
              ref={starImageRef}
              className="relative mx-auto w-full max-w-lg"
              style={{ aspectRatio: DIFFUSEUR.aspect }}
              data-animate
            >
              <Image
                src={DIFFUSEUR.image}
                alt={DIFFUSEUR.alt}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 90vw, 55vw"
              />
            </div>
          </div>
          {/* Text — 40% */}
          <div className="w-full md:w-[42%]">
            <p data-animate className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe">
              {DIFFUSEUR.label}
            </p>
            <div data-animate className="my-4 h-px w-12 bg-or-luxe" />
            <h2 data-animate className="font-heading text-2xl leading-tight text-noir-profond md:text-3xl lg:text-4xl">
              {DIFFUSEUR.title}
            </h2>
            <p data-animate className="mt-5 max-w-md font-body text-base leading-relaxed text-noir-profond/60 md:text-lg">
              {DIFFUSEUR.description}
            </p>
            <div data-animate>
              <ProductCTA />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bloc B: Bougie + Huile (light) ── */}
      <div
        ref={duoLightRef}
        className="bg-blanc-casse px-4 pb-20 md:px-12 md:pb-28 lg:px-20 lg:pb-36"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          {DUO_LIGHT.map((prod) => (
            <div key={prod.id} data-card className="flex flex-col">
              <div className="relative w-full" style={{ aspectRatio: prod.aspect }}>
                <Image
                  src={prod.image}
                  alt={prod.alt}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 80vw, 40vw"
                />
              </div>
              <div className="mt-8">
                <p className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe">{prod.label}</p>
                <div className="my-3 h-px w-10 bg-or-luxe" />
                <h3 className="font-heading text-lg leading-tight text-noir-profond md:text-2xl lg:text-3xl">
                  {prod.title}
                </h3>
                <p className="mt-4 font-body text-base leading-relaxed text-noir-profond/60">{prod.description}</p>
                <ProductCTA />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transition gradient: light → dark ── */}
      <div className="h-24 bg-gradient-to-b from-blanc-casse to-noir-profond md:h-32" />

      {/* ── Bloc C: Parfum Noir + Cristal (dark) ── */}
      <div
        ref={duoDarkRef}
        className="bg-noir-profond px-4 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          {DUO_DARK.map((prod) => (
            <div
              key={prod.id}
              data-card
              className={`flex flex-col ${
                "featured" in prod && prod.featured ? "md:scale-105 md:origin-top" : ""
              }`}
            >
              <div className="relative w-full" style={{ aspectRatio: prod.aspect }}>
                <Image
                  src={prod.image}
                  alt={prod.alt}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 80vw, 40vw"
                />
                {/* Golden glow behind Cristal */}
                {"featured" in prod && prod.featured && (
                  <div
                    className="absolute inset-0 -z-10 blur-3xl"
                    style={{ background: "radial-gradient(circle, rgba(201,151,0,0.1) 0%, transparent 70%)" }}
                  />
                )}
              </div>
              <div className="mt-8">
                <p className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe">{prod.label}</p>
                <div className="my-3 h-px w-10 bg-or-luxe/60" />
                <h3 className="font-heading text-lg leading-tight text-blanc-casse md:text-2xl lg:text-3xl">
                  {prod.title}
                </h3>
                <p className="mt-4 font-body text-base leading-relaxed text-blanc-casse/60">{prod.description}</p>
                <ProductCTA dark />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Build and verify**

Run: `npm run build`
Expected: builds without errors

**Step 3: Commit**

```bash
git add src/components/sections/CollectionShowcase.tsx
git commit -m "Add Collection showcase with 3 distinct product blocks"
```

---

## Task 4: Create Univers section (histoire + carousel + values)

**Files:**
- Create: `src/components/sections/Univers.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
  { src: "/images/experience/hotel.webp", alt: "Hotel 5 etoiles, Dakar", label: "Hotellerie" },
  { src: "/images/experience/spa-01.webp", alt: "Spa prive", label: "Spa" },
  { src: "/images/experience/boutique-01.webp", alt: "Boutique de luxe", label: "Boutique" },
  { src: "/images/experience/salon-luxe-01.webp", alt: "Salon contemporain", label: "Residences" },
  { src: "/images/experience/spa-02.webp", alt: "Espace bien-etre", label: "Bien-etre" },
  { src: "/images/experience/boutique-02.webp", alt: "Espace retail", label: "Retail" },
  { src: "/images/experience/salon-luxe-02.webp", alt: "Interieur haut de gamme", label: "Interieur" },
  { src: "/images/experience/boutique-03.webp", alt: "Concept store", label: "Concept Store" },
];

const VALUES = [
  "5 Creations",
  "100% Naturel",
  "Fait Main",
  "Dakar, Senegal",
];

export default function Univers() {
  const storyRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const kills: gsap.core.Timeline[] = [];

    // Story entrance
    if (storyRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: storyRef.current, start: "top 80%", toggleActions: "play none none none" },
      });
      tl.from(storyRef.current.querySelectorAll("[data-animate]"), {
        opacity: 0, y: 30, stagger: 0.15, duration: 0.7, ease: "power2.out",
      });
      kills.push(tl);
    }

    // Carousel entrance
    if (carouselRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: carouselRef.current, start: "top 85%", toggleActions: "play none none none" },
      });
      tl.from(carouselRef.current, {
        opacity: 0, y: 20, duration: 0.6, ease: "power2.out",
      });
      kills.push(tl);
    }

    return () => kills.forEach((k) => k.kill());
  }, [reducedMotion]);

  return (
    <section id="univers" className="bg-noir-profond">
      {/* ── Notre Histoire (compact) ── */}
      <div ref={storyRef} className="px-4 pt-24 pb-16 md:px-8 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <p data-animate className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe">
            Notre Histoire
          </p>
          <div data-animate className="mx-auto my-5 h-px w-16 bg-or-luxe/60" />
          <h2 data-animate className="font-heading text-2xl leading-tight text-blanc-casse md:text-4xl lg:text-5xl">
            Nee a Dakar, inspiree par le monde
          </h2>
          <p data-animate className="mt-8 font-body text-base leading-[1.8] text-blanc-casse/70 md:text-lg">
            Libellule Senteurs cree des parfums d&apos;interieur qui marient les essences
            d&apos;Afrique de l&apos;Ouest aux traditions de la haute parfumerie. Chaque
            creation est fabriquee a la main, avec des ingredients naturels soigneusement
            selectionnes — parce que le luxe reside dans ce qu&apos;on ne voit pas, mais
            qu&apos;on ressent.
          </p>
        </div>
      </div>

      {/* ── Carousel d'experience ── */}
      <div ref={carouselRef} className="pb-16 md:pb-20">
        <div
          className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide md:gap-6 md:px-8"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {EXPERIENCES.map((exp, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 overflow-hidden"
              style={{ width: "clamp(260px, 35vw, 400px)", aspectRatio: "3/2", scrollSnapAlign: "start" }}
            >
              <Image
                src={exp.src}
                alt={exp.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 70vw, 35vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir-profond/70 to-transparent p-4">
                <span className="font-body text-xs tracking-[0.2em] uppercase text-blanc-casse/80">
                  {exp.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Values (inline, no counters) ── */}
      <div className="border-t border-blanc-casse/10 px-4 py-12 md:py-16">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12">
          {VALUES.map((val, i) => (
            <div key={val} className="flex items-center gap-x-8 md:gap-x-12">
              <span className="font-heading text-sm tracking-[0.15em] text-or-luxe md:text-base">
                {val}
              </span>
              {i < VALUES.length - 1 && (
                <span className="hidden text-or-luxe/30 md:inline" aria-hidden="true">&middot;</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Build and verify**

Run: `npm run build`
Expected: builds without errors

**Step 3: Commit**

```bash
git add src/components/sections/Univers.tsx
git commit -m "Add Univers section with story, experience carousel, and values"
```

---

## Task 5: Refactor Contact to 2-column layout with WhatsApp

**Files:**
- Modify: `src/components/sections/Contact.tsx`

**Step 1: Update Contact layout**

Rewrite `src/components/sections/Contact.tsx` to add a WhatsApp column beside the form. Keep all existing form logic (useState, handleSubmit, API call). The key change is the layout: 2 columns on desktop, stacked on mobile.

Changes to make:
- The outer container becomes a 2-column grid on md+
- Left column: the existing form (unchanged logic)
- Right column: WhatsApp CTA block
- Section heading stays above both columns, full-width centered

In the section layout div, after the heading and before the form, wrap the form and add a WhatsApp block:

```tsx
{/* Replace the single form block with a 2-column grid */}
<div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
  {/* Left: Form */}
  <div>
    {submitted ? (
      /* ...existing confirmation JSX... */
    ) : (
      <form onSubmit={handleSubmit} className="space-y-10" noValidate>
        {/* ...existing form fields unchanged... */}
      </form>
    )}
  </div>

  {/* Right: WhatsApp + info */}
  <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
    <div className="mb-8">
      <p className="font-heading text-lg text-blanc-casse md:text-xl">
        Reponse rapide
      </p>
      <p className="mt-2 font-body text-sm text-blanc-casse/60 leading-relaxed">
        Ecrivez-nous directement sur WhatsApp pour une reponse dans l&apos;heure.
      </p>
    </div>
    <a
      href="https://wa.me/221XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20produits."
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 font-body text-sm font-medium text-white tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
    >
      <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Demarrer une conversation
    </a>
    <div className="mt-12 space-y-3 text-blanc-casse/60 font-body text-sm">
      <a href="mailto:contacts@libellulessenteurs.com" className="block hover:text-or-luxe transition-colors cursor-pointer">
        contacts@libellulessenteurs.com
      </a>
      <p>Dakar, Senegal</p>
    </div>
  </div>
</div>
```

Also widen `max-w-xl` to `max-w-5xl` on the outer container to accommodate 2 columns.

**Step 2: Build and verify**

Run: `npm run build`
Expected: builds without errors

**Step 3: Commit**

```bash
git add src/components/sections/Contact.tsx
git commit -m "Add WhatsApp column to contact section"
```

---

## Task 6: Update Navigation links

**Files:**
- Modify: `src/components/layout/Navigation.tsx`

**Step 1: Update NAV_LINKS**

In `src/components/layout/Navigation.tsx`, line 6-10, replace:

```ts
const NAV_LINKS = [
  { href: "#histoire", label: "Notre Histoire" },
  { href: "#collection", label: "Collection" },
  { href: "#ambiance", label: "Expérience" },
  { href: "#contact", label: "Contact" },
] as const;
```

With:

```ts
const NAV_LINKS = [
  { href: "#collection", label: "Collection" },
  { href: "#univers", label: "Notre Univers" },
  { href: "#contact", label: "Contact" },
] as const;
```

3 links instead of 4 — cleaner, and all anchors map to real section IDs.

**Step 2: Update Footer nav links**

In `src/components/layout/Footer.tsx`, line 34-38, update the nav links to match:

```tsx
<a href="#collection" className="hover:text-blanc-casse/70 transition-colors duration-400 cursor-pointer">Collection</a>
<a href="#univers" className="hover:text-blanc-casse/70 transition-colors duration-400 cursor-pointer">Notre Univers</a>
<a href="#contact" className="hover:text-blanc-casse/70 transition-colors duration-400 cursor-pointer">Contact</a>
```

**Step 3: Build and verify**

Run: `npm run build`
Expected: builds without errors

**Step 4: Commit**

```bash
git add src/components/layout/Navigation.tsx src/components/layout/Footer.tsx
git commit -m "Update navigation links to match new section structure"
```

---

## Task 7: Assemble new page.tsx

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Rewrite page.tsx**

Replace the full content of `src/app/page.tsx`:

```tsx
"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HeroStatic from "@/components/sections/HeroStatic";
import AmbianceVideo from "@/components/sections/AmbianceVideo";
import CollectionShowcase from "@/components/sections/CollectionShowcase";
import Univers from "@/components/sections/Univers";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  useSmoothScroll();

  return (
    <>
      <CustomCursor />
      <Navigation />
      <WhatsAppButton />

      <main>
        {/* 1. Hero — static, immediate impact */}
        <HeroStatic />

        {/* 2. Ambiance Canvas — the single scroll-driven showcase */}
        <AmbianceVideo />

        {/* 3. Collection — 3 product blocks, scroll normal */}
        <CollectionShowcase />

        {/* 4. Univers — story + experience carousel + values */}
        <Univers />

        {/* 5. Contact — form + WhatsApp */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
```

**Step 2: Build and verify the full site**

Run: `npm run build`
Expected: builds without errors

**Step 3: Visual verification**

Run: `npm run dev`
Open http://localhost:3000 and verify:
- Hero loads immediately with collection image, logo, particles
- Scrolling into ambiance canvas plays frames smoothly with tagline overlay
- Collection section shows 3 distinct product blocks (star, duo light, duo dark)
- Univers section shows story text, scrollable carousel, inline values
- Contact shows form + WhatsApp side by side
- Navigation links scroll to correct sections
- WhatsApp floating button appears after scrolling

**Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "Assemble condensed 5-section homepage"
```

---

## Task 8: Clean up dead components

**Files:**
- Delete: multiple unused component files

**Step 1: Verify no imports exist**

Run grep for each component to confirm nothing imports them:

```bash
grep -r "HeroConvergence\|Tagline\|ProductSection\|ProductDuo\|NotreHistoire\|CollectionGrid\|BrandMarquee\|ValuesCounters" src/app/ --include="*.tsx" --include="*.ts"
```

Expected: no results (page.tsx no longer imports any of these)

**Step 2: Delete obsolete section components**

```bash
rm src/components/sections/HeroConvergence.tsx
rm src/components/sections/Tagline.tsx
rm src/components/sections/ProductSection.tsx
rm src/components/sections/ProductDuo.tsx
rm src/components/sections/NotreHistoire.tsx
rm src/components/sections/CollectionGrid.tsx
rm src/components/sections/BrandMarquee.tsx
rm src/components/sections/ValuesCounters.tsx
```

**Step 3: Delete pre-existing dead components**

```bash
rm src/components/sections/Hero.tsx
rm src/components/sections/Collection.tsx
rm src/components/sections/Experience.tsx
rm src/components/sections/CinematicScroll.tsx
rm src/components/sections/ProductMorph.tsx
rm src/components/sections/Storytelling.tsx
rm src/components/sections/Values.tsx
rm src/components/layout/LoadingScreen.tsx
rm src/components/animations/TextReveal.tsx
rm src/components/animations/ScrollFramePlayer.tsx
rm src/components/ui/ProductCard.tsx
rm src/components/ui/Marquee.tsx
```

**Step 4: Build and verify**

Run: `npm run build`
Expected: builds without errors, no unused import warnings

**Step 5: Commit**

```bash
git add -A
git commit -m "Remove 20 obsolete components from pre-refonte architecture"
```

---

## Task 9: Final polish and responsive verification

**Files:**
- Possibly modify: any component that needs adjustment

**Step 1: Run dev server and test responsive breakpoints**

Run: `npm run dev`

Check at these viewport widths:
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (iPad)
- 1024px (laptop)
- 1440px (desktop)

**Step 2: Verify key interactions**

- [ ] Hero image loads fast (priority flag set)
- [ ] GoldenMist particles are subtle (40 max)
- [ ] Ambiance canvas plays smoothly on scroll
- [ ] Tagline text appears and disappears within canvas
- [ ] Transition gradient canvas → collection is smooth
- [ ] Star product parallax works
- [ ] Duo cards animate in on scroll
- [ ] Dark/light transition in collection is clean
- [ ] Experience carousel scrolls horizontally (drag on mobile)
- [ ] Values line is readable
- [ ] Contact form submits correctly
- [ ] WhatsApp button links work
- [ ] Nav links scroll to correct sections
- [ ] Mobile hamburger menu works
- [ ] Reduced motion fallbacks work

**Step 3: Fix any issues found**

Address responsive or visual issues discovered during testing.

**Step 4: Final commit**

```bash
git add -A
git commit -m "Polish responsive layout and fix visual issues"
```
