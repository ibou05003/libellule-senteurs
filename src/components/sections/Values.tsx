"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Each value carries its own inline SVG icon — no external asset requests.
// Stroked in brand gold with no fill, lightweight and visually consistent.
const VALUES = [
  {
    name: "Élégance",
    description:
      "Le raffinement dans chaque détail, une signature visuelle intemporelle.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="#C99700"
        strokeWidth="1.5"
        className="w-10 h-10"
        aria-hidden="true"
      >
        <path d="M24 4 L28 18 L24 44" strokeLinecap="round" />
        <path d="M20 12 Q24 8 28 12" />
        <path d="M18 20 Q24 14 30 20" />
      </svg>
    ),
  },
  {
    name: "Raffinement",
    description:
      "Chaque fragrance est pensée avec précision pour offrir une signature unique.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="#C99700"
        strokeWidth="1.5"
        className="w-10 h-10"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="18" />
        <circle cx="24" cy="24" r="10" />
        <circle cx="24" cy="24" r="3" fill="#C99700" />
      </svg>
    ),
  },
  {
    name: "Nature",
    description: "Des essences pures inspirées par la beauté du monde naturel.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="#C99700"
        strokeWidth="1.5"
        className="w-10 h-10"
        aria-hidden="true"
      >
        <path d="M24 44 L24 20" strokeLinecap="round" />
        <path d="M24 20 Q16 12 24 4 Q32 12 24 20" fill="none" />
        <path d="M24 30 Q18 26 16 20" strokeLinecap="round" />
        <path d="M24 28 Q30 24 32 18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Sérénité",
    description:
      "Transformer chaque espace en un havre de paix et de bien-être.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="#C99700"
        strokeWidth="1.5"
        className="w-10 h-10"
        aria-hidden="true"
      >
        <path d="M4 30 Q12 22 24 26 Q36 30 44 22" />
        <path d="M4 36 Q12 28 24 32 Q36 36 44 28" />
        <circle cx="24" cy="16" r="8" />
      </svg>
    ),
  },
];

export default function Values() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    // Cards reveal once with a stagger as the section enters the viewport.
    // `toggleActions: "play none none none"` means no reverse on scroll-up —
    // suits a luxury one-shot reveal aesthetic.
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === sectionRef.current) t.kill();
      });
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="valeurs"
      className="bg-noir-profond py-24 md:py-32 lg:py-40"
      style={{ paddingInline: "1.5rem" }}
    >
      <div className="w-full">
        <div className="text-center mb-14 md:mb-20">
          <p className="font-body text-[9px] text-blanc-casse/45 tracking-[0.35em] uppercase mb-5">
            Ce qui nous définit
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-blanc-casse">
            Nos Valeurs
          </h2>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 md:gap-10 lg:gap-8">
          {VALUES.map((value, i) => (
            <div
              key={value.name}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              className="flex flex-col items-center text-center gap-7"
              // Hidden initially so GSAP can animate in. Reduced motion skips
              // the animation and shows cards fully visible from the start.
              style={{ opacity: reduced ? 1 : 0 }}
            >
              <div className="mb-1">{value.icon}</div>
              <h3 className="font-heading text-xl text-blanc-casse tracking-wide">
                {value.name}
              </h3>
              {/* /60 = ~4.2:1 on #000 bg — close to WCAG AA; /55 was borderline */}
              <p className="font-body text-sm text-blanc-casse/60 leading-[1.75]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
