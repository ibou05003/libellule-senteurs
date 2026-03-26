"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GoldenMist from "@/components/animations/GoldenMist";
import TextReveal from "@/components/animations/TextReveal";
import { LOADING_SCREEN } from "@/lib/constants";

/**
 * Full-screen hero section.
 *
 * Layout: dark background, central product image, headline + brand name reveal,
 * and the ambient GoldenMist particle canvas layered behind everything.
 *
 * The text reveal is gated behind a 3.2 s delay to let the loading screen
 * finish its own animation before the hero typography appears. The 3.2 s value
 * should be kept in sync with the LoadingScreen animation duration.
 */
export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay hero content appearance until the loading screen has fully faded out.
    // Using LOADING_SCREEN.heroRevealDelay ensures this value stays in sync with
    // the loading screen animation timing defined in src/lib/constants.ts.
    const timer = setTimeout(() => setVisible(true), LOADING_SCREEN.heroRevealDelay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden bg-noir-profond"
    >
      {/* Ambient particle canvas — sits at z-0, behind all content */}
      <GoldenMist />

      {/* Central product image + text block */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/*
         * Container sized to the image's native 16:9 ratio.
         * `90vw` width keeps the image fluid on narrow viewports while
         * `max-w-[700px]` prevents it from dominating large screens.
         * Using `object-contain` preserves the full landscape composition
         * (diffuser + golden mist) instead of cropping it into a square.
         */}
        <div className="relative w-[90vw] max-w-[700px] aspect-[16/9]">
          <Image
            src="/images/products/diffuseur-hero-fond-noir.webp"
            alt="Diffuseur Libellule Senteurs"
            fill
            className="object-contain"
            // LCP image — load immediately, no lazy loading
            priority
          />
        </div>

        {/* Staggered text reveal sequenced after the loading screen */}
        <div className="text-center space-y-4">
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
        </div>
      </div>

      {/* Subtle scroll cue — pulsing vertical line with label */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-blanc-casse/40 text-xs font-body tracking-widest uppercase">
          Découvrir
        </span>
        <div className="w-px h-8 bg-or-luxe/40 animate-pulse" />
      </div>
    </section>
  );
}
