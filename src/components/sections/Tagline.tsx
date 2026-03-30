"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface TaglineProps {
  text?: string;
}

export default function Tagline({ text = "L'essence du raffinement invisible" }: TaglineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  const words = text.split(" ");

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        wordsRef.current.forEach((el, i) => {
          if (!el) return;
          const wordStart = i / words.length;
          const wordEnd = (i + 1) / words.length;
          const wordP = Math.max(0, Math.min(1, (p - wordStart) / (wordEnd - wordStart)));
          el.style.opacity = String(0.15 + 0.85 * wordP);
          el.style.transform = `translateY(${20 * (1 - wordP)}px)`;
        });
      },
    });

    return () => st.kill();
  }, [reducedMotion, words.length]);

  return (
    <section ref={containerRef} style={{ height: "100vh" }} className="relative">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center bg-noir-profond px-4 md:px-8">
        <p className="max-w-4xl text-center font-heading text-2xl leading-snug text-or-luxe md:text-5xl lg:text-7xl">
          {words.map((word, i) => (
            <span
              key={i}
              ref={(el) => { wordsRef.current[i] = el; }}
              className="mr-[0.3em] inline-block"
              style={{ opacity: 0.15 }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
