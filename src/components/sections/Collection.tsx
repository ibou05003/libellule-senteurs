"use client";

import ProductCard from "@/components/ui/ProductCard";

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
    description: "L'ensemble de nos créations",
    image: "/images/mockups/collection-complete-packagings.webp",
  },
];

export default function Collection() {
  return (
    <section id="collection" className="bg-noir-profond py-24 md:py-32 lg:py-40 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Centered heading */}
        <div className="w-full text-center mb-16 md:mb-24">
          <p className="font-body text-[9px] text-blanc-casse/45 tracking-[0.35em] uppercase mb-5">
            Nos créations
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-blanc-casse">
            Notre Collection
          </h2>
        </div>

        {/* Grid on desktop, horizontal scroll on mobile */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
          {PRODUCTS.map((product) => (
            <div key={product.name} className="flex justify-center">
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div
          className="md:hidden flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {PRODUCTS.map((product) => (
            <div key={product.name} className="snap-center flex-shrink-0">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
