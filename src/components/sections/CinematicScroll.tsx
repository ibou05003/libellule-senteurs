"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldenMist from "@/components/animations/GoldenMist";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BREAKPOINTS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

// ─── Act definitions ──────────────────────────────────────────────────────────

/**
 * Each act describes one chapter of the scroll journey.
 * start/end are progress values in [0, 1] representing the global scroll
 * fraction at which this act becomes active / fully complete.
 */
const ACTS = [
  {
    id: "hero",
    start: 0,
    end: 0.15,
    background: null, // pure black with GoldenMist
    product: "/images/mockups/collection-complete-packagings.webp",
    productAlt: "Collection complète Libellule Senteurs",
    productSide: "center" as const,
    label: "",
    title: "L'essence du raffinement invisible",
    subtitle: "Libellule Senteurs",
    textSide: "center" as const,
  },
  {
    id: "diffuseur",
    start: 0.15,
    end: 0.30,
    background: "/images/experience/hotel.webp",
    product: "/images/products/diffuseur-batonnets-detour.webp",
    productAlt: "Diffuseur à bâtonnets Libellule Senteurs",
    productSide: "right" as const,
    label: "Le Diffuseur",
    title: "Chaque espace mérite une signature olfactive",
    subtitle: "",
    textSide: "left" as const,
  },
  {
    id: "huile",
    start: 0.30,
    end: 0.45,
    background: "/images/experience/spa-01.webp",
    product: "/images/products/flacon-huile-essentielle-detour.webp",
    productAlt: "Flacon d'huile essentielle Libellule Senteurs",
    productSide: "left" as const,
    label: "L'Huile Essentielle",
    title: "Des essences pures, une sérénité absolue",
    subtitle: "",
    textSide: "right" as const,
  },
  {
    id: "parfum-noir",
    start: 0.45,
    end: 0.60,
    background: "/images/experience/salon-luxe-01.webp",
    product: "/images/products/parfum-noir-boite-detour.webp",
    productAlt: "Parfum noir avec boîte Libellule Senteurs",
    productSide: "right" as const,
    label: "Le Parfum d'Ambiance",
    title: "L'élégance dans chaque détail",
    subtitle: "",
    textSide: "left" as const,
  },
  {
    id: "cristal",
    start: 0.60,
    end: 0.80,
    background: null, // fade to pure black
    product: "/images/products/parfum-cristal-detour.webp",
    productAlt: "Parfum cristal Libellule Senteurs",
    productSide: "center" as const,
    label: "Le Cristal",
    title: "Au-delà du parfum, une expérience",
    subtitle: "",
    textSide: "center" as const,
  },
  {
    id: "coffret",
    start: 0.80,
    end: 1.0,
    background: null, // stays dark
    product: "/images/products/coffret-ouvert.webp",
    productAlt: "Coffret cadeau ouvert Libellule Senteurs",
    productSide: "center" as const,
    label: "Le Coffret",
    title: "Offrir Libellule Senteurs, c'est offrir une âme",
    subtitle: "",
    textSide: "center" as const,
  },
] as const;

// Thumbnails shown flying into the coffret during Act 6
const THUMBNAIL_PRODUCTS = [
  { src: "/images/products/diffuseur-batonnets-detour.webp", alt: "Diffuseur" },
  { src: "/images/products/flacon-huile-essentielle-detour.webp", alt: "Huile essentielle" },
  { src: "/images/products/parfum-noir-boite-detour.webp", alt: "Parfum noir" },
  { src: "/images/products/parfum-cristal-detour.webp", alt: "Cristal" },
];

// ─── Helper: normalise progress within an act to [0, 1] ──────────────────────

function actProgress(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

/**
 * Smoothstep easing: maps t∈[0,1] to a smooth S-curve.
 * Prevents jarring linear motion in scroll-driven animations.
 */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Lerp between a and b by t.
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Mobile fallback ──────────────────────────────────────────────────────────

function MobileFallback() {
  return (
    <div>
      {ACTS.map((act) => (
        <section
          key={act.id}
          id={act.id === "hero" ? "histoire" : act.id}
          style={{
            position: "relative",
            minHeight: "100svh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "#000000",
          }}
        >
          {/* Lifestyle background */}
          {act.background && (
            <div style={{ position: "absolute", inset: 0 }}>
              <Image
                src={act.background}
                alt=""
                fill
                sizes="100vw"
                style={{ objectFit: "cover", opacity: 0.25 }}
              />
              {/* Dark gradient overlay so text stays readable */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)",
                }}
              />
            </div>
          )}

          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              paddingInline: "clamp(1.5rem, 6vw, 4rem)",
              paddingTop: "6rem",
              paddingBottom: "4rem",
              textAlign: "center",
              maxWidth: "480px",
              marginInline: "auto",
            }}
          >
            {act.label && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#C99700",
                  marginBottom: "1.5rem",
                }}
              >
                {act.label}
              </p>
            )}

            {/* Product image */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: act.id === "coffret" ? "340px" : "260px",
                marginInline: "auto",
                marginBottom: "2rem",
                aspectRatio: act.id === "parfum-noir" ? "1200/907" : "3/4",
              }}
            >
              <Image
                src={act.product}
                alt={act.productAlt}
                fill
                sizes="(max-width: 480px) 80vw, 340px"
                style={{ objectFit: "contain" }}
              />
            </div>

            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.4rem, 5vw, 2rem)",
                color: "#F8F8F8",
                marginBottom: "1rem",
                lineHeight: 1.25,
              }}
            >
              {act.title}
            </h2>

            {act.subtitle && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(248,248,248,0.5)",
                }}
              >
                {act.subtitle}
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

// ─── Main cinematic component ─────────────────────────────────────────────────

export default function CinematicScroll() {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Refs to DOM elements we'll animate via GSAP
  const outerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Background image refs (one per act that has a background)
  const bgHotelRef = useRef<HTMLDivElement>(null);
  const bgSpaRef = useRef<HTMLDivElement>(null);
  const bgSalonRef = useRef<HTMLDivElement>(null);

  // Product image wrapper refs
  const prodHeroRef = useRef<HTMLDivElement>(null);
  const prodDiffRef = useRef<HTMLDivElement>(null);
  const prodHuileRef = useRef<HTMLDivElement>(null);
  const prodNoirRef = useRef<HTMLDivElement>(null);
  const prodCristalRef = useRef<HTMLDivElement>(null);
  const prodCoffretRef = useRef<HTMLDivElement>(null);

  // Text block refs (one per act)
  const textHeroRef = useRef<HTMLDivElement>(null);
  const textDiffRef = useRef<HTMLDivElement>(null);
  const textHuileRef = useRef<HTMLDivElement>(null);
  const textNoirRef = useRef<HTMLDivElement>(null);
  const textCristalRef = useRef<HTMLDivElement>(null);
  const textCoffretRef = useRef<HTMLDivElement>(null);

  // Individual thumbnail refs for Act 6 fly-in
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Gold glow element behind the crystal bottle
  const crystalGlowRef = useRef<HTMLDivElement>(null);

  // ── Responsive detection ────────────────────────────────────────────────────
  useEffect(() => {
    setIsClient(true);
    const check = () => setIsMobile(window.innerWidth < BREAKPOINTS.mobile);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── GSAP scroll-driven animation ───────────────────────────────────────────
  useEffect(() => {
    if (!isClient || isMobile || reduced) return;

    const outer = outerRef.current;
    const sticky = stickyRef.current;
    if (!outer || !sticky) return;

    /**
     * A single ScrollTrigger with scrub:true drives the entire journey.
     * Each frame callback receives progress ∈ [0, 1] and updates every layer.
     *
     * We deliberately avoid GSAP timelines here because we need non-linear,
     * overlapping act transitions — computing from raw progress gives us
     * more control over easing per layer.
     */
    const st = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,

      onUpdate: (self) => {
        const p = self.progress; // 0–1

        // ── Act progress values (smoothstepped for snappier crossfades) ────

        const a1 = smoothstep(actProgress(p, 0, 0.15));         // Hero
        const a1fade = smoothstep(actProgress(p, 0.10, 0.17));  // Hero fadeout

        const a2in  = smoothstep(actProgress(p, 0.13, 0.22));   // Diffuseur enter
        const a2out = smoothstep(actProgress(p, 0.25, 0.32));   // Diffuseur exit

        const a3in  = smoothstep(actProgress(p, 0.28, 0.37));
        const a3out = smoothstep(actProgress(p, 0.40, 0.47));

        const a4in  = smoothstep(actProgress(p, 0.43, 0.52));
        const a4out = smoothstep(actProgress(p, 0.55, 0.62));

        const a5in  = smoothstep(actProgress(p, 0.58, 0.67));
        const a5out = smoothstep(actProgress(p, 0.75, 0.82));

        const a6in  = smoothstep(actProgress(p, 0.78, 0.87));

        // ── Backgrounds ────────────────────────────────────────────────────

        // Hotel background: fade in with Act 2, fade out with Act 3
        if (bgHotelRef.current) {
          const opacity = Math.max(0, Math.min(1,
            a2in - a3in
          ));
          bgHotelRef.current.style.opacity = String(opacity);
        }

        // Spa background: fade in with Act 3, fade out with Act 4
        if (bgSpaRef.current) {
          const opacity = Math.max(0, Math.min(1,
            a3in - a4in
          ));
          bgSpaRef.current.style.opacity = String(opacity);
        }

        // Salon background: fade in with Act 4, fade out with Act 5
        if (bgSalonRef.current) {
          const opacity = Math.max(0, Math.min(1,
            a4in - a5in
          ));
          bgSalonRef.current.style.opacity = String(opacity);
        }

        // ── Golden Mist particles — fade out as backgrounds appear ─────────
        const mistEl = document.getElementById("golden-mist-wrapper");
        if (mistEl) {
          // Fully visible during Act 1, fades out as Act 2 begins
          const mistOpacity = Math.max(0, 1 - a2in * 2);
          mistEl.style.opacity = String(mistOpacity);
        }

        // ── Act 1: Hero collection ──────────────────────────────────────────
        if (prodHeroRef.current) {
          // Hero is visible from the start (opacity 1 at p=0), fades out as Act 2 enters
          const opacity = Math.max(0, 1 - a1fade);
          const scale = lerp(1, 1.05, a1fade);
          // Desaturation: starts greyscale at p=0, gains color as user scrolls the first 15%
          const saturation = lerp(20, 100, Math.min(1, p / 0.10));
          prodHeroRef.current.style.opacity = String(opacity);
          prodHeroRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
          prodHeroRef.current.style.filter = `saturate(${saturation}%)`;
        }

        if (textHeroRef.current) {
          // Text visible from start, fades out with hero
          const opacity = Math.max(0, 1 - a1fade * 1.5);
          const ty = lerp(0, -20, a1fade);
          textHeroRef.current.style.opacity = String(opacity);
          textHeroRef.current.style.transform = `translateY(${ty}px)`;
        }

        // ── Act 2: Diffuseur ────────────────────────────────────────────────
        if (prodDiffRef.current) {
          const opacity = Math.max(0, Math.min(1, a2in - a2out));
          // Enter from far right, settle at right side of viewport
          const txEnter = lerp(120, 0, a2in);
          const txExit  = lerp(0, -80, a2out);
          const tx = txEnter + txExit;
          const scale = lerp(0.82, 1, a2in);
          prodDiffRef.current.style.opacity = String(opacity);
          prodDiffRef.current.style.transform = `translate(calc(-50% + ${tx}px), -50%) scale(${scale})`;
        }

        if (textDiffRef.current) {
          const opacity = Math.max(0, Math.min(1, a2in - a2out * 1.5));
          const txEnter = lerp(-40, 0, a2in);
          textDiffRef.current.style.opacity = String(opacity);
          textDiffRef.current.style.transform = `translateX(${txEnter}px)`;
        }

        // ── Act 3: Huile Essentielle ────────────────────────────────────────
        if (prodHuileRef.current) {
          const opacity = Math.max(0, Math.min(1, a3in - a3out));
          const txEnter = lerp(-120, 0, a3in);
          const txExit  = lerp(0, 80, a3out);
          const tx = txEnter + txExit;
          const scale = lerp(0.82, 1, a3in);
          prodHuileRef.current.style.opacity = String(opacity);
          prodHuileRef.current.style.transform = `translate(calc(-50% + ${tx}px), -50%) scale(${scale})`;
        }

        if (textHuileRef.current) {
          const opacity = Math.max(0, Math.min(1, a3in - a3out * 1.5));
          const txEnter = lerp(40, 0, a3in);
          textHuileRef.current.style.opacity = String(opacity);
          textHuileRef.current.style.transform = `translateX(${txEnter}px)`;
        }

        // ── Act 4: Parfum Noir ──────────────────────────────────────────────
        if (prodNoirRef.current) {
          const opacity = Math.max(0, Math.min(1, a4in - a4out));
          const txEnter = lerp(120, 0, a4in);
          const txExit  = lerp(0, -80, a4out);
          const tx = txEnter + txExit;
          const scale = lerp(0.82, 1, a4in);
          prodNoirRef.current.style.opacity = String(opacity);
          prodNoirRef.current.style.transform = `translate(calc(-50% + ${tx}px), -50%) scale(${scale})`;
        }

        if (textNoirRef.current) {
          const opacity = Math.max(0, Math.min(1, a4in - a4out * 1.5));
          const txEnter = lerp(-40, 0, a4in);
          textNoirRef.current.style.opacity = String(opacity);
          textNoirRef.current.style.transform = `translateX(${txEnter}px)`;
        }

        // ── Act 5: Cristal ──────────────────────────────────────────────────
        if (prodCristalRef.current) {
          const opacity = Math.max(0, Math.min(1, a5in - a5out));
          // Enters centered from below, grows large
          const tyEnter = lerp(60, 0, a5in);
          const tyExit  = lerp(0, -40, a5out);
          const ty = tyEnter + tyExit;
          // Scale up to 1.1 at peak — fills more of the viewport
          const scale = lerp(0.72, 1.05, a5in) * lerp(1, 0.88, a5out);
          prodCristalRef.current.style.opacity = String(opacity);
          prodCristalRef.current.style.transform = `translate(-50%, calc(-50% + ${ty}px)) scale(${scale})`;
        }

        // Gold radial glow behind the crystal
        if (crystalGlowRef.current) {
          const opacity = Math.max(0, Math.min(0.55, a5in - a5out * 1.4));
          const scale = lerp(0.6, 1.2, a5in);
          crystalGlowRef.current.style.opacity = String(opacity);
          crystalGlowRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }

        if (textCristalRef.current) {
          const opacity = Math.max(0, Math.min(1, a5in - a5out * 1.5));
          const ty = lerp(30, 0, a5in);
          textCristalRef.current.style.opacity = String(opacity);
          textCristalRef.current.style.transform = `translateY(${ty}px)`;
        }

        // ── Act 6: Coffret ──────────────────────────────────────────────────
        if (prodCoffretRef.current) {
          const opacity = Math.min(1, a6in);
          const tyEnter = lerp(50, 0, a6in);
          const scale = lerp(0.85, 1, a6in);
          prodCoffretRef.current.style.opacity = String(opacity);
          prodCoffretRef.current.style.transform = `translate(-50%, calc(-50% + ${tyEnter}px)) scale(${scale})`;
        }

        if (textCoffretRef.current) {
          const opacity = Math.min(1, smoothstep(actProgress(p, 0.85, 0.94)));
          const ty = lerp(30, 0, smoothstep(actProgress(p, 0.85, 0.94)));
          textCoffretRef.current.style.opacity = String(opacity);
          textCoffretRef.current.style.transform = `translateY(${ty}px)`;
        }

        // Thumbnails fly towards the coffret center
        const thumbProgress = smoothstep(actProgress(p, 0.80, 0.92));
        thumbRefs.current.forEach((el, i) => {
          if (!el) return;
          // Each thumbnail starts at a different corner/edge and converges to center
          const angle = (i / THUMBNAIL_PRODUCTS.length) * Math.PI * 2 - Math.PI / 4;
          const startDist = 340;
          const tx = lerp(Math.cos(angle) * startDist, 0, thumbProgress);
          const ty = lerp(Math.sin(angle) * startDist, 0, thumbProgress);
          const scale = lerp(0.7, 0.22, thumbProgress);
          const opacity = thumbProgress < 0.85
            ? Math.min(1, thumbProgress * 3)
            : lerp(1, 0, (thumbProgress - 0.85) / 0.15);
          el.style.opacity = String(opacity);
          el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`;
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [isClient, isMobile, reduced]);

  // ── Server-side / before hydration: render nothing until we know the device
  if (!isClient) return null;

  // ── Mobile / reduced-motion fallback ────────────────────────────────────────
  if (isMobile || reduced) {
    return <MobileFallback />;
  }

  // ── Desktop cinematic scroll ────────────────────────────────────────────────

  return (
    /*
     * Outer section: 700vh tall — this creates the scroll distance.
     * The sticky inner div is what users actually see; it locks to the
     * viewport while scroll progress is consumed by the outer height.
     */
    <section
      ref={outerRef}
      id="histoire"
      style={{ height: "700vh", position: "relative" }}
      aria-label="Le Voyage d'un Parfum — exploration de la collection"
    >
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#000000",
        }}
      >
        {/* ── Background layer ─────────────────────────────────────────────── */}

        {/* Hotel background — Act 2 */}
        <div
          ref={bgHotelRef}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            transition: "none",
          }}
          aria-hidden="true"
        >
          <Image
            src="/images/experience/hotel.webp"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 100%)",
            }}
          />
        </div>

        {/* Spa background — Act 3 */}
        <div
          ref={bgSpaRef}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            transition: "none",
          }}
          aria-hidden="true"
        >
          <Image
            src="/images/experience/spa-01.webp"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(225deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.40) 100%)",
            }}
          />
        </div>

        {/* Salon luxe background — Act 4 */}
        <div
          ref={bgSalonRef}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            transition: "none",
          }}
          aria-hidden="true"
        >
          <Image
            src="/images/experience/salon-luxe-01.webp"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 100%)",
            }}
          />
        </div>

        {/* GoldenMist particles — visible during Act 1, fades as backgrounds appear */}
        <div
          id="golden-mist-wrapper"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            opacity: 1,
            transition: "none",
          }}
        >
          <GoldenMist />
        </div>

        {/* ── Gold glow for crystal bottle (Act 5) ──────────────────────── */}
        <div
          ref={crystalGlowRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) scale(0.6)",
            width: "60vmin",
            height: "60vmin",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,151,0,0.35) 0%, rgba(201,151,0,0.12) 40%, transparent 70%)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 2,
          }}
          aria-hidden="true"
        />

        {/* ── Product layer ─────────────────────────────────────────────────── */}

        {/* Act 1: collection-complete — centered */}
        <div
          ref={prodHeroRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) scale(1)",
            width: "clamp(280px, 48vw, 680px)",
            aspectRatio: "1400 / 943",
            opacity: 1,
            filter: "saturate(20%)",
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/images/products/collection-complete-v2.webp"
            alt="Collection complète Libellule Senteurs"
            fill
            sizes="(max-width: 1024px) 80vw, 680px"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Act 2: Diffuseur — right side */}
        <div
          ref={prodDiffRef}
          style={{
            position: "absolute",
            left: "62%",
            top: "50%",
            transform: "translate(calc(-50% + 120px), -50%) scale(0.82)",
            width: "clamp(160px, 22vw, 310px)",
            aspectRatio: "904 / 1400",
            opacity: 0,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/images/products/diffuseur-baguettes-v2.webp"
            alt="Diffuseur à bâtonnets Libellule Senteurs"
            fill
            sizes="(max-width: 1024px) 40vw, 310px"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Act 3: Huile Essentielle — left side */}
        <div
          ref={prodHuileRef}
          style={{
            position: "absolute",
            left: "38%",
            top: "50%",
            transform: "translate(calc(-50% - 120px), -50%) scale(0.82)",
            width: "clamp(130px, 18vw, 260px)",
            aspectRatio: "455 / 1200",
            opacity: 0,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/images/products/flacon-huile-essentielle-detour.webp"
            alt="Flacon d'huile essentielle Libellule Senteurs"
            fill
            sizes="(max-width: 1024px) 36vw, 260px"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Act 4: Parfum Noir — right side */}
        <div
          ref={prodNoirRef}
          style={{
            position: "absolute",
            left: "60%",
            top: "50%",
            transform: "translate(calc(-50% + 120px), -50%) scale(0.82)",
            width: "clamp(220px, 38vw, 520px)",
            aspectRatio: "1200 / 907",
            opacity: 0,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/images/products/parfum-noir-boite-detour.webp"
            alt="Parfum noir avec boîte Libellule Senteurs"
            fill
            sizes="(max-width: 1024px) 65vw, 520px"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Act 5: Cristal — centered, large */}
        <div
          ref={prodCristalRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, calc(-50% + 60px)) scale(0.72)",
            width: "clamp(200px, 32vw, 440px)",
            aspectRatio: "947 / 1200",
            opacity: 0,
            zIndex: 6, // above glow
            pointerEvents: "none",
          }}
        >
          <Image
            src="/images/products/parfum-cristal-detour.webp"
            alt="Parfum cristal Libellule Senteurs"
            fill
            sizes="(max-width: 1024px) 60vw, 440px"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Act 6: Coffret — centered */}
        <div
          ref={prodCoffretRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, calc(-50% + 50px)) scale(0.85)",
            width: "clamp(240px, 42vw, 580px)",
            aspectRatio: "1200 / 887",
            opacity: 0,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/images/products/coffret-ouvert.webp"
            alt="Coffret cadeau ouvert Libellule Senteurs"
            fill
            sizes="(max-width: 1024px) 70vw, 580px"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Act 6: thumbnails that fly toward the coffret */}
        {THUMBNAIL_PRODUCTS.map((thumb, i) => {
          // Starting positions: one per quadrant
          const angle = (i / THUMBNAIL_PRODUCTS.length) * Math.PI * 2 - Math.PI / 4;
          const startDist = 340;
          const initTx = Math.cos(angle) * startDist;
          const initTy = Math.sin(angle) * startDist;
          return (
            <div
              key={thumb.src}
              ref={(el) => { thumbRefs.current[i] = el; }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${initTx}px), calc(-50% + ${initTy}px)) scale(0.7)`,
                width: "clamp(80px, 14vw, 180px)",
                aspectRatio: i === 3 ? "947/1200" : i === 2 ? "1200/907" : "2/3",
                opacity: 0,
                zIndex: 7,
                pointerEvents: "none",
              }}
            >
              <Image
                src={thumb.src}
                alt={thumb.alt}
                fill
                sizes="180px"
                style={{ objectFit: "contain" }}
              />
            </div>
          );
        })}

        {/* ── Text layer ────────────────────────────────────────────────────── */}

        {/* Act 1: Hero — centered, visible from start */}
        <div
          ref={textHeroRef}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "12%",
            transform: "translateX(-50%) translateY(0)",
            textAlign: "center",
            opacity: 1,
            zIndex: 10,
            width: "clamp(280px, 60vw, 720px)",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.55rem, 0.8vw, 0.7rem)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#C99700",
              marginBottom: "1rem",
            }}
          >
            Libellule Senteurs
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem, 3.5vw, 3.2rem)",
              color: "#F8F8F8",
              lineHeight: 1.2,
              marginBottom: "0",
            }}
          >
            L&apos;essence du raffinement invisible
          </h1>
          {/* Decorative gold line */}
          <div
            style={{
              width: "3rem",
              height: "1px",
              backgroundColor: "#C99700",
              opacity: 0.5,
              marginInline: "auto",
              marginTop: "1.5rem",
            }}
          />
        </div>

        {/* Act 2: Diffuseur — left side */}
        <div
          ref={textDiffRef}
          style={{
            position: "absolute",
            left: "8%",
            top: "50%",
            transform: "translateY(-50%) translateX(-40px)",
            opacity: 0,
            zIndex: 10,
            maxWidth: "clamp(200px, 28vw, 380px)",
            pointerEvents: "none",
          }}
        >
          <ActTextBlock
            label="Le Diffuseur"
            title="Chaque espace mérite une signature olfactive"
            align="left"
          />
        </div>

        {/* Act 3: Huile — right side */}
        <div
          ref={textHuileRef}
          style={{
            position: "absolute",
            right: "8%",
            top: "50%",
            transform: "translateY(-50%) translateX(40px)",
            opacity: 0,
            zIndex: 10,
            maxWidth: "clamp(200px, 28vw, 380px)",
            textAlign: "right",
            pointerEvents: "none",
          }}
        >
          <ActTextBlock
            label="L'Huile Essentielle"
            title="Des essences pures, une sérénité absolue"
            align="right"
          />
        </div>

        {/* Act 4: Parfum Noir — left side */}
        <div
          ref={textNoirRef}
          style={{
            position: "absolute",
            left: "8%",
            top: "50%",
            transform: "translateY(-50%) translateX(-40px)",
            opacity: 0,
            zIndex: 10,
            maxWidth: "clamp(200px, 28vw, 380px)",
            pointerEvents: "none",
          }}
        >
          <ActTextBlock
            label="Le Parfum d'Ambiance"
            title="L'élégance dans chaque détail"
            align="left"
          />
        </div>

        {/* Act 5: Cristal — below product */}
        <div
          ref={textCristalRef}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "10%",
            transform: "translateX(-50%) translateY(30px)",
            textAlign: "center",
            opacity: 0,
            zIndex: 10,
            width: "clamp(260px, 50vw, 640px)",
            pointerEvents: "none",
          }}
        >
          <ActTextBlock
            label="Le Cristal"
            title="Au-delà du parfum, une expérience"
            align="center"
            titleSize="clamp(1.5rem, 3vw, 3rem)"
          />
        </div>

        {/* Act 6: Coffret — below product */}
        <div
          ref={textCoffretRef}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "8%",
            transform: "translateX(-50%) translateY(30px)",
            textAlign: "center",
            opacity: 0,
            zIndex: 10,
            width: "clamp(260px, 55vw, 680px)",
            pointerEvents: "none",
          }}
        >
          <ActTextBlock
            label="Le Coffret"
            title="Offrir Libellule Senteurs, c'est offrir une âme"
            align="center"
            titleSize="clamp(1.4rem, 2.8vw, 2.8rem)"
          />
          {/* CTA that appears at the very end of the journey */}
          <a
            href="#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2rem",
              paddingTop: "0.875rem",
              paddingBottom: "0.875rem",
              paddingInline: "2.5rem",
              border: "1px solid rgba(201,151,0,0.5)",
              color: "#C99700",
              fontFamily: "var(--font-body)",
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              textDecoration: "none",
              pointerEvents: "auto",
              transition: "background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease",
              cursor: "pointer",
              minHeight: "44px",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = "#C99700";
              el.style.color = "#000000";
              el.style.borderColor = "#C99700";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = "transparent";
              el.style.color = "#C99700";
              el.style.borderColor = "rgba(201,151,0,0.5)";
            }}
          >
            Découvrir la collection
          </a>
        </div>

        {/* ── Scroll indicator — fades out after first act ─────────────────── */}
        <ScrollIndicator />
      </div>
    </section>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Renders the label + title text block used in each act.
 * Factored out to avoid repeating identical JSX markup.
 */
function ActTextBlock({
  label,
  title,
  align,
  titleSize = "clamp(1.2rem, 2.4vw, 2.4rem)",
}: {
  label: string;
  title: string;
  align: "left" | "right" | "center";
  titleSize?: string;
}) {
  return (
    <>
      {label && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.58rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#C99700",
            marginBottom: "1rem",
          }}
        >
          {label}
        </p>
      )}
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: titleSize,
          color: "#F8F8F8",
          lineHeight: 1.22,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {/* Decorative accent line */}
      <div
        style={{
          width: "2.5rem",
          height: "1px",
          backgroundColor: "#C99700",
          opacity: 0.45,
          marginTop: "1.25rem",
          marginInline: align === "center" ? "auto" : align === "right" ? "0 0 0 auto" : "0",
          ...(align === "right" ? { marginLeft: "auto", marginRight: 0 } : {}),
        }}
      />
    </>
  );
}

/**
 * Animated scroll-down chevron.
 * Uses CSS animation only (no GSAP) — it's decorative and should work
 * even before the ScrollTrigger is initialised.
 */
function ScrollIndicator() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "2.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 15,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        pointerEvents: "none",
        animation: "scrollFade 3s ease-out 2.5s both",
      }}
      aria-hidden="true"
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.55rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(248,248,248,0.35)",
        }}
      >
        Défiler
      </span>
      <svg
        viewBox="0 0 20 30"
        fill="none"
        stroke="rgba(201,151,0,0.5)"
        strokeWidth="1"
        style={{ width: "1.2rem", height: "1.8rem", animation: "scrollBounce 1.8s ease-in-out infinite" }}
      >
        <rect x="6" y="1" width="8" height="18" rx="4" />
        <line x1="10" y1="5" x2="10" y2="9" strokeLinecap="round" />
        <path d="M5 26 L10 30 L15 26" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <style>{`
        @keyframes scrollFade {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          20%  { opacity: 1; transform: translateX(-50%) translateY(0); }
          80%  { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
}
