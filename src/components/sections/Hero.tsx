"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldenMist from "@/components/animations/GoldenMist";
import TextReveal from "@/components/animations/TextReveal";
import { LOADING_SCREEN } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), LOADING_SCREEN.heroRevealDelay);
    return () => clearTimeout(timer);
  }, []);

  // Parallax: product moves slower, text moves faster, glow drifts
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Product image moves up slowly (parallax lag)
      if (productRef.current) {
        gsap.to(productRef.current, {
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

      // Text moves up faster (parallax lead)
      if (textRef.current) {
        gsap.to(textRef.current, {
          y: -150,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Glow drifts slightly
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          y: -40,
          scale: 1.1,
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
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden bg-noir-profond"
    >
      {/* Ambient particle canvas */}
      <GoldenMist />

      {/* Glow behind product */}
      <div
        ref={glowRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]"
      >
        <div className="w-[500px] h-[500px] md:w-[700px] md:h-[500px] bg-or-luxe/[0.07] rounded-full blur-[100px]" />
      </div>

      {/* Central product — detoured (transparent bg), floats on particles */}
      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-10">
        <div
          ref={productRef}
          className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px]"
        >
          <Image
            src="/images/products/diffuseur-hero-detour.webp"
            alt="Diffuseur Libellule Senteurs"
            fill
            className="object-contain drop-shadow-[0_0_60px_rgba(201,151,0,0.15)]"
            priority
          />
        </div>

        {/* Staggered text reveal */}
        <div ref={textRef} className="text-center space-y-3">
          <TextReveal
            text="L'essence du raffinement invisible"
            className="font-heading text-2xl md:text-4xl lg:text-5xl text-blanc-casse"
            splitBy="words"
            stagger={0.08}
            delay={0.5}
            trigger={visible}
          />
          <TextReveal
            text="Libellule Senteurs"
            className="font-heading text-lg md:text-xl text-or-luxe tracking-widest"
            splitBy="chars"
            stagger={0.04}
            delay={1.5}
            trigger={visible}
          />
          <p
            className="font-body text-xs md:text-sm text-blanc-casse/30 tracking-[0.25em] uppercase pt-2"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 1s ease-out 2.5s",
            }}
          >
            Parfums d&apos;intérieur Haut de Gamme — Dakar
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-noir-profond to-transparent z-10 pointer-events-none" />

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="text-blanc-casse/40 text-xs font-body tracking-widest uppercase">
          Découvrir
        </span>
        <div className="w-px h-8 bg-or-luxe/40 animate-pulse" />
      </div>
    </section>
  );
}
