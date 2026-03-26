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
    // Multiplying by 10 gives a subtle ±5° tilt that reads as 3D without
    // being disorienting — a common sweet spot for luxury product cards.
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    // Ease back to neutral — slightly longer duration than the move for a
    // smooth "settle" feel that reinforces the physical weight of the object.
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power2.out" });
  };

  return (
    <div
      ref={cardRef}
      className="group relative flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer"
      style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      onMouseMove={reduced ? undefined : handleMouseMove}
      onMouseLeave={reduced ? undefined : handleMouseLeave}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-blanc-casse/5 rounded-sm">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gold light reflection overlay — simulates a specular highlight that
            shifts with the tilt, reinforcing the 3D illusion */}
        <div className="absolute inset-0 bg-gradient-to-br from-or-luxe/0 via-or-luxe/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-heading text-lg text-blanc-casse">{name}</h3>
        <p className="font-body text-sm text-blanc-casse/50 mt-1">{description}</p>
      </div>
    </div>
  );
}
