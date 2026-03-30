"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HeroStatic from "@/components/sections/HeroStatic";
import AmbianceVideo from "@/components/sections/AmbianceVideo";
import CollectionShowcase from "@/components/sections/CollectionShowcase";
import Univers from "@/components/sections/Univers";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  useSmoothScroll();

  return (
    <>
      <CustomCursor />
      <Navigation />
      <WhatsAppButton />

      <main>
        {/* 1. Hero — static, immediate impact */}
        <HeroStatic />

        {/* 2. Ambiance Canvas — the single scroll-driven showcase */}
        <AmbianceVideo />

        {/* 3. Collection — 3 product blocks, scroll normal */}
        <CollectionShowcase />

        {/* 4. Univers — story + experience carousel + values */}
        <Univers />

        {/* 5. Contact — form + WhatsApp */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
