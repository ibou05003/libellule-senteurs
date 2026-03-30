"use client";

import { useCallback, useRef } from "react";
import ScrollCanvas from "@/components/animations/ScrollCanvas";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";

export default function AmbianceVideo() {
  const reducedMotion = useReducedMotion();
  const textRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  const framePath = useCallback(
    (i: number) => `/frames/ambiance/frame_${String(i).padStart(4, "0")}.webp`,
    []
  );

  const handleProgress = useCallback((p: number) => {
    // Tagline fades in around 30% scroll, holds, then fades out before 70%
    // Adjusted thresholds for the shorter 200vh scroll distance
    if (textRef.current) {
      let opacity = 0;
      if (p > 0.3 && p < 0.7) {
        opacity = Math.min(1, (p - 0.3) / 0.15);
      } else if (p >= 0.7) {
        opacity = Math.max(0, 1 - (p - 0.7) / 0.15);
      }
      textRef.current.style.opacity = String(opacity);
      textRef.current.style.transform = `translateY(${10 * (1 - opacity)}px)`;
    }

    // Vignette builds up over the first 40% of scroll
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
          alt="Diffuseur dans un intérieur luxueux"
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-noir-profond/40">
          <p className="max-w-3xl px-4 text-center font-heading text-2xl leading-snug text-or-luxe md:text-4xl">
            Chaque espace a une âme — nous lui donnons une voix
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
        {/* Cinematic vignette — opacity ramps up as user scrolls in */}
        <div
          ref={vignetteRef}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.3,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Tagline — absorbed from the old standalone Tagline section */}
        <div
          ref={textRef}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4"
          style={{ opacity: 0 }}
        >
          {/*
           * Font scale: text-xl on mobile (375px) prevents overflow on narrow
           * viewports. text-5xl on md and text-6xl on lg keeps the statement
           * impactful without exceeding legible line lengths.
           * text-7xl was removed — at 72px it causes overflow on 1024px laptops
           * where the two lines together exceed the max-w-3xl container width.
           */}
          <p className="max-w-3xl text-center font-heading text-xl leading-snug text-or-luxe md:text-5xl lg:text-6xl">
            Chaque espace a une âme
            <br />
            <span className="text-blanc-casse">— nous lui donnons une voix</span>
          </p>
        </div>

        {/* Bottom gradient: dark → blanc-casse, bridges to the next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent to-blanc-casse" />
      </ScrollCanvas>
    </div>
  );
}
