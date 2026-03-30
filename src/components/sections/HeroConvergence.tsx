"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldenMist from "@/components/animations/GoldenMist";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function HeroConvergence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const fadeTopRef = useRef<HTMLDivElement>(null);
  const fadeBotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;

        // ── Phase 1 (0–0.2): Brand name + gold line on pure black ──
        if (brandRef.current) {
          const brandIn = Math.min(1, p / 0.12);
          const brandEase = brandIn * brandIn * (3 - 2 * brandIn);
          brandRef.current.style.opacity = String(brandEase);
          brandRef.current.style.transform = `translateY(${12 * (1 - brandEase)}px)`;

          // Brand fades/shifts up as image comes in
          if (p > 0.2) {
            const brandShift = Math.min(1, (p - 0.2) / 0.15);
            brandRef.current.style.transform = `translateY(${-60 * brandShift}px)`;
            brandRef.current.style.opacity = String(1 - brandShift * 0.7);
          }
        }

        if (lineRef.current) {
          const lineP = Math.max(0, Math.min(1, (p - 0.06) / 0.12));
          lineRef.current.style.transform = `scaleX(${lineP})`;
        }

        // ── Phase 2 (0.2–0.45): Collection image reveals ──
        // Image container clips open (vertical reveal)
        if (imageRef.current) {
          const revealStart = 0.18;
          const revealEnd = 0.42;
          const revealP = Math.max(0, Math.min(1, (p - revealStart) / (revealEnd - revealStart)));
          const revealEase = revealP * revealP * (3 - 2 * revealP);

          // Clip from center outward: starts as thin horizontal strip, expands to full
          const clipY = 50 - 50 * revealEase; // 50% → 0%
          imageRef.current.style.clipPath = `inset(${clipY}% 0% ${clipY}% 0%)`;
          imageRef.current.style.opacity = String(revealP > 0 ? 1 : 0);
        }

        // Subtle Ken Burns zoom on the image
        if (imageInnerRef.current) {
          const zoomP = Math.max(0, Math.min(1, (p - 0.18) / 0.6));
          const scale = 1.08 - 0.08 * zoomP;
          imageInnerRef.current.style.transform = `scale(${scale})`;
        }

        // ── Phase 3 (0.45–0.65): Caption fades in over image ──
        if (captionRef.current) {
          const capIn = Math.max(0, Math.min(1, (p - 0.45) / 0.12));
          const capEase = capIn * capIn * (3 - 2 * capIn);
          captionRef.current.style.opacity = String(capEase);
          captionRef.current.style.transform = `translateY(${20 * (1 - capEase)}px)`;

          // Caption fades out
          if (p > 0.72) {
            const capOut = Math.min(1, (p - 0.72) / 0.12);
            captionRef.current.style.opacity = String(1 - capOut);
          }
        }

        // ── Phase 4 (0.7–1.0): Image fades back to black ──
        if (fadeTopRef.current && fadeBotRef.current) {
          const fadeP = Math.max(0, Math.min(1, (p - 0.68) / 0.25));
          const fadeEase = fadeP * fadeP;
          // Top and bottom dark overlays close in
          fadeTopRef.current.style.opacity = String(fadeEase);
          fadeBotRef.current.style.opacity = String(fadeEase);
        }
      },
    });

    return () => st.kill();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-noir-profond px-4 md:px-8 text-center">
        <h1 className="font-heading text-4xl text-or-luxe">Libellule Senteurs</h1>
        <p className="mt-4 font-body text-lg text-blanc-casse/80">
          L&apos;essence du raffinement invisible
        </p>
      </section>
    );
  }

  return (
    <section ref={containerRef} style={{ height: "300vh" }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-noir-profond">

        {/* Golden particles — always visible behind everything */}
        <GoldenMist />

        {/* Collection image — revealed via clip-path */}
        <div
          ref={imageRef}
          className="absolute inset-0 z-[2]"
          style={{ clipPath: "inset(50% 0% 50% 0%)", opacity: 0 }}
        >
          <div ref={imageInnerRef} className="h-full w-full" style={{ transform: "scale(1.08)" }}>
            <Image
              src="/images/mockups/collection-complete-packagings.webp"
              alt="Collection Libellule Senteurs"
              fill
              style={{ objectFit: "cover", objectPosition: "center 55%" }}
              sizes="100vw"
              priority
            />
          </div>

          {/* Gradient overlays on image for text readability */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-noir-profond/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-noir-profond/70 to-transparent" />
        </div>

        {/* Fade-to-black overlays (Phase 4) */}
        <div
          ref={fadeTopRef}
          className="absolute inset-x-0 top-0 z-[3] h-1/2 bg-gradient-to-b from-noir-profond via-noir-profond/90 to-transparent"
          style={{ opacity: 0 }}
        />
        <div
          ref={fadeBotRef}
          className="absolute inset-x-0 bottom-0 z-[3] h-1/2 bg-gradient-to-t from-noir-profond via-noir-profond/90 to-transparent"
          style={{ opacity: 0 }}
        />

        {/* Brand name — centered, appears first on black */}
        <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center">
          <div ref={brandRef} className="text-center" style={{ opacity: 0 }}>
            <p className="font-heading text-xs md:text-sm lg:text-lg uppercase tracking-[0.5em] text-or-luxe">
              Libellule Senteurs
            </p>
            <div
              ref={lineRef}
              className="mx-auto my-4 h-px w-20 bg-or-luxe md:my-5 md:w-28"
              style={{ transform: "scaleX(0)", transformOrigin: "center" }}
            />
            <p className="font-body text-[9px] md:text-xs uppercase tracking-[0.3em] text-blanc-casse/40">
              Parfums d&apos;intérieur haut de gamme
            </p>
          </div>
        </div>

        {/* Caption — appears over the revealed image */}
        <div
          ref={captionRef}
          className="absolute inset-x-0 bottom-[12%] z-[5] text-center"
          style={{ opacity: 0 }}
        >
          <h1 className="font-heading text-2xl md:text-4xl lg:text-6xl leading-tight text-blanc-casse">
            L&apos;essence du raffinement
            <br />
            invisible
          </h1>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 z-[5] -translate-x-1/2">
          <div className="h-10 w-px animate-pulse bg-gradient-to-b from-transparent via-or-luxe/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
