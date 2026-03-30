"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: "diffuseur",
    name: "Le Diffuseur",
    image: "/images/products/diffuseur-baguettes-v2.png",
    aspect: "3/4",
  },
  {
    id: "bougie",
    name: "La Bougie",
    image: "/images/products/bougie-sans-marque.webp",
    aspect: "3/4",
  },
  {
    id: "huile",
    name: "L\u2019Huile Essentielle",
    image: "/images/products/flacon-huile-essentielle-detour.webp",
    aspect: "3/4",
  },
  {
    id: "parfum-noir",
    name: "Le Parfum Noir",
    image: "/images/products/parfum-noir-boite-detour.webp",
    aspect: "4/5",
  },
  {
    id: "cristal",
    name: "Le Cristal",
    image: "/images/products/parfum-cristal-detour.webp",
    aspect: "3/5",
  },
];

export default function CollectionGrid() {
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
        end: "top 30%",
        scrub: 1,
      },
    });

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(
        el,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6 },
        i * 0.1
      );
    });

    return () => { tl.kill(); };
  }, [reducedMotion]);

  return (
    <section
      id="collection"
      ref={sectionRef}
      className="relative bg-blanc-casse px-4 py-24 md:px-8 md:py-32 lg:px-20 lg:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center md:mb-20">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe">
            Nos Créations
          </p>
          <div className="mx-auto my-4 h-px w-16 bg-or-luxe" />
          <h2 className="font-heading text-2xl leading-tight text-noir-profond md:text-4xl lg:text-5xl">
            La Collection
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-10 lg:grid-cols-5">
          {PRODUCTS.map((product, i) => (
            <a
              key={product.id}
              href={`#${product.id}`}
              className="group cursor-pointer"
            >
              <div
                ref={(el) => { cardRefs.current[i] = el as HTMLDivElement; }}
                className="flex flex-col items-center"
                style={{ opacity: reducedMotion ? 1 : 0 }}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: product.aspect }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 45vw, 20vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-center font-heading text-sm tracking-wide text-noir-profond md:text-base">
                  {product.name}
                </p>
                <span className="mt-2 font-body text-xs uppercase tracking-[0.2em] text-or-luxe opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Découvrir
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
