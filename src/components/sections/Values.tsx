"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Each value carries its own inline SVG icon so no external asset requests
// are needed. The icons use the brand gold (#C99700) stroke with no fill,
// keeping them lightweight and consistent with the site's aesthetic.
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
        className="w-12 h-12"
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
        className="w-12 h-12"
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
        className="w-12 h-12"
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
        className="w-12 h-12"
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

    // Cards start invisible (set via inline style below) and slide up into
    // view with a stagger once the section enters the viewport. toggleActions
    // "play none none none" means the animation only fires once — there is no
    // reverse on scroll-up, which suits a luxury reveal aesthetic.
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
      className="min-h-screen flex items-center bg-noir-profond py-section px-8"
    >
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="font-heading text-3xl md:text-5xl text-or-luxe text-center mb-20">
          Nos Valeurs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {VALUES.map((value, i) => (
            <div
              key={value.name}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="flex flex-col items-center text-center gap-4"
              // Cards are hidden by default so GSAP can reveal them. When the
              // user prefers reduced motion we skip the animation entirely and
              // display the cards fully visible from the start.
              style={{ opacity: reduced ? 1 : 0 }}
            >
              {value.icon}
              <h3 className="font-heading text-xl text-blanc-casse mt-2">
                {value.name}
              </h3>
              <p className="font-body text-sm text-blanc-casse/60 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
