"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

type ScrollFramePlayerProps = {
  className?: string;
};

/**
 * Scroll-driven product morph animation.
 *
 * Architecture
 * ───────────────────────────────────────────────────────────────────────────
 * Designed to eventually drive a full image-sequence morph (90 pre-rendered
 * PNG frames stored at /public/frames/). While those frames are not available
 * it falls back to a CSS cross-fade between the unbranded candle and the
 * finished collection, giving a representative preview of the final effect.
 *
 * Scroll behaviour
 * ───────────────────────────────────────────────────────────────────────────
 * The outer container is 180vh tall. The inner viewport-height div is
 * `position: sticky` so it stays on screen while the outer scrolls.
 * GSAP maps that distance to a `progressRef` value of 0 → 1, which drives:
 *   - Background: off-white (#F8F8F8) → true black (#000)
 *   - Image cross-fade: unbranded → branded collection
 *   - Gold radial glow: fades in after 40% progress
 *   - Phase copy: teaser fades out; brand reveal fades in
 *
 * Reduced motion
 * ───────────────────────────────────────────────────────────────────────────
 * Renders only the final branded image on a dark background — no animation.
 */
export default function ScrollFramePlayer({ className }: ScrollFramePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Mutated directly by GSAP to avoid stale closure issues with setState
  const progressRef = useRef({ value: 0 });
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    // `scrub: 0.5` adds a subtle lag that makes the transition feel physical
    const tween = gsap.to(progressRef.current, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
      onUpdate: () => {
        setProgress(progressRef.current.value);
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [reduced]);

  // Background interpolates from blanc-cassé (#F8F8F8 = 248,248,248) → noir (#000)
  const channel = Math.round(248 - 248 * progress);
  const bgColor = `rgb(${channel}, ${channel}, ${channel})`;

  // Gold glow only appears after 40% to avoid clashing with the light background
  const glowOpacity = progress > 0.4 ? (progress - 0.4) / 0.6 : 0;

  // Shared container dimensions for both morph layers — ensures a clean overlap
  const imageContainer = "relative mx-auto w-[80vw] max-w-[600px] aspect-[3/2]";

  if (reduced) {
    return (
      <div className={`relative min-h-screen flex items-center justify-center bg-noir-profond ${className ?? ""}`}>
        <div className={imageContainer}>
          <Image
            src="/images/mockups/collection-complete-packagings.webp"
            alt="Collection complète Libellule Senteurs"
            fill
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`} style={{ height: "180vh" }}>
      {/*
       * Sticky viewport: locks to screen while outer scrolls through 180vh.
       * All layers are absolute so they overlap, never stack vertically.
       */}
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden transition-none"
        style={{ backgroundColor: bgColor }}
      >
        {/* Layer 1: Unbranded candle — fades out as progress increases */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 1 - progress }}
        >
          <div className={imageContainer}>
            <Image
              src="/images/products/bougie-sans-marque.webp"
              alt=""
              fill
              className="object-contain"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Layer 2: Branded collection reveal — fades in as progress increases */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: progress }}
        >
          <div className={imageContainer}>
            <Image
              src="/images/mockups/collection-complete-packagings.webp"
              alt="Collection complète Libellule Senteurs"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Layer 3: Gold radial glow — amplifies luxury in the second half */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, rgba(201,151,0,${glowOpacity * 0.15}) 0%, transparent 60%)`,
          }}
        />

        {/* Layer 4: Phase copy */}
        <div className="absolute inset-0 flex items-end justify-center pb-24 md:pb-28 pointer-events-none">
          {/* Teaser — visible in the first 30% of scroll, then fades out.
              Text shadow ensures legibility against the off-white background */}
          {progress < 0.3 && (
            <p
              className="max-w-lg mx-auto text-center font-heading text-xl md:text-3xl px-8 leading-[1.4]"
              style={{
                opacity: 1 - progress / 0.3,
                color: `rgb(${Math.round(channel * 0.1)}, ${Math.round(channel * 0.1)}, ${Math.round(channel * 0.1)})`,
                textShadow: progress < 0.15 ? "0 2px 20px rgba(0,0,0,0.12)" : "none",
              }}
            >
              Un simple objet blanc. Sans nom. Sans histoire.
            </p>
          )}

          {/* Brand reveal — visible after 70% scroll */}
          {progress > 0.7 && (
            <div
              className="max-w-lg mx-auto text-center space-y-3 px-8"
              style={{ opacity: (progress - 0.7) / 0.3 }}
            >
              {/* /60 on a near-black background (#000 at this scroll depth) passes
                  the 4.5:1 threshold for body text and 3:1 for large text */}
              <p className="font-body text-[9px] md:text-[10px] text-blanc-casse/60 tracking-[0.35em] uppercase">
                Libellule Senteurs lui donne
              </p>
              <p className="font-heading text-4xl md:text-6xl text-or-luxe leading-none">
                Une Âme
              </p>
              <p className="font-body text-[10px] md:text-xs text-blanc-casse/60 tracking-[0.25em] uppercase mt-4">
                Parfums d&apos;intérieur Haut de Gamme
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
