"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lifestyle panels showing the product in its natural habitat.
 * The sequence (hotel → salon → spa → boutique) moves the narrative from
 * aspirational to intimate to restorative to accessible.
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
    // Skip pinned horizontal scroll for reduced-motion users — they get the
    // standard vertical stack defined by the flex-wrap CSS below.
    if (reduced) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // gsap.matchMedia confines the horizontal-scroll pin to desktop.
    // On mobile the panels stack vertically and scroll normally, which is
    // both more accessible and avoids iOS Safari pin quirks.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const scrollWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // end() is a function so ScrollTrigger recalculates it after
          // font-load reflows or orientation changes.
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
      {/*
       * Desktop: flex-nowrap so all panels line up horizontally for GSAP.
       * Mobile: flex-wrap so they stack into a vertical list.
       * The title panel is the first element in the track — on desktop it
       * occupies one full viewport width before the image panels begin.
       */}
      <div ref={trackRef} className="flex md:flex-nowrap flex-wrap">

        {/* Title panel */}
        <div className="relative flex-shrink-0 w-full md:w-screen h-[60vh] md:h-[85vh] flex items-center justify-center">
          <div className="text-center px-8 max-w-4xl mx-auto">
            <p className="font-body text-[9px] text-blanc-casse/45 tracking-[0.35em] uppercase mb-5">
              Nos parfums dans leur élément
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-blanc-casse">
              L&apos;Expérience
            </h2>
          </div>
        </div>

        {/* Image panels */}
        {EXPERIENCES.map((exp) => (
          <div
            key={exp.title}
            className="relative flex-shrink-0 w-full md:w-screen h-[60vh] md:h-[85vh]"
          >
            <Image
              src={exp.image}
              alt={exp.title}
              fill
              className="object-cover"
            />
            {/* Bottom-to-top gradient ensures copy legibility against any
                image regardless of its dominant tone */}
            <div className="absolute inset-0 bg-gradient-to-t from-noir-profond/85 via-noir-profond/25 to-transparent" />

            <div className="absolute bottom-14 left-8 md:left-16 z-10 max-w-xs md:max-w-sm">
              {/* /80 on the dark gradient overlay gives ~5:1 contrast vs #000 bg */}
              <p className="font-body text-[8px] text-or-luxe/80 tracking-[0.3em] uppercase mb-3">
                Expérience
              </p>
              <h3 className="font-heading text-2xl md:text-3xl text-blanc-casse mb-3 leading-tight">
                {exp.title}
              </h3>
              <p className="font-body text-sm text-blanc-casse/65 leading-[1.75]">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
