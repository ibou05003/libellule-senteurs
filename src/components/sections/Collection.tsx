"use client";

import { useRef } from "react";
import ProductCard from "@/components/ui/ProductCard";

/**
 * Product catalogue data.
 * Descriptions are concise sensory cues — they help the user imagine handling
 * the object without requiring them to read long copy.
 */
const PRODUCTS = [
  {
    name: "Diffuseur à Bâtonnets",
    description: "Vase blanc avec tiges en rotin",
    image: "/images/products/diffuseur-batonnets.webp",
  },
  {
    name: "Bougie Parfumée",
    description: "Pot blanc, 7.1cm × 8cm",
    image: "/images/products/bougie-parfumee-dimensions.webp",
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
    name: "Parfum Cristal",
    description: "Cristal taillé, version luxe",
    image: "/images/products/parfum-cristal-hero.webp",
  },
];

export default function Collection() {
  // Native horizontal overflow scroll — no JS library needed.
  // CSS scroll-snap gives the tactile "card click" feel on both touch and
  // desktop, while the cursor change (grab → grabbing) signals interactivity.
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="collection" className="py-section bg-noir-profond">
      <div className="px-8 mb-16">
        <h2 className="font-heading text-3xl md:text-5xl text-or-luxe text-center">
          Notre Collection
        </h2>
        <p className="font-body text-blanc-casse/50 text-center mt-4 text-sm tracking-widest uppercase">
          Glissez pour découvrir
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto px-8 pb-8 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{
          // Belt-and-suspenders: Tailwind utility class handles Firefox + modern
          // browsers; the inline style is for legacy IE (msOverflowStyle) and
          // direct style attribute for scrollbarWidth on non-Tailwind browsers.
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Leading spacer — on large screens this centers the first card in the
            viewport without requiring flexbox justify-center (which would break
            the overflow scroll behaviour). */}
        <div className="flex-shrink-0 w-[calc((100vw-320px)/2)] hidden lg:block" />

        {PRODUCTS.map((product) => (
          <div key={product.name} className="snap-center">
            <ProductCard {...product} />
          </div>
        ))}

        {/* Trailing spacer — mirrors the leading spacer so the last card
            can also be scrolled to the visual center. */}
        <div className="flex-shrink-0 w-[calc((100vw-320px)/2)] hidden lg:block" />
      </div>
    </section>
  );
}
