"use client";

import { useState, useCallback } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import LoadingScreen from "@/components/layout/LoadingScreen";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ProductMorph from "@/components/sections/ProductMorph";
import Storytelling from "@/components/sections/Storytelling";
import Values from "@/components/sections/Values";
import Collection from "@/components/sections/Collection";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Marquee from "@/components/ui/Marquee";

/**
 * Thin gold horizontal rule used as a decorative section divider.
 * Kept as a module-level component (not exported) because it is only
 * consumed here. The opacity keeps it subtle — present but not distracting.
 */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-16 h-px bg-or-luxe/30" />
    </div>
  );
}

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
        <Hero />

        {/* Gold rule anchors the transition from the cinematic hero to the
            product showcase — keeps the eye moving downward gracefully. */}
        <GoldDivider />

        <section id="morph">
          <ProductMorph />
        </section>

        <Storytelling />

        {/* Gold rule before Values creates a breath between the narrative and
            the brand pillars, reinforcing the editorial pacing of the page. */}
        <GoldDivider />

        <Values />

        {/* Fragrance-ingredient marquee acts as a scented pause between the
            brand values and the product catalogue. */}
        <Marquee
          items={[
            "Ambre",
            "Jasmin",
            "Oud",
            "Rose de Damas",
            "Santal",
            "Bergamote",
            "Ylang-Ylang",
            "Vétiver",
          ]}
          speed={30}
        />

        <Collection />

        {/* Sensory-quality marquee bridges the product grid and the
            immersive experience section, echoing the brand language. */}
        <Marquee
          items={["Élégance", "Raffinement", "Nature", "Sérénité", "Luxe", "Harmonie"]}
          speed={25}
        />

        <Experience />

        <Contact />
      </main>

      <Footer />
    </>
  );
}
