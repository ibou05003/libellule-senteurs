"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lifestyle panels showing the product in its natural habitat.
 * The variety of environments (hotel → salon → spa → boutique) moves
 * the narrative from aspirational to intimate to restorative to accessible.
 */
const EXPERIENCES = [
  {
    title: "Hôtels de Luxe",
    description: "Sublimez l'accueil de vos clients avec une signature olfactive mémorable.",
    image: "/images/experience/hotel.webp",
  },
  {
    title: "Salons Privés",
    description: "Transformez votre intérieur en un sanctuaire de raffinement.",
    image: "/images/experience/salon-luxe-01.webp",
  },
  {
    title: "Espaces Bien-Être",
    description: "Créez une atmosphère apaisante dans vos espaces de soin.",
    image: "/images/experience/spa-01.webp",
  },
  {
    title: "Boutiques",
    description: "Offrez à vos clients une expérience sensorielle dès le seuil.",
    image: "/images/experience/boutique-02.webp",
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Skip the pinned horizontal scroll for users who prefer reduced motion —
    // they get the standard vertical stack (handled by the flex-wrap CSS).
    if (reduced) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // gsap.matchMedia ensures the horizontal-scroll pin only activates on
    // desktop. On mobile the panels stack vertically and scroll normally,
    // which is both a11y-friendlier and avoids iOS Safari pin quirks.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // scrollWidth minus the viewport width gives the exact distance we need
      // to translate so the last panel lands at the right edge.
      const scrollWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // end() is a function so ScrollTrigger recalculates it on refresh
          // (e.g., after a font-load reflow or orientation change).
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="bg-noir-profond overflow-hidden"
    >
      <div className="px-8 py-section">
        <h2 className="font-heading text-3xl md:text-5xl text-or-luxe text-center mb-4">
          L&apos;Expérience
        </h2>
        <p className="font-body text-blanc-casse/50 text-center text-sm tracking-widest uppercase">
          Nos parfums dans leur élément
        </p>
      </div>

      {/* On desktop: flex-nowrap so all panels line up horizontally for GSAP
          to translate. On mobile: flex-wrap so they stack into a vertical list. */}
      <div
        ref={trackRef}
        className="flex md:flex-nowrap flex-wrap"
      >
        {EXPERIENCES.map((exp) => (
          <div
            key={exp.title}
            className="relative flex-shrink-0 w-full md:w-screen h-[60vh] md:h-[80vh]"
          >
            <Image
              src={exp.image}
              alt={exp.title}
              fill
              className="object-cover"
            />
            {/* Bottom-to-top gradient ensures copy legibility against any
                image regardless of its dominant tone. */}
            <div className="absolute inset-0 bg-gradient-to-t from-noir-profond/80 via-noir-profond/20 to-transparent" />

            <div className="absolute bottom-12 left-8 md:left-16 z-10 max-w-md">
              <h3 className="font-heading text-2xl md:text-4xl text-blanc-casse mb-2">
                {exp.title}
              </h3>
              <p className="font-body text-blanc-casse/70 text-sm md:text-base">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
