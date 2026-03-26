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
 * The component is designed to eventually drive a full image-sequence morph
 * (90 pre-rendered PNG frames exported by Remotion stored at /public/frames/).
 * While those frames are not yet available it falls back to a CSS cross-fade
 * between the unbranded candle and the finished Libellule Senteurs product,
 * giving stakeholders a representative preview of the final effect.
 *
 * When the actual frames land, swap the cross-fade block for a canvas element
 * that draws `images[currentFrame]` — the GSAP ScrollTrigger wiring below is
 * already correct and does not need to change.
 *
 * Scroll behaviour
 * ───────────────────────────────────────────────────────────────────────────
 * The outer container is 300 vh tall. The inner viewport-height div is
 * `position: sticky` so it stays on screen while the user scrolls through the
 * full 300 vh of scroll distance. GSAP maps that scroll distance to a
 * `progressRef` value of 0 → 1, which drives:
 *   - Background color: off-white (#F8F8F8) → true black (#000)
 *   - Image cross-fade: unbranded → branded
 *   - Gold radial glow: fades in after 40% progress
 *   - Phase copy: teaser text fades out; brand reveal fades in
 *
 * Reduced motion
 * ───────────────────────────────────────────────────────────────────────────
 * When `prefers-reduced-motion` is set the component renders only the final
 * branded image on a dark background — no scroll animation, no sticky section.
 */
export default function ScrollFramePlayer({ className }: ScrollFramePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // progressRef stores the raw value mutated by GSAP (avoids closure stale-state)
  const progressRef = useRef({ value: 0 });
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    // Animate a plain object property (not a DOM node) so GSAP can use its
    // internal ticker rather than a JS requestAnimationFrame loop for scrubbing.
    // `scrub: 0.5` adds a subtle lag that makes the transition feel more physical.
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
        // Propagate the mutated value into React state so the JSX re-renders
        setProgress(progressRef.current.value);
      },
    });

    return () => {
      tween.kill();
      // Kill only the ScrollTrigger(s) attached to this container to avoid
      // interfering with triggers registered by other sections on the page
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [reduced]);

  // ─── Derived visual values ────────────────────────────────────────────────

  // Background interpolates from blanc-cassé (#F8F8F8 = 248,248,248) to noir (#000)
  const channel = Math.round(248 - 248 * progress);
  const bgColor = `rgb(${channel}, ${channel}, ${channel})`;

  // Gold glow only becomes visible after 40% scroll progress to avoid clashing
  // with the light background in the first half of the transition
  const glowOpacity = progress > 0.4 ? (progress - 0.4) / 0.6 : 0;

  // ─── Reduced-motion fallback ──────────────────────────────────────────────

  if (reduced) {
    return (
      <div
        className={`relative min-h-screen flex items-center justify-center bg-noir-profond ${className ?? ""}`}
      >
        {/*
         * Reduced-motion fallback: show the final branded state statically.
         * Container matches the 16:9 ratio of the landscape packagings image.
         */}
        <div className="relative w-[90vw] max-w-[700px] aspect-[16/9]">
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

  // ─── Full animated version ────────────────────────────────────────────────

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`} style={{ height: "200vh" }}>
      {/*
       * Sticky viewport: stays fixed on screen while the outer container scrolls.
       * All visual layers are absolutely positioned inside this box so they
       * overlap rather than stack vertically.
       */}
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden transition-none"
        style={{ backgroundColor: bgColor }}
      >
        {/* ── Layer 1: Unbranded candle (fades out as progress increases) ── */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 1 - progress }}
        >
          {/*
           * Both morph layers share the same 16:9 container dimensions so the
           * cross-fade is a true overlap with no layout shift mid-transition.
           * `bougie-sans-marque` is landscape (2000×1090) — a good fit for 16:9.
           */}
          <div className="relative w-[90vw] max-w-[700px] aspect-[16/9]">
            <Image
              src="/images/products/bougie-sans-marque.webp"
              alt=""
              fill
              className="object-contain"
              // Decorative — the branded image below carries the accessible name
              aria-hidden="true"
            />
          </div>
        </div>

        {/* ── Layer 2: Full branded collection (fades in) ── */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: progress }}
        >
          {/*
           * `collection-complete-packagings` shows all 4 products with the
           * Libellule Senteurs branding — the ideal "reveal" end state.
           * Same container dimensions as Layer 1 for a clean cross-fade.
           */}
          <div className="relative w-[90vw] max-w-[700px] aspect-[16/9]">
            <Image
              src="/images/mockups/collection-complete-packagings.webp"
              alt="Collection complète Libellule Senteurs"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* ── Layer 3: Radial gold glow — amplifies luxury feel in the second half ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, rgba(201,151,0,${glowOpacity * 0.15}) 0%, transparent 60%)`,
          }}
        />

        {/* ── Layer 4: Phase copy ── */}
        <div className="absolute inset-0 flex items-end justify-center pb-24 pointer-events-none">
          {/* Teaser line — visible in the first 30% of scroll, then fades out.
              blanc-cassé base with a dark text-shadow makes it legible against
              both the light (#F8F8F8) start state and the dark end state. */}
          {progress < 0.3 && (
            <p
              className="font-heading text-xl md:text-3xl text-blanc-casse/70 text-center px-8"
              style={{
                opacity: 1 - progress / 0.3,
                textShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              Un objet. Un espace. Une attente...
            </p>
          )}

          {/* Brand reveal — visible after 70% scroll */}
          {progress > 0.7 && (
            <div
              className="text-center space-y-2"
              style={{ opacity: (progress - 0.7) / 0.3 }}
            >
              <p className="font-heading text-2xl md:text-4xl text-or-luxe">
                Libellule Senteurs
              </p>
              <p className="font-body text-sm md:text-base text-blanc-casse/70 tracking-widest">
                C&apos;est lui donner une âme.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
