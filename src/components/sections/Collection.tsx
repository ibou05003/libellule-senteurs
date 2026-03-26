"use client";

import { useRef } from "react";
import ProductCard from "@/components/ui/ProductCard";

/**
 * Product catalogue entries.
 *
 * Image selection rationale:
 * - `bougie-sans-marque` replaces a technical-drawing candle with dimension
 *   annotations that are not suitable for display.
 * - `coffret-cadeau-bordeaux` rounds out the lineup with a gifting option.
 */
const PRODUCTS = [
  {
    name: "Diffuseur à Bâtonnets",
    description: "Vase blanc avec tiges en rotin",
    image: "/images/products/diffuseur-batonnets.webp",
  },
  {
    name: "Huile Essentielle",
    description: "Flacon givré, bouchon doré",
    image: "/images/products/flacon-huile-essentielle.webp",
  },
  {
    name: "Parfum d'Ambiance",
    description: "Flacon noir avec logo doré",
    image: "/images/products/parfum-noir-boite.webp",
  },
  {
    name: "Coffret Cadeau",
    description: "Écrin bordeaux avec logo doré",
    image: "/images/mockups/coffret-cadeau-bordeaux.webp",
  },
  {
    name: "La Collection",
    description: "L'ensemble de nos créations réunies",
    image: "/images/mockups/collection-complete-packagings.webp",
  },
];

export default function Collection() {
  // Native horizontal overflow scroll with CSS scroll-snap.
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="collection" className="bg-noir-profond py-24 md:py-32 lg:py-40">
      {/* Heading block — consistent two-line pattern */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 md:mb-20">
        <p className="font-body text-[9px] text-blanc-casse/30 tracking-[0.35em] uppercase mb-5">
          Nos créations
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-blanc-casse">
          Notre Collection
        </h2>
        <p className="font-body text-blanc-casse/25 mt-5 text-[9px] tracking-[0.28em] uppercase">
          Glissez pour découvrir
        </p>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={scrollRef}
        className="flex gap-6 md:gap-8 overflow-x-auto px-6 md:px-8 pb-10 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/*
         * Leading spacer: on large screens this optically centers the first
         * card without using justify-center, which would break the overflow
         * scroll behaviour.
         */}
        <div className="flex-shrink-0 w-[calc((100vw-320px)/2)] hidden lg:block" />

        {PRODUCTS.map((product) => (
          <div key={product.name} className="snap-center flex-shrink-0">
            <ProductCard {...product} />
          </div>
        ))}

        {/* Trailing spacer mirrors the leading one so the last card centers */}
        <div className="flex-shrink-0 w-[calc((100vw-320px)/2)] hidden lg:block" />
      </div>
    </section>
  );
}
