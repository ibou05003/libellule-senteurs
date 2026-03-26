"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type TextRevealProps = {
  text: string;
  className?: string;
  /** Whether to split by individual words or individual characters */
  splitBy?: "words" | "chars";
  /** Seconds between each unit's animation start */
  stagger?: number;
  /** Seconds to wait before the first unit begins animating */
  delay?: number;
  /**
   * When true the animation fires on mount (or when the value changes from
   * false → true). Pass false to hold the animation until the parent is
   * ready — e.g. after a loading screen completes.
   */
  trigger?: boolean;
};

/**
 * Reusable text reveal component that animates text in unit by unit.
 *
 * Units start invisible (opacity: 0, translated 20px downward) and animate
 * to their natural position via GSAP. The `trigger` prop lets the parent
 * control exactly when the reveal fires — useful for sequencing after loading
 * screens or scroll events.
 *
 * The component preserves the full `text` string as an accessible aria-label
 * so screen readers get the complete sentence regardless of how the DOM nodes
 * are split.
 */
export default function TextReveal({
  text,
  className = "",
  splitBy = "chars",
  stagger = 0.03,
  delay = 0,
  trigger = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(".reveal-unit");

    gsap.fromTo(
      elements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger,
        delay,
        ease: "power2.out",
      }
    );
  }, [trigger, stagger, delay]);

  const units = splitBy === "words" ? text.split(" ") : text.split("");

  return (
    <div ref={containerRef} className={className} aria-label={text}>
      {units.map((unit, i) => (
        <span
          key={i}
          className="reveal-unit inline-block opacity-0"
          // Preserve space characters so word-mode spacing looks correct
          style={{ whiteSpace: unit === " " ? "pre" : undefined }}
        >
          {unit}
          {/* Add a non-breaking space separator between words in word mode */}
          {splitBy === "words" && i < units.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </div>
  );
}
