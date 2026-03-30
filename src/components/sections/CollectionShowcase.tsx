"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Register once at module level — safe to call multiple times per GSAP docs
gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Shared CTA button helper — ghost style, light or dark variant
// ---------------------------------------------------------------------------
function ProductCTA({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="#contact"
      className={[
        "mt-6 inline-block border py-2.5 text-xs uppercase tracking-[0.2em] font-body transition-all duration-500 cursor-pointer",
        dark
          ? "border-or-luxe/40 text-or-luxe hover:bg-or-luxe hover:text-noir-profond"
          : "border-noir-profond/30 text-noir-profond hover:bg-noir-profond hover:text-blanc-casse",
      ].join(" ")}
      style={{ paddingInline: "2rem" }}
    >
      Découvrir
    </a>
  );
}

// ---------------------------------------------------------------------------
// Bloc A — Star product: asymmetric layout, image left 58%, text right 42%
// ---------------------------------------------------------------------------
function BlocA({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  // data-animate children are targeted for staggered entrance
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const imageWrap = imageWrapRef.current;
    const text = textRef.current;
    if (!section || !imageWrap || !text) return;

    // Subtle parallax: image shifts -40px over the full section scroll range
    const parallax = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        // Shift between +20px (entering) and -20px (leaving) for a gentle float
        const yShift = (self.progress - 0.5) * -40;
        gsap.set(imageWrap, { y: yShift });
      },
    });

    // Entrance: each [data-animate] child fades in from below, staggered
    const children = text.querySelectorAll("[data-animate]");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Image entrance
    tl.fromTo(
      imageWrap,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" },
      0
    );

    // Text children staggered
    tl.fromTo(
      children,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" },
      0.2
    );

    return () => {
      parallax.kill();
      tl.kill();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={sectionRef}
      className="relative bg-blanc-casse px-4 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:gap-0">
        {/* Image — 58% on desktop, full width on mobile */}
        <div className="w-full md:w-[58%]">
          <div
            ref={imageWrapRef}
            className="relative mx-auto w-full max-w-lg md:max-w-none"
            style={{
              aspectRatio: "904/1400",
              // Start invisible when animations are active; visible immediately
              // when reduced motion is preferred
              opacity: reducedMotion ? 1 : 0,
            }}
          >
            <Image
              src="/images/products/diffuseur-baguettes-v2.png"
              alt="Diffuseur à bâtonnets Libellule Senteurs"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 90vw, 55vw"
              priority
            />
          </div>
        </div>

        {/* Text block — 42% on desktop, centered on mobile */}
        <div
          ref={textRef}
          className="w-full md:w-[42%] md:pl-10 lg:pl-16 text-center md:text-left"
        >
          <p
            data-animate
            className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            Le Diffuseur
          </p>

          {/* Gold separator — shrinks from left on entrance (via GSAP) */}
          <div
            data-animate
            className="my-4 h-px w-12 bg-or-luxe mx-auto md:mx-0"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          />

          <h2
            data-animate
            className="font-heading text-2xl leading-tight text-noir-profond md:text-3xl lg:text-5xl"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            Chaque espace mérite une signature olfactive
          </h2>

          <p
            data-animate
            className="mt-6 max-w-md font-body text-base leading-relaxed text-noir-profond/60 mx-auto md:mx-0"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            Nos bâtonnets en bois naturel diffusent lentement un sillage délicat
            qui transforme chaque pièce en sanctuaire de sérénité.
          </p>

          <div
            data-animate
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            <ProductCTA dark={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared card component used in Bloc B and Bloc C
// ---------------------------------------------------------------------------
interface ProductCardProps {
  label: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageAspect: string;
  dark?: boolean;
  /** Scale up on desktop — used for the featured Cristal card */
  featured?: boolean;
  /** Show the golden radial glow behind the image */
  goldenGlow?: boolean;
  /** Forwarded ref for GSAP animation targeting */
  cardRef?: (el: HTMLDivElement | null) => void;
  reducedMotion: boolean;
}

function ProductCard({
  label,
  title,
  description,
  imageSrc,
  imageAlt,
  imageAspect,
  dark = false,
  featured = false,
  goldenGlow = false,
  cardRef,
  reducedMotion,
}: ProductCardProps) {
  const textColor = dark ? "text-blanc-casse" : "text-noir-profond";
  const subColor = dark ? "text-blanc-casse/60" : "text-noir-profond/60";
  const separatorColor = dark ? "bg-or-luxe/40" : "bg-or-luxe";

  return (
    <div
      ref={cardRef}
      data-card
      className={[
        "flex flex-col",
        // Featured Cristal: slightly larger on desktop, anchored at top
        featured ? "md:scale-105 md:origin-top" : "",
      ].join(" ")}
      style={{ opacity: reducedMotion ? 1 : 0 }}
    >
      {/* Image wrapper */}
      <div className="relative w-full" style={{ aspectRatio: imageAspect }}>
        {goldenGlow && (
          // Decorative radial glow — sits behind the product image
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(201,151,0,0.1) 0%, transparent 70%)",
            }}
          />
        )}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 80vw, 40vw"
        />
      </div>

      {/* Text */}
      <div className="mt-8">
        <p className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe">
          {label}
        </p>
        <div className={`my-3 h-px w-10 ${separatorColor}`} />
        <h3
          className={`font-heading text-lg leading-tight md:text-2xl lg:text-3xl ${textColor}`}
        >
          {title}
        </h3>
        <p className={`mt-4 font-body text-base leading-relaxed ${subColor}`}>
          {description}
        </p>
        <ProductCTA dark={dark} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bloc B — Bougie + Huile Essentielle (light background)
// ---------------------------------------------------------------------------
function BlocB({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(
        el,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power2.out" },
        // Stagger: second card enters 0.15s after the first
        i * 0.15
      );
    });

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={sectionRef}
      className="relative bg-blanc-casse px-4 py-16 md:px-12 md:py-28 lg:px-20 lg:py-36"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 lg:gap-20">
        <ProductCard
          label="La Bougie"
          title="Une flamme, mille sensations"
          description="La cire fond doucement, libérant des notes soigneusement composées qui enveloppent votre intérieur."
          imageSrc="/images/products/bougie-sans-marque.webp"
          imageAlt="Bougie parfumée Libellule Senteurs"
          imageAspect="3/2"
          dark={false}
          cardRef={(el) => { cardRefs.current[0] = el; }}
          reducedMotion={reducedMotion}
        />
        <ProductCard
          label="L'Huile Essentielle"
          title="Des essences pures, une sérénité absolue"
          description="Extraites avec soin, nos huiles capturent la quintessence de chaque plante pour une aromathérapie d'exception."
          imageSrc="/images/products/flacon-huile-essentielle-detour.webp"
          imageAlt="Flacon d'huile essentielle Libellule Senteurs"
          imageAspect="3/4"
          dark={false}
          cardRef={(el) => { cardRefs.current[1] = el; }}
          reducedMotion={reducedMotion}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bloc C — Parfum Noir + Cristal (dark background)
// ---------------------------------------------------------------------------
function BlocC({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.fromTo(
        el,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power2.out" },
        i * 0.15
      );
    });

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={sectionRef}
      className="relative bg-noir-profond px-4 py-16 md:px-12 md:py-28 lg:px-20 lg:py-36"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 lg:gap-20">
        <ProductCard
          label="Le Parfum d'Ambiance"
          title="L'élégance dans chaque détail"
          description="Un parfum d'ambiance raffiné, présenté dans un écrin noir qui allie sophistication et caractère."
          imageSrc="/images/products/parfum-noir-boite-detour.webp"
          imageAlt="Parfum d'ambiance noir Libellule Senteurs"
          imageAspect="800/1000"
          dark={true}
          cardRef={(el) => { cardRefs.current[0] = el; }}
          reducedMotion={reducedMotion}
        />
        <ProductCard
          label="Le Cristal"
          title="Au-delà du parfum, une expérience"
          description="Le flacon cristal incarne la pureté de nos créations — un objet précieux qui sublime chaque intérieur."
          imageSrc="/images/products/parfum-cristal-detour.webp"
          imageAlt="Flacon cristal Libellule Senteurs"
          imageAspect="600/1000"
          dark={true}
          featured={true}
          goldenGlow={true}
          cardRef={(el) => { cardRefs.current[1] = el; }}
          reducedMotion={reducedMotion}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CollectionShowcase — composes all 3 blocks with a gradient transition
// ---------------------------------------------------------------------------
export default function CollectionShowcase() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="collection">
      {/* Bloc A: star product — asymmetric, blanc-casse */}
      <BlocA reducedMotion={reducedMotion} />

      {/* Bloc B: bougie + huile — 2-column grid, blanc-casse */}
      <BlocB reducedMotion={reducedMotion} />

      {/*
       * Gradient transition: blanc-casse → noir-profond
       * This visually bridges the light duo section and the dark showcase below
       * without an abrupt background cut.
       */}
      <div
        aria-hidden="true"
        className="h-24 md:h-32"
        style={{
          background: "linear-gradient(to bottom, #F8F8F8, #000000)",
        }}
      />

      {/* Bloc C: parfum noir + cristal — dark theme */}
      <BlocC reducedMotion={reducedMotion} />
    </section>
  );
}
