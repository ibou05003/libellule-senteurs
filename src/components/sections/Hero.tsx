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
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const productWrapRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Gate the entrance animation behind the loading screen delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), LOADING_SCREEN.heroRevealDelay);
    return () => clearTimeout(t);
  }, []);

  // Three-layer parallax: glow drifts slowest, product mid, text fastest + fades
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Product: slow upward drift keeps it in frame longer
      if (productWrapRef.current) {
        gsap.to(productWrapRef.current, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Text: faster drift + fade out so it clears before the next section
      if (textWrapRef.current) {
        gsap.to(textWrapRef.current, {
          y: -160,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "65% top",
            scrub: true,
          },
        });
      }

      // Glow: slowest drift + slight scale growth for depth
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          y: -30,
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} id="hero" className="relative bg-noir-profond" style={{ height: "185vh" }}>
      {/* Sticky viewport — content locks to screen while outer 185vh scrolls */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Ambient gold particles */}
        <GoldenMist />

        {/* Diffuse glow behind the product */}
        <div
          ref={glowRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]"
        >
          <div className="w-[300px] h-[480px] md:w-[420px] md:h-[640px] lg:w-[480px] lg:h-[720px] bg-or-luxe/[0.07] rounded-full blur-[120px]" />
        </div>

        {/* Product composition — CSS entrance (scale + fade), then GSAP parallax */}
        <div
          ref={productWrapRef}
          className="relative z-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1) translateY(0)" : "scale(1.06) translateY(24px)",
            transition: "opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            className="relative mx-auto"
            style={{ width: "min(55vw, 460px)", aspectRatio: "904/1200" }}
          >
            <Image
              src="/images/products/diffuseur-hero-portrait.webp"
              alt="Diffuseur Libellule Senteurs"
              fill
              className="object-contain"
              style={{ filter: "drop-shadow(0 40px 80px rgba(201,151,0,0.10))" }}
              priority
              sizes="(max-width: 768px) 55vw, 460px"
            />

            {/* Small brand mark centered on the bottle body */}
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                top: "57%",
                opacity: visible ? 0.6 : 0,
                transition: "opacity 1.2s ease-out 2.0s",
              }}
            >
              <svg
                viewBox="0 0 60 60"
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mx-auto"
                fill="none"
                stroke="#C99700"
                strokeWidth="0.8"
                aria-hidden="true"
              >
                <circle cx="30" cy="30" r="22" opacity="0.35" />
                <path d="M30 30 Q22 22 26 14 Q30 20 30 30" fill="#C99700" opacity="0.45" />
                <path d="M30 30 Q38 22 34 14 Q30 20 30 30" fill="#C99700" opacity="0.30" />
                <path d="M30 30 L30 42" strokeLinecap="round" opacity="0.35" />
              </svg>
            </div>

            {/* "SENTEURS" ghost text — atmospheric depth layer */}
            <div
              className="absolute top-[3%] left-1/2 -translate-x-1/2 pointer-events-none select-none"
              style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 1.0s ease-out 2.2s",
              }}
              aria-hidden="true"
            >
              <p className="font-heading text-blanc-casse/[0.04] text-5xl md:text-6xl lg:text-7xl tracking-[0.28em] whitespace-nowrap">
                SENTEURS
              </p>
            </div>
          </div>
        </div>

        {/* Headline — appears after product, scrolls out faster via GSAP */}
        <div
          ref={textWrapRef}
          className="relative z-10 text-center mt-10 md:mt-14 px-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1) 0.7s, transform 1.0s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
          }}
        >
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-blanc-casse leading-[1.25] tracking-wide">
            L&apos;essence du raffinement
            <br />
            <em className="text-or-luxe not-italic">invisible</em>
          </h1>
          <p className="font-body text-[9px] md:text-[10px] text-blanc-casse/30 tracking-[0.35em] uppercase mt-5 md:mt-7">
            Parfums d&apos;intérieur Haut de Gamme
          </p>
        </div>

        {/* Gradient fade at the bottom eases into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-noir-profond to-transparent z-[15] pointer-events-none" />

        {/* Scroll cue — animated line + label */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease-out 3.4s" }}
          aria-hidden="true"
        >
          <span className="font-body text-[8px] text-blanc-casse/20 tracking-[0.3em] uppercase">
            Découvrir
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-or-luxe/40 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
