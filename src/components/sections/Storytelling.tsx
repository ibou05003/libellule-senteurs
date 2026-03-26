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

    const words = wordsRef.current;

    // Animate each word's color from dark gray to blanc-cassé as the user
    // scrolls through the section. The scrub ties playback directly to scroll
    // position, giving a smooth "ink appearing" effect.
    gsap.fromTo(
      words,
      { color: "#333333" },
      {
        color: "#F8F8F8",
        stagger: 0.05,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1,
        },
      }
    );

    return () => {
      // Only kill triggers that belong to this section to avoid disturbing
      // other components' ScrollTrigger instances on unmount.
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
      className="relative min-h-[200vh] flex items-center justify-center bg-noir-profond py-section px-8"
    >
      {/* Dragonfly filigree — purely decorative, hidden from assistive tech */}
      <svg
        viewBox="0 0 200 200"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.03]"
        fill="none"
        stroke="#C99700"
        strokeWidth="0.5"
        aria-hidden="true"
      >
        {/* Body */}
        <circle cx="100" cy="100" r="80" />
        {/* Left wing */}
        <path d="M100 100 Q60 60 80 30 Q100 50 100 100" />
        {/* Right wing */}
        <path d="M100 100 Q140 60 120 30 Q100 50 100 100" />
        {/* Tail */}
        <path d="M100 100 L100 150" />
      </svg>

      {/* Brand story — each word is an independent span so GSAP can tween
          individual word colors as they enter the viewport */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="font-heading text-2xl md:text-4xl lg:text-5xl leading-relaxed md:leading-relaxed lg:leading-relaxed text-center">
          {words.map((word, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) wordsRef.current[i] = el;
              }}
              className="inline-block mr-[0.3em]"
              // Start dark so GSAP has a visible state to tween from.
              // When the user prefers reduced motion we show full brightness
              // immediately without any animation.
              style={{ color: reduced ? "#F8F8F8" : "#333333" }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
