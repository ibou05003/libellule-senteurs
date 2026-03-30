"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Register ScrollTrigger once at module level to avoid duplicate registration
// across HMR reloads in development.
gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Experience carousel data
// Each entry maps to a real image file under /images/experience/ (public dir).
// Labels are short — they appear as overlaid captions, not full descriptions.
// ---------------------------------------------------------------------------
const CAROUSEL_ITEMS = [
  { src: "/images/experience/hotel.webp", label: "Hôtellerie" },
  { src: "/images/experience/spa-01.webp", label: "Spa" },
  { src: "/images/experience/boutique-01.webp", label: "Boutique" },
  { src: "/images/experience/salon-luxe-01.webp", label: "Résidences" },
  { src: "/images/experience/spa-02.webp", label: "Bien-être" },
  { src: "/images/experience/boutique-02.webp", label: "Retail" },
  { src: "/images/experience/salon-luxe-02.webp", label: "Intérieur" },
  { src: "/images/experience/boutique-03.webp", label: "Concept Store" },
];

// ---------------------------------------------------------------------------
// Brand values — presented as plain text, NO animated counters.
// The middot separator is rendered only on md+ via CSS (hidden on mobile).
// ---------------------------------------------------------------------------
const VALUES = ["5 Créations", "100% Naturel", "Fait Main", "Dakar, Sénégal"];

export default function Univers() {
  const sectionRef = useRef<HTMLElement>(null);
  // Ref for the story block whose direct children are animated with stagger
  const storyContentRef = useRef<HTMLDivElement>(null);
  // Ref for the carousel container — receives a single fade-in entrance
  const carouselRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Respect the user's OS-level motion preference — skip all GSAP work.
    if (reducedMotion) return;

    const storyContent = storyContentRef.current;
    const carousel = carouselRef.current;
    if (!storyContent || !carousel) return;

    // -----------------------------------------------------------------------
    // Sub-part A: staggered fade-in for each direct child of the story block.
    // toggleActions "play none none none" means: animate once when entering
    // viewport, do not reverse on scroll back. This keeps the text visible
    // after the user has read it and scrolls further down or back up.
    // -----------------------------------------------------------------------
    const storyTl = gsap.timeline({
      scrollTrigger: {
        trigger: storyContent,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    Array.from(storyContent.children).forEach((child, i) => {
      storyTl.fromTo(
        child,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        // Stagger offset — each child enters 0.15 s after the previous one
        i * 0.15
      );
    });

    // -----------------------------------------------------------------------
    // Sub-part B: simple fade-in of the entire carousel container.
    // Individual card animations would fight with the horizontal scroll UX,
    // so a single unified entrance keeps the experience clean.
    // -----------------------------------------------------------------------
    gsap.fromTo(
      carousel,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: "power1.out",
        scrollTrigger: {
          trigger: carousel,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      // Clean up all ScrollTrigger instances created inside this effect to
      // avoid ghost triggers after fast-refresh or component unmount.
      storyTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        // Only kill triggers whose trigger element is inside this section
        if (sectionRef.current?.contains(st.trigger as Element)) {
          st.kill();
        }
      });
    };
  }, [reducedMotion]);

  return (
    <section
      id="univers"
      ref={sectionRef}
      className="bg-noir-profond"
    >
      {/* ===================================================================
          Sub-part A — Notre Histoire
          Compact text block, centered, NOT full-screen.
          Padding follows the spec: pt-24 pb-16 on mobile, pt-32 pb-20 on md+.
      =================================================================== */}
      <div className="px-4 pt-24 pb-16 md:px-8 md:pt-32 md:pb-20">
        <div
          ref={storyContentRef}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Label — initial opacity 0 so GSAP can animate it in.
              For reduced-motion users the inline style is omitted so the
              element remains visible via its natural CSS opacity. */}
          <p
            className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe"
            style={{ opacity: reducedMotion ? undefined : 0 }}
          >
            Notre Histoire
          </p>

          {/* Gold separator */}
          <div
            className="mx-auto my-5 h-px w-16 bg-or-luxe/60"
            style={{ opacity: reducedMotion ? undefined : 0 }}
          />

          {/* Section headline */}
          <h2
            className="font-heading text-2xl leading-tight text-blanc-casse md:text-4xl lg:text-5xl"
            style={{ opacity: reducedMotion ? undefined : 0 }}
          >
            Née à Dakar, inspirée par le monde
          </h2>

          {/* Single paragraph — merges the two paragraphs from the old
              NotreHistoire component into the spec-mandated one-paragraph form. */}
          <p
            className="mt-8 font-body text-base leading-[1.8] text-blanc-casse/70 md:text-lg"
            style={{ opacity: reducedMotion ? undefined : 0 }}
          >
            Libellule Senteurs crée des parfums d&apos;intérieur qui marient
            les essences d&apos;Afrique de l&apos;Ouest aux traditions de la
            haute parfumerie. Chaque création est fabriquée à la main, avec
            des ingrédients naturels soigneusement sélectionnés — parce que le
            luxe réside dans ce qu&apos;on ne voit pas, mais qu&apos;on ressent.
          </p>
        </div>
      </div>

      {/* ===================================================================
          Sub-part B — Experience Carousel
          Native horizontal scroll with snap — no JS needed for the scroll
          behaviour itself. GSAP only handles the entrance fade-in.

          scrollbar-hide is defined in globals.css to hide the scrollbar
          across browsers while keeping the swipe/drag gesture intact.
          scroll-snap-type is applied via an inline style because Tailwind's
          JIT purge can be unreliable with arbitrary snap values.
      =================================================================== */}
      <div
        ref={carouselRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-16 md:gap-6 md:px-8 md:pb-20"
        style={{
          scrollSnapType: "x mandatory",
          // Initial opacity driven to 0 so GSAP can animate it in.
          // For reduced-motion users we leave it at the default (1).
          opacity: reducedMotion ? undefined : 0,
        }}
        // Accessible label for screen readers that announce the list purpose
        aria-label="Galerie d'espaces d'expérience Libellule Senteurs"
      >
        {CAROUSEL_ITEMS.map(({ src, label }) => (
          <div
            key={src}
            className="relative flex-shrink-0 overflow-hidden"
            style={{
              width: "clamp(260px, 35vw, 400px)",
              aspectRatio: "3 / 2",
              scrollSnapAlign: "start",
            }}
          >
            {/* next/image with fill requires a positioned parent — the
                relative + overflow-hidden above provides that container. */}
            <Image
              src={src}
              alt={label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 70vw, 35vw"
            />

            {/* Bottom gradient overlay — fades from noir-profond at the
                bottom to transparent at the top, ensuring the label is
                always legible regardless of image brightness. */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-noir-profond/70 to-transparent" />

            {/* Card label */}
            <span className="absolute bottom-3 left-4 font-body text-xs uppercase tracking-[0.15em] text-blanc-casse/80">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ===================================================================
          Sub-part C — Values strip
          Four brand pillars as plain text, separated by middots on md+.
          No animation — these are purely decorative anchors at the bottom
          of the section.
      =================================================================== */}
      <div className="border-t border-blanc-casse/10 px-4 py-12 md:py-16">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12">
          {VALUES.map((value, index) => (
            <span key={value} className="flex items-center gap-x-8 md:gap-x-12">
              <span className="font-heading text-sm tracking-[0.15em] text-or-luxe md:text-base">
                {value}
              </span>
              {/* Middot separator — hidden on mobile, shown between items
                  (but not after the last one) on md+ screens. */}
              {index < VALUES.length - 1 && (
                <span
                  className="hidden text-or-luxe/30 md:inline"
                  aria-hidden="true"
                >
                  &middot;
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
