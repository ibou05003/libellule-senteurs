"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  label: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageAspect?: string;
}

interface ProductDuoProps {
  products: [Product, Product];
  theme?: "light" | "dark";
}

export default function ProductDuo({ products, theme = "light" }: ProductDuoProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
    });

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(
        el,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8 },
        i * 0.2
      );
    });

    return () => { tl.kill(); };
  }, [reducedMotion]);

  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-noir-profond" : "bg-blanc-casse";
  const textColor = isDark ? "text-blanc-casse" : "text-noir-profond";
  const subColor = isDark ? "text-blanc-casse/60" : "text-noir-profond/60";

  return (
    <section
      ref={sectionRef}
      className={`relative ${bgClass} px-4 py-16 md:px-12 md:py-28 lg:px-20 lg:py-36`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 lg:gap-20">
        {products.map((prod, i) => (
          <div
            key={prod.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="flex flex-col"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            <div
              className="relative w-full"
              style={{ aspectRatio: prod.imageAspect || "3/4" }}
            >
              <Image
                src={prod.imageSrc}
                alt={prod.imageAlt}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 80vw, 40vw"
              />
            </div>
            <div className="mt-8">
              <p className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe">
                {prod.label}
              </p>
              <div className="my-3 h-px w-10 bg-or-luxe/40" />
              <h3 className={`font-heading text-lg leading-tight md:text-2xl lg:text-3xl ${textColor}`}>
                {prod.title}
              </h3>
              <p className={`mt-4 font-body text-base leading-relaxed ${subColor}`}>
                {prod.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
