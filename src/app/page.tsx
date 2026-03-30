"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import HeroConvergence from "@/components/sections/HeroConvergence";
import Tagline from "@/components/sections/Tagline";
import ProductSection from "@/components/sections/ProductSection";
import AmbianceVideo from "@/components/sections/AmbianceVideo";
import ProductDuo from "@/components/sections/ProductDuo";
import NotreHistoire from "@/components/sections/NotreHistoire";
import CollectionGrid from "@/components/sections/CollectionGrid";
import BrandMarquee from "@/components/sections/BrandMarquee";
import ValuesCounters from "@/components/sections/ValuesCounters";
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
        {/* ══════════════════════════════════════════════
            TOP NOTES — First Impression (Dark)
            ══════════════════════════════════════════════ */}

        {/* 1. Hero — Brand reveal + collection photo reveal */}
        <HeroConvergence />

        {/* 2. Philosophy — Brand story word-by-word */}
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
            STORY + COLLECTION
            ══════════════════════════════════════════════ */}

        {/* 6. Notre Histoire — Brand storytelling */}
        <NotreHistoire />

        {/* 7. Collection — Product overview grid */}
        <CollectionGrid />

        {/* ══════════════════════════════════════════════
            BASE NOTES — Lasting Impression (Dark)
            ══════════════════════════════════════════════ */}

        {/* 8. Marquee — Double-line brand scroll */}
        <BrandMarquee />

        {/* 9. Parfum Noir — Dark elegance */}
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

        {/* 10. Values — Brand DNA */}
        <ValuesCounters />

        {/* 11. Cristal — Climax, centered, dramatic */}
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

        {/* 12. Contact — Functional form */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
