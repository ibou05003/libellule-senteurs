"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const STORY_TEXT =
  "Libellule Senteurs, ce n'est pas simplement parfumer un espace... C'est lui donner une âme. C'est transformer l'invisible en émotion. Parce que les plus belles expériences ne se voient pas... elles se ressentent.";

export default function Storytelling() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    // Each word tweens from near-invisible dark gray to blanc-cassé as the
    // user scrolls through the section — a progressive "ink appearing" effect.
    gsap.fromTo(
      wordsRef.current,
      { color: "#222222" },
      {
        color: "#F8F8F8",
        stagger: 0.05,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 40%",
          end: "bottom 60%",
          scrub: 1,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === sectionRef.current) t.kill();
      });
    };
  }, [reduced]);

  const words = STORY_TEXT.split(" ");

  return (
    <section
      ref={sectionRef}
      id="histoire"
      className="relative bg-noir-profond"
      style={{ minHeight: "200vh" }}
    >
      {/*
       * Decorative filigree: absolutely positioned so it scrolls naturally with
       * the section rather than interfering with the sticky text layer.
       * Kept at very low opacity so it reads as texture, not content.
       */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 200 200"
          className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] opacity-[0.025]"
          fill="none"
          stroke="#C99700"
          strokeWidth="0.5"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="80" />
          <path d="M100 100 Q60 60 80 30 Q100 50 100 100" />
          <path d="M100 100 Q140 60 120 30 Q100 50 100 100" />
          <path d="M100 100 L100 150" />
        </svg>
      </div>

      {/*
       * Sticky text block: stays centered in the viewport for the full scroll
       * distance of the section, giving GSAP time to animate all the words in.
       */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6">
        <p className="font-body text-[10px] text-or-luxe/40 tracking-[0.3em] uppercase mb-8 md:mb-12">
          Notre Histoire
        </p>
        <p className="max-w-2xl md:max-w-3xl font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.6] md:leading-[1.6] lg:leading-[1.5] text-center">
          {words.map((word, i) => (
            <span
              key={i}
              ref={(el) => { if (el) wordsRef.current[i] = el; }}
              className="inline-block mr-[0.3em]"
              // Start dark so GSAP has a visible state to tween from.
              // Reduced-motion skips the animation and shows full brightness.
              style={{ color: reduced ? "#F8F8F8" : "#222222" }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
