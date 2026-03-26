"use client";

import { useState, useEffect, useRef } from "react";
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
  const productRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const sticksTextRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), LOADING_SCREEN.heroRevealDelay);
    return () => clearTimeout(timer);
  }, []);

  // Professional multi-layer parallax
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Layer 1: Product moves up slowly — the anchor
      if (productRef.current) {
        gsap.to(productRef.current, {
          y: -60,
          scale: 0.95,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Layer 2: Logo on bottle — barely moves (feels painted on)
      if (logoRef.current) {
        gsap.to(logoRef.current, {
          y: -55,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Layer 3: Text between sticks — moves faster (closer to viewer)
      if (sticksTextRef.current) {
        gsap.to(sticksTextRef.current, {
          y: -120,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Layer 4: Headline — fastest (foreground)
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          y: -180,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "80% top",
            scrub: true,
          },
        });
      }

      // Layer 5: Tagline
      if (taglineRef.current) {
        gsap.to(taglineRef.current, {
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

      // Layer 6: Glow — drifts and expands
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          y: -30,
          scale: 1.3,
          opacity: 0.5,
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
      {/* Layer 0: Ambient particle canvas */}
      <GoldenMist />

      {/* Layer 1: Glow behind product */}
      <div
        ref={glowRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]"
      >
        <div className="w-[400px] h-[600px] md:w-[500px] md:h-[700px] bg-or-luxe/[0.06] rounded-full blur-[120px]" />
      </div>

      {/* Product composition — all layers positioned relative to this container */}
      <div className="relative z-10 flex flex-col items-center">

        {/* The product container — takes up most of the viewport */}
        <div className="relative">
          {/* Product image — LARGE */}
          <div
            ref={productRef}
            className="relative w-[55vw] max-w-[400px] md:w-[40vw] md:max-w-[480px] lg:max-w-[520px] aspect-[904/1200]"
          >
            <Image
              src="/images/products/diffuseur-hero-portrait.webp"
              alt="Diffuseur Libellule Senteurs"
              fill
              className="object-contain drop-shadow-[0_20px_60px_rgba(201,151,0,0.12)]"
              priority
            />
          </div>

          {/* Logo overlay on the bottle body */}
          <div
            ref={logoRef}
            className="absolute pointer-events-none"
            style={{
              top: "58%",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: visible ? 1 : 0,
              transition: "opacity 1.5s ease-out 2s",
            }}
          >
            <svg
              viewBox="0 0 80 80"
              className="w-12 h-12 md:w-16 md:h-16"
              fill="none"
              stroke="#C99700"
              strokeWidth="1"
            >
              <circle cx="40" cy="40" r="30" opacity="0.6" />
              <path d="M40 40 Q28 28 34 16 Q40 24 40 40" fill="#C99700" opacity="0.7" />
              <path d="M40 40 Q52 28 46 16 Q40 24 40 40" fill="#C99700" opacity="0.5" />
              <path d="M40 40 L40 58" strokeLinecap="round" opacity="0.6" />
            </svg>
            <p
              className="font-heading text-[8px] md:text-[10px] text-or-luxe/70 tracking-[0.15em] text-center mt-0.5 whitespace-nowrap"
            >
              Libellule Senteurs
            </p>
          </div>

          {/* Text floating between the sticks */}
          <div
            ref={sticksTextRef}
            className="absolute pointer-events-none text-center"
            style={{
              top: "8%",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: visible ? 1 : 0,
              transition: "opacity 1.2s ease-out 1.8s",
            }}
          >
            <p className="font-heading text-blanc-casse/[0.12] text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] whitespace-nowrap select-none">
              SENTEURS
            </p>
          </div>
        </div>

        {/* Headline below the product */}
        <div ref={headlineRef} className="text-center mt-6 md:mt-8 space-y-3">
          <h1
            className="font-heading text-2xl md:text-4xl lg:text-5xl text-blanc-casse"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s",
            }}
          >
            L&apos;essence du raffinement invisible
          </h1>
          <p
            className="font-heading text-lg md:text-xl text-or-luxe tracking-[0.2em]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(15px)",
              transition: "opacity 0.8s ease-out 1.2s, transform 0.8s ease-out 1.2s",
            }}
          >
            Libellule Senteurs
          </p>
        </div>

        {/* Tagline */}
        <div ref={taglineRef}>
          <p
            className="font-body text-[10px] md:text-xs text-blanc-casse/25 tracking-[0.3em] uppercase mt-4"
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
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-noir-profond via-noir-profond/50 to-transparent z-10 pointer-events-none" />

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="text-blanc-casse/30 text-[10px] font-body tracking-[0.3em] uppercase">
          Découvrir
        </span>
        <div className="w-px h-6 bg-or-luxe/30 animate-pulse" />
      </div>
    </section>
  );
}
