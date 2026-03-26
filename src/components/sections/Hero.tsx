"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldenMist from "@/components/animations/GoldenMist";
import { LOADING_SCREEN } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const sticksTextRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Loading screen gate
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), LOADING_SCREEN.heroRevealDelay);
    return () => clearTimeout(timer);
  }, []);

  // Scroll-driven reveal + parallax
  useEffect(() => {
    if (reduced || !loaded) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // ═══════════════════════════════════════════════════════
      // PHASE 1: SCROLL REVEAL (0% → 40% of section scroll)
      // Product rises from below and scales from 1.6x to 1x
      // ═══════════════════════════════════════════════════════
      if (productRef.current) {
        // Start state: scaled up, pushed down, slightly transparent
        gsap.set(productRef.current, {
          scale: 1.6,
          y: 200,
          opacity: 0.3,
        });

        // Reveal animation
        gsap.to(productRef.current, {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "40% top",
            scrub: 0.8,
          },
        });

        // After reveal: subtle parallax drift
        gsap.to(productRef.current, {
          y: -80,
          scale: 0.96,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "40% top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // ═══════════════════════════════════════════════════════
      // PHASE 2: ELEMENTS APPEAR (staggered after product reveal)
      // ═══════════════════════════════════════════════════════

      // Logo on bottle — fades in after product is revealed
      if (logoRef.current) {
        gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });
        gsap.to(logoRef.current, {
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "30% top",
            end: "45% top",
            scrub: 0.5,
          },
        });
        // Parallax: logo follows product
        gsap.to(logoRef.current, {
          y: -75,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "40% top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // "SENTEURS" ghost text between sticks
      if (sticksTextRef.current) {
        gsap.set(sticksTextRef.current, { opacity: 0, y: 30 });
        gsap.to(sticksTextRef.current, {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "25% top",
            end: "40% top",
            scrub: 0.5,
          },
        });
        // Parallax: moves faster than product
        gsap.to(sticksTextRef.current, {
          y: -160,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "40% top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Headline
      if (headlineRef.current) {
        gsap.set(headlineRef.current, { opacity: 0, y: 40 });
        gsap.to(headlineRef.current, {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "35% top",
            end: "50% top",
            scrub: 0.5,
          },
        });
        // Parallax: fades and rises out
        gsap.to(headlineRef.current, {
          y: -200,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "55% top",
            end: "85% top",
            scrub: true,
          },
        });
      }

      // Subtitle
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { opacity: 0, y: 30 });
        gsap.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "40% top",
            end: "55% top",
            scrub: 0.5,
          },
        });
        gsap.to(subtitleRef.current, {
          y: -220,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "55% top",
            end: "80% top",
            scrub: true,
          },
        });
      }

      // Glow — grows and drifts
      if (glowRef.current) {
        gsap.set(glowRef.current, { scale: 0.5, opacity: 0 });
        gsap.to(glowRef.current, {
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: section,
            start: "10% top",
            end: "40% top",
            scrub: 0.5,
          },
        });
        gsap.to(glowRef.current, {
          y: -50,
          scale: 1.4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "40% top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [reduced, loaded]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative bg-noir-profond overflow-hidden"
      style={{ height: "200vh" }}
    >
      {/* Sticky viewport — stays on screen while user scrolls through 200vh */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

        {/* Layer 0: Ambient particles */}
        <GoldenMist />

        {/* Layer 1: Glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]"
        >
          <div className="w-[350px] h-[550px] md:w-[450px] md:h-[700px] bg-or-luxe/[0.07] rounded-full blur-[120px]" />
        </div>

        {/* Layer 2: Product composition */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            {/* The diffuser — VERY LARGE */}
            <div
              ref={productRef}
              className="relative w-[65vw] max-w-[450px] md:w-[45vw] md:max-w-[550px] lg:max-w-[600px] aspect-[904/1200]"
            >
              <Image
                src="/images/products/diffuseur-hero-portrait.webp"
                alt="Diffuseur Libellule Senteurs"
                fill
                className="object-contain drop-shadow-[0_25px_80px_rgba(201,151,0,0.1)]"
                priority
                sizes="(max-width: 768px) 65vw, 550px"
              />
            </div>

            {/* Logo on the bottle body */}
            <div
              ref={logoRef}
              className="absolute pointer-events-none"
              style={{
                top: "56%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <svg
                viewBox="0 0 80 80"
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto"
                fill="none"
                stroke="#C99700"
                strokeWidth="0.8"
              >
                <circle cx="40" cy="40" r="28" opacity="0.5" />
                <path d="M40 40 Q28 28 34 16 Q40 24 40 40" fill="#C99700" opacity="0.6" />
                <path d="M40 40 Q52 28 46 16 Q40 24 40 40" fill="#C99700" opacity="0.4" />
                <path d="M40 40 L40 56" strokeLinecap="round" opacity="0.5" />
              </svg>
              <p className="font-heading text-[7px] md:text-[9px] lg:text-[10px] text-or-luxe/60 tracking-[0.12em] text-center mt-px whitespace-nowrap">
                Libellule Senteurs
              </p>
            </div>

            {/* Ghost text floating between sticks */}
            <div
              ref={sticksTextRef}
              className="absolute pointer-events-none text-center w-full"
              style={{ top: "5%", left: 0 }}
            >
              <p className="font-heading text-blanc-casse/[0.08] text-5xl md:text-6xl lg:text-7xl tracking-[0.2em] whitespace-nowrap select-none">
                SENTEURS
              </p>
            </div>
          </div>

          {/* Headline */}
          <div ref={headlineRef} className="text-center mt-6 md:mt-10">
            <h1 className="font-heading text-xl md:text-3xl lg:text-5xl text-blanc-casse leading-tight">
              L&apos;essence du raffinement
              <br />
              <span className="text-or-luxe">invisible</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div ref={subtitleRef} className="text-center mt-3 md:mt-5">
            <p className="font-body text-[10px] md:text-xs text-blanc-casse/25 tracking-[0.3em] uppercase">
              Parfums d&apos;intérieur Haut de Gamme — Dakar
            </p>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-noir-profond via-noir-profond/60 to-transparent z-[15] pointer-events-none" />

        {/* Scroll cue — only visible at the very start */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease-out 3s" }}
        >
          <span className="text-blanc-casse/25 text-[10px] font-body tracking-[0.3em] uppercase">
            Scroll
          </span>
          <div className="w-px h-6 bg-or-luxe/25 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
