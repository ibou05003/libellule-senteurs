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
        <ProductMorph />
        <Storytelling />
        <Values />
        <Marquee
          items={["Ambre", "Jasmin", "Oud", "Rose de Damas", "Santal", "Bergamote", "Ylang-Ylang", "Vétiver"]}
          speed={35}
        />
        <Collection />
        <Marquee
          items={["Élégance", "Raffinement", "Nature", "Sérénité", "Luxe", "Harmonie"]}
          speed={28}
        />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
