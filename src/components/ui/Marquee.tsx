"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

type MarqueeProps = {
  items: string[];
  speed?: number;
  className?: string;
  separator?: string;
};

/**
 * Infinite horizontal marquee used as a visual divider between sections.
 *
 * The animation duplicates the content span three times so the track
 * is always wider than the viewport. GSAP then shifts the entire track
 * leftward by exactly one span's width and repeats infinitely, creating
 * a seamless loop without a visible jump.
 *
 * aria-hidden="true" keeps screen readers from announcing decorative text.
 */
export default function Marquee({
  items,
  speed = 30,
  className = "",
  separator = "✦",
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure the first child span to know how far to translate before looping.
    // Casting is safe here — we always render at least three children.
    const firstChild = track.children[0] as HTMLElement;
    if (!firstChild) return;
    const width = firstChild.offsetWidth;

    gsap.to(track, {
      x: -width,
      duration: speed,
      ease: "none",
      repeat: -1,
    });
  }, [speed]);

  // Build the repeated text once; each span receives the same string so the
  // loop appears seamless regardless of viewport width.
  const text = items.join(` ${separator} `) + ` ${separator} `;

  return (
    <div className={`overflow-hidden py-6 ${className}`} aria-hidden="true">
      <div ref={trackRef} className="flex whitespace-nowrap">
        <span className="font-body text-sm md:text-base text-blanc-casse/20 tracking-[0.3em] uppercase px-4">
          {text}
        </span>
        <span className="font-body text-sm md:text-base text-blanc-casse/20 tracking-[0.3em] uppercase px-4">
          {text}
        </span>
        <span className="font-body text-sm md:text-base text-blanc-casse/20 tracking-[0.3em] uppercase px-4">
          {text}
        </span>
      </div>
    </div>
  );
}
