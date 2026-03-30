"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function NotreHistoire() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
      },
    });

    const children = content.children;
    for (let i = 0; i < children.length; i++) {
      tl.fromTo(
        children[i],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        i * 0.15
      );
    }

    return () => { tl.kill(); };
  }, [reducedMotion]);

  return (
    <section
      id="histoire"
      ref={sectionRef}
      className="relative bg-noir-profond px-4 py-24 md:px-8 md:py-32 lg:py-40"
    >
      <div
        ref={contentRef}
        className="mx-auto max-w-2xl text-center"
      >
        <p
          className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          Notre Histoire
        </p>
        <div
          className="mx-auto my-5 h-px w-16 bg-or-luxe/60"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        />
        <h2
          className="font-heading text-2xl leading-tight text-blanc-casse md:text-4xl lg:text-5xl"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          Née à Dakar, inspirée par le monde
        </h2>
        <p
          className="mt-8 font-body text-base leading-[1.8] text-blanc-casse/70 md:text-lg"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          Libellule Senteurs est née d&apos;une conviction simple : chaque
          espace mérite une identité olfactive. Depuis Dakar, nous créons des
          parfums d&apos;intérieur qui marient les essences d&apos;Afrique de
          l&apos;Ouest aux traditions de la haute parfumerie.
        </p>
        <p
          className="mt-6 font-body text-base leading-[1.8] text-blanc-casse/70 md:text-lg"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          Chaque création est fabriquée à la main, avec des ingrédients
          naturels soigneusement sélectionnés. Du choix des essences à la
          finition de l&apos;écrin, nous portons une attention méticuleuse à
          chaque détail — parce que le luxe réside dans ce qu&apos;on ne voit
          pas, mais qu&apos;on ressent.
        </p>
      </div>
    </section>
  );
}
