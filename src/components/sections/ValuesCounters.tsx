"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  { end: 4, suffix: "", label: "Fragrances", sublabel: "signature" },
  { end: 100, suffix: "%", label: "Naturel", sublabel: "ingrédients" },
  { end: 0, suffix: "", label: "Fait main", sublabel: "avec soin", display: "Fait main" },
  { end: 0, suffix: "", label: "Dakar", sublabel: "Sénégal", display: "Dakar" },
];

export default function ValuesCounters() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    // Counter animation
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "top 20%",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        VALUES.forEach((val, i) => {
          const el = numberRefs.current[i];
          if (!el) return;
          if (val.display) {
            el.style.opacity = String(Math.min(1, p * 2));
          } else {
            const current = Math.round(val.end * p);
            el.textContent = `${current}${val.suffix}`;
          }
        });
      },
    });

    // Staggered entrance per item
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 40%",
        scrub: 1,
      },
    });

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5 }, i * 0.12);
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative bg-noir-profond px-4 py-16 md:px-8 md:py-28 lg:py-36">
      {/* Subtle top border */}
      <div className="mx-auto mb-16 h-px w-24 bg-or-luxe/30" />

      <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-y-8 md:gap-y-12 lg:grid-cols-4">
        {VALUES.map((val, i) => (
          <div
            key={val.label}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="text-center"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            <span
              ref={(el) => { numberRefs.current[i] = el; }}
              className="block font-heading text-2xl text-or-luxe md:text-4xl lg:text-5xl"
            >
              {val.display || `0${val.suffix}`}
            </span>
            <span className="mt-2 block font-body text-xs uppercase tracking-[0.2em] text-blanc-casse/70 md:text-sm">
              {val.label}
            </span>
            <span className="mt-1 block font-body text-xs text-blanc-casse/40">
              {val.sublabel}
            </span>
          </div>
        ))}
      </div>

      {/* Subtle bottom border */}
      <div className="mx-auto mt-16 h-px w-24 bg-or-luxe/30" />
    </section>
  );
}
