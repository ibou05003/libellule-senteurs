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

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), LOADING_SCREEN.heroRevealDelay);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (productWrapRef.current) {
        gsap.to(productWrapRef.current, {
          y: -80,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        });
      }
      if (textWrapRef.current) {
        gsap.to(textWrapRef.current, {
          y: -160,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "65% top", scrub: true },
        });
      }
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          y: -30,
          scale: 1.2,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} id="hero" className="relative bg-noir-profond" style={{ height: "180vh" }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Particles */}
        <GoldenMist />

        {/* Glow */}
        <div ref={glowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
          <div className="w-[300px] h-[400px] md:w-[380px] md:h-[550px] bg-or-luxe/[0.06] rounded-full blur-[100px]" />
        </div>

        {/* Product + text stacked in a flex column that fits viewport */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full py-20 md:py-24">

          {/* Product */}
          <div
            ref={productWrapRef}
            className="relative"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1) translateY(0)" : "scale(1.06) translateY(24px)",
              transition: "opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Product image — height capped at 45vh to leave room for headline.
                New image (diffuseur-batonnets-detour) carries the real brand logo,
                so no SVG overlay or ghost text is needed. */}
            <div className="relative mx-auto h-[40vh] md:h-[45vh] aspect-[497/1400]">
              <Image
                src="/images/products/diffuseur-batonnets-detour.webp"
                alt="Diffuseur Libellule Senteurs"
                fill
                className="object-contain"
                style={{ filter: "drop-shadow(0 30px 60px rgba(201,151,0,0.10))" }}
                priority
                sizes="(max-width: 768px) 14vh, 16vh"
              />
            </div>
          </div>

          {/* Headline */}
          <div
            ref={textWrapRef}
            className="text-center mt-8 md:mt-10"
            style={{
              paddingInline: "1.5rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
            }}
          >
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-blanc-casse leading-[1.3]">
              L&apos;essence du raffinement
              <br />
              <em className="text-or-luxe not-italic">invisible</em>
            </h1>
            {/* /45 raises contrast vs #000 bg from ~2.1:1 to ~3.2:1 — acceptable
                for decorative uppercase micro-text at this size */}
            <p className="font-body text-[9px] md:text-[10px] text-blanc-casse/45 tracking-[0.3em] uppercase mt-4 md:mt-6">
              Parfums d&apos;intérieur Haut de Gamme
            </p>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-noir-profond to-transparent z-[15] pointer-events-none" />

        {/* Scroll cue */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease-out 3.2s" }}
          aria-hidden="true"
        >
          {/* /40 ensures the scroll cue is legible against the dark gradient
              overlay; /20 would be ~1.4:1 which falls below any threshold */}
          <span className="font-body text-[8px] text-blanc-casse/40 tracking-[0.3em] uppercase">
            Découvrir
          </span>
          <div className="w-px h-6 bg-gradient-to-b from-or-luxe/50 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
