"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ProductCardProps = {
  name: string;
  description: string;
  image: string;
};

export default function ProductCard({ name, description, image }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Respect the OS-level "reduce motion" accessibility preference.
  // When active, we skip the 3D tilt entirely — no mouse handlers, no GSAP
  // animations — so users who experience vestibular discomfort are unaffected.
  const reduced = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    // Normalize cursor position to [-0.5, 0.5] relative to card center.
    // Multiplying by 8 gives a subtle ±4° tilt — refined from 10° to feel
    // more restrained and premium on a luxury product card.
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 8,
      rotateX: -y * 8,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    // Ease back to neutral — slightly longer duration than the move for a
    // smooth "settle" feel that reinforces the physical weight of the object.
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power2.out" });
  };

  return (
    <div
      ref={cardRef}
      className="group relative flex-shrink-0 w-[280px] md:w-[300px] lg:w-[320px] cursor-pointer"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      onMouseMove={reduced ? undefined : handleMouseMove}
      onMouseLeave={reduced ? undefined : handleMouseLeave}
    >
      {/*
       * `aspect-[4/5]` gives portrait-leaning proportions that suit most
       * luxury product photography. `object-contain` ensures no image is
       * cropped regardless of its native ratio.
       */}
      <div className="relative aspect-[4/5] overflow-hidden bg-blanc-casse/[0.04] border border-blanc-casse/[0.06] group-hover:border-or-luxe/20 transition-colors duration-500">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Gold light reflection overlay — simulates a specular highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-or-luxe/0 via-or-luxe/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Brand watermark — low-opacity mark in the corner for brand consistency
            even when product images are viewed in isolation or shared */}
        <div className="absolute bottom-3 right-3 opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none">
          <svg
            viewBox="0 0 36 36"
            className="w-5 h-5"
            fill="none"
            stroke="#C99700"
            strokeWidth="1"
            aria-hidden="true"
          >
            <circle cx="18" cy="18" r="14" opacity="0.5" />
            <path d="M18 18 Q10 10 14 4 Q18 10 18 18" fill="#C99700" opacity="0.6" />
            <path d="M18 18 Q26 10 22 4 Q18 10 18 18" fill="#C99700" opacity="0.4" />
            <path d="M18 18 L18 28" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>
      </div>

      <div className="mt-5 px-1">
        <h3 className="font-heading text-base md:text-lg text-blanc-casse leading-snug">{name}</h3>
        {/* /55 raises contrast from ~2.8:1 to ~3.9:1 on the dark card bg */}
        <p className="font-body text-[11px] md:text-xs text-blanc-casse/55 mt-1.5 tracking-wide leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
