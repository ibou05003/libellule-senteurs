"use client";

import { useState, useCallback } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import LoadingScreen from "@/components/layout/LoadingScreen";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import HeroConvergence from "@/components/sections/HeroConvergence";
import Tagline from "@/components/sections/Tagline";
import ProductSection from "@/components/sections/ProductSection";
import AmbianceVideo from "@/components/sections/AmbianceVideo";
import ProductDuo from "@/components/sections/ProductDuo";
import BrandMarquee from "@/components/sections/BrandMarquee";
import ValuesCounters from "@/components/sections/ValuesCounters";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useSmoothScroll();

  const handleLoadingComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleLoadingComplete} />}
      <CustomCursor />
      <Navigation />

      <main>
        {/* ══════════════════════════════════════════════
            TOP NOTES — First Impression (Dark)
            ══════════════════════════════════════════════ */}

        {/* 1. Hero — Brand reveal + collection photo reveal */}
        <HeroConvergence />

        {/* 2. Philosophy — Different text than hero, brand story */}
        <Tagline text="Chaque espace a une âme — nous lui donnons une voix" />

        {/* ══════════════════════════════════════════════
            HEART NOTES — The Experience (Light/Dark alternance)
            ══════════════════════════════════════════════ */}

        {/* 3. Diffuseur — Star product, full treatment, light */}
        <ProductSection
          id="diffuseur"
          label="Le Diffuseur"
          title="Chaque espace mérite une signature olfactive"
          description="Nos bâtonnets en bois naturel diffusent lentement un sillage délicat qui transforme chaque pièce en sanctuaire de sérénité."
          imageSrc="/images/products/diffuseur-baguettes-v2.png"
          imageAlt="Diffuseur à bâtonnets Libellule Senteurs"
          imageAspect="904/1400"
          imageSide="right"
          theme="light"
        />

        {/* 4. Ambiance Video — Immersive scroll-driven canvas */}
        <AmbianceVideo />

        {/* 5. Bougie + Huile — Duo on light background */}
        <ProductDuo
          theme="light"
          products={[
            {
              id: "bougie",
              label: "La Bougie",
              title: "Une flamme, mille sensations",
              description: "La cire fond doucement, libérant des notes soigneusement composées qui enveloppent votre intérieur.",
              imageSrc: "/images/products/bougie-sans-marque.webp",
              imageAlt: "Bougie parfumée Libellule Senteurs",
              imageAspect: "3/2",
            },
            {
              id: "huile",
              label: "L'Huile Essentielle",
              title: "Des essences pures, une sérénité absolue",
              description: "Extraites avec soin, nos huiles capturent la quintessence de chaque plante pour une aromathérapie d'exception.",
              imageSrc: "/images/products/flacon-huile-essentielle-detour.webp",
              imageAlt: "Flacon d'huile essentielle Libellule Senteurs",
              imageAspect: "3/4",
            },
          ]}
        />

        {/* ══════════════════════════════════════════════
            BASE NOTES — Lasting Impression (Dark)
            ══════════════════════════════════════════════ */}

        {/* 6. Marquee — Double-line brand scroll */}
        <BrandMarquee />

        {/* 7. Parfum Noir — Dark elegance */}
        <ProductSection
          id="parfum-noir"
          label="Le Parfum d'Ambiance"
          title="L'élégance dans chaque détail"
          description="Un parfum d'ambiance raffiné, présenté dans un écrin noir qui allie sophistication et caractère."
          imageSrc="/images/products/parfum-noir-boite-detour.webp"
          imageAlt="Parfum noir avec boîte Libellule Senteurs"
          imageAspect="800/1000"
          imageSide="left"
          theme="dark"
        />

        {/* 8. Values — Brand DNA */}
        <ValuesCounters />

        {/* 9. Cristal — Climax, centered, dramatic */}
        <ProductSection
          id="cristal"
          label="Le Cristal"
          title="Au-delà du parfum, une expérience"
          description="Le flacon cristal incarne la pureté de nos créations — un objet précieux qui sublime chaque intérieur."
          imageSrc="/images/products/parfum-cristal-detour.webp"
          imageAlt="Parfum cristal Libellule Senteurs"
          imageAspect="600/1000"
          imageSide="center"
          theme="dark"
        />

        {/* 10. Contact */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
