"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type MarqueeProps = {
  items: string[];
  speed?: number;
  className?: string;
  separator?: string;
};

/**
 * Infinite horizontal marquee used as a visual divider between sections.
 *
 * The track duplicates the content span three times so it is always wider
 * than the viewport. GSAP then shifts the track leftward by exactly one
 * span's width and repeats infinitely, creating a seamless loop with no
 * visible jump.
 *
 * aria-hidden="true" keeps screen readers from announcing decorative text.
 * prefers-reduced-motion: animation is skipped entirely — the static text
 * remains visible as a divider without motion.
 */
export default function Marquee({
  items,
  speed = 30,
  className = "",
  separator = "✦",
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Respect the user's motion preference — no infinite scroll animation
    // if they've opted for reduced motion.
    if (reduced) return;

    const track = trackRef.current;
    if (!track) return;

    // Measure the first child span to know how far to translate before looping.
    const firstChild = track.children[0] as HTMLElement;
    if (!firstChild) return;
    const width = firstChild.offsetWidth;

    const tween = gsap.to(track, {
      x: -width,
      duration: speed,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [speed, reduced]);

  const text = items.join(` ${separator} `) + ` ${separator} `;

  return (
    <div
      className={`overflow-hidden py-8 md:py-10 border-y border-blanc-casse/[0.05] ${className}`}
      aria-hidden="true"
    >
      <div ref={trackRef} className="flex whitespace-nowrap">
        {/* Three copies ensure the track is always wider than the viewport */}
        <span className="font-body text-[10px] md:text-[11px] text-blanc-casse/30 tracking-[0.32em] uppercase px-4">
          {text}
        </span>
        <span className="font-body text-[10px] md:text-[11px] text-blanc-casse/30 tracking-[0.32em] uppercase px-4">
          {text}
        </span>
        <span className="font-body text-[10px] md:text-[11px] text-blanc-casse/30 tracking-[0.32em] uppercase px-4">
          {text}
        </span>
      </div>
    </div>
  );
}
