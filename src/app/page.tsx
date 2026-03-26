"use client";

import { useState, useCallback } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import LoadingScreen from "@/components/layout/LoadingScreen";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ProductMorph from "@/components/sections/ProductMorph";

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

        <section id="morph">
          <ProductMorph />
        </section>

        <section id="histoire" className="min-h-screen bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Notre Histoire — à venir</p>
        </section>

        <section id="valeurs" className="min-h-screen bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Valeurs — à venir</p>
        </section>

        <section id="collection" className="min-h-screen bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Collection — à venir</p>
        </section>

        <section id="experience" className="min-h-screen bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Expérience — à venir</p>
        </section>

        <section id="contact" className="min-h-screen bg-noir-profond flex items-center justify-center">
          <p className="text-or-luxe font-heading text-3xl">Contact — à venir</p>
        </section>
      </main>

      <Footer />
    </>
  );
}
