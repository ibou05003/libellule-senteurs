"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

// GoldenMist uses canvas + rAF — lazy-load it so it never blocks SSR or the
// initial paint of the hero image, which should be as fast as possible.
const GoldenMist = dynamic(
  () => import("@/components/animations/GoldenMist"),
  { ssr: false }
);

/**
 * HeroStatic — fullscreen (100vh) opening section.
 *
 * Intentionally free of scroll-jacking or GSAP: the page must feel
 * immediately usable on first load. The collection image is above the fold
 * from the first frame, conveying product quality without any interaction.
 *
 * Layers (bottom → top):
 *   1. next/image fill — the packagings photo, object-position "center 55%"
 *      keeps the bottles in frame rather than cropping to the caps.
 *   2. Dark gradient overlay — darkens bottom edge for text legibility,
 *      fades toward the top to preserve atmosphere.
 *   3. GoldenMist particles — ambient gold atmosphere, lazy-loaded.
 *   4. Brand content (logo + wordmark + tagline) — centered, z-index above all.
 *   5. Scroll indicator — bottom of viewport, delayed entrance.
 */
export default function HeroStatic() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh" }}
      aria-label="Libellule Senteurs — Parfums d&apos;intérieur haut de gamme"
    >
      {/* ── 1. Background image ─────────────────────────────────────────── */}
      <Image
        src="/images/mockups/collection-complete-packagings.webp"
        alt="Collection complète Libellule Senteurs — flacons de parfums d'intérieur"
        fill
        priority
        // objectFit/objectPosition via style: next/image fill uses object-fit
        // under the hood; these inline styles are the correct API in Next.js 13+.
        style={{ objectFit: "cover", objectPosition: "center 55%" }}
        sizes="100vw"
      />

      {/* ── 2. Gradient overlays — ensure text contrast on any viewport ── */}
      {/* Main overlay: strong at bottom, medium in center for brand text */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-noir-profond/90 via-noir-profond/60 to-noir-profond/40"
        aria-hidden="true"
      />
      {/* Top overlay: darkens nav area so header text is always readable */}
      <div
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-noir-profond/70 to-transparent"
        aria-hidden="true"
      />

      {/* ── 3. GoldenMist particle layer ─────────────────────────────────── */}
      <GoldenMist className="z-10" />

      {/* ── 4. Centered brand content ────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 animate-hero-fade-in"
        aria-hidden="false"
      >
        {/* Dragonfly logo mark — same SVG geometry as Navigation.tsx */}
        <svg
          viewBox="0 0 36 36"
          className="h-12 w-12 md:h-14 md:w-14 flex-shrink-0"
          fill="none"
          stroke="#C99700"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <circle cx="18" cy="18" r="14" opacity="0.5" />
          {/* Left wing */}
          <path d="M18 18 Q10 10 14 4 Q18 10 18 18" fill="#C99700" opacity="0.65" />
          {/* Right wing */}
          <path d="M18 18 Q26 10 22 4 Q18 10 18 18" fill="#C99700" opacity="0.45" />
          {/* Body */}
          <path d="M18 18 L18 28" strokeLinecap="round" opacity="0.5" />
        </svg>

        {/* Wordmark */}
        <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] text-or-luxe text-center leading-none">
          Libellule Senteurs
        </h1>

        {/* Tagline — &middot; is the interpunct separator (·) */}
        <p className="font-body text-xs md:text-sm tracking-[0.3em] uppercase text-blanc-casse/70 text-center">
          Parfums d&apos;intérieur haut de gamme &middot; Dakar
        </p>
      </div>

      {/* ── 5. Scroll indicator ───────────────────────────────────────────── */}
      {/*
       * Delayed entrance (0.8s) so it appears only after the brand content
       * has settled, drawing attention toward the scroll action naturally.
       * The pulse line uses a CSS transform-based animation to stay GPU-bound.
       */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 animate-hero-fade-in-delayed"
        aria-hidden="true"
      >
        <span className="font-body text-[10px] tracking-[0.35em] uppercase text-blanc-casse/50">
          Découvrir
        </span>
        {/* Pulse line — height-based so the animation is purely transform/opacity */}
        <div className="relative w-px h-10 bg-blanc-casse/20 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-full bg-or-luxe animate-pulse" />
        </div>
      </div>
    </section>
  );
}
