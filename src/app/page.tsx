"use client";

import { useState, useCallback } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import LoadingScreen from "@/components/layout/LoadingScreen";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import CinematicScroll from "@/components/sections/CinematicScroll";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useSmoothScroll();

  return (
    <>
      {!loaded && <LoadingScreen onComplete={useCallback(() => setLoaded(true), [])} />}
      <CustomCursor />
      <Navigation />

      <main>
        <CinematicScroll />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
