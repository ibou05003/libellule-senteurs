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
          y: -100,
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
          y: -200,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "70% top",
            scrub: true,
          },
        });
      }

      // Glow: slowest drift + slight scale growth for depth
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          y: -40,
          scale: 1.3,
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
    <section ref={sectionRef} id="hero" className="relative bg-noir-profond" style={{ height: "180vh" }}>
      {/* Sticky viewport — content locks to screen while outer 180vh scrolls */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Ambient gold particles */}
        <GoldenMist />

        {/* Diffuse glow behind the product */}
        <div
          ref={glowRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]"
        >
          <div className="w-[350px] h-[500px] md:w-[400px] md:h-[650px] bg-or-luxe/[0.06] rounded-full blur-[100px]" />
        </div>

        {/* Product composition — CSS entrance (scale + fade), then GSAP parallax */}
        <div
          ref={productWrapRef}
          className="relative z-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1) translateY(0)" : "scale(1.08) translateY(30px)",
            transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
          }}
        >
          <div
            className="relative mx-auto"
            style={{ width: "min(50vw, 420px)", aspectRatio: "904/1200" }}
          >
            <Image
              src="/images/products/diffuseur-hero-portrait.webp"
              alt="Diffuseur Libellule Senteurs"
              fill
              className="object-contain"
              style={{ filter: "drop-shadow(0 30px 60px rgba(201,151,0,0.08))" }}
              priority
              sizes="(max-width: 768px) 50vw, 420px"
            />

            {/* Small brand mark centered on the bottle body */}
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                top: "57%",
                opacity: visible ? 0.7 : 0,
                transition: "opacity 1.5s ease-out 1.8s",
              }}
            >
              <svg
                viewBox="0 0 60 60"
                className="w-8 h-8 md:w-11 md:h-11 lg:w-12 lg:h-12 mx-auto"
                fill="none"
                stroke="#C99700"
                strokeWidth="0.7"
              >
                <circle cx="30" cy="30" r="22" opacity="0.4" />
                <path d="M30 30 Q22 22 26 14 Q30 20 30 30" fill="#C99700" opacity="0.5" />
                <path d="M30 30 Q38 22 34 14 Q30 20 30 30" fill="#C99700" opacity="0.35" />
                <path d="M30 30 L30 42" strokeLinecap="round" opacity="0.4" />
              </svg>
              <p className="font-heading text-[6px] md:text-[8px] text-or-luxe/50 tracking-[0.1em] text-center whitespace-nowrap">
                Libellule Senteurs
              </p>
            </div>

            {/* "SENTEURS" ghost text visible between the diffuser sticks */}
            <div
              className="absolute top-[4%] left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 1s ease-out 2s",
              }}
            >
              <p className="font-heading text-blanc-casse/[0.06] text-4xl md:text-5xl lg:text-6xl tracking-[0.25em] whitespace-nowrap select-none">
                SENTEURS
              </p>
            </div>
          </div>
        </div>

        {/* Headline — appears after product, scrolls out faster via GSAP */}
        <div
          ref={textWrapRef}
          className="relative z-10 text-center mt-8 md:mt-12 px-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(25px)",
            transition: "opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s",
          }}
        >
          <h1 className="font-heading text-xl sm:text-2xl md:text-4xl lg:text-5xl text-blanc-casse leading-[1.3]">
            L&apos;essence du raffinement
            <span className="text-or-luxe"> invisible</span>
          </h1>
          <p className="font-body text-[10px] md:text-xs text-blanc-casse/20 tracking-[0.3em] uppercase mt-4 md:mt-6">
            Parfums d&apos;intérieur Haut de Gamme
          </p>
        </div>

        {/* Gradient fade at the bottom eases into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-noir-profond to-transparent z-[15] pointer-events-none" />

        {/* Scroll cue — subtle animated line, appears last */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease-out 3s" }}
        >
          <div className="w-px h-8 bg-or-luxe/20 animate-pulse mx-auto" />
        </div>
      </div>
    </section>
  );
}
