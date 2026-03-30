"use client";

import { useCallback, useRef } from "react";
import ScrollCanvas from "@/components/animations/ScrollCanvas";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";

export default function AmbianceVideo() {
  const reducedMotion = useReducedMotion();
  const textRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  const framePath = useCallback(
    (i: number) => `/frames/ambiance/frame_${String(i).padStart(4, "0")}.webp`,
    []
  );

  const handleProgress = useCallback((p: number) => {
    // Text fades in mid-scroll, then out
    if (textRef.current) {
      let opacity = 0;
      if (p > 0.35 && p < 0.75) {
        opacity = Math.min(1, (p - 0.35) / 0.15);
      } else if (p >= 0.75) {
        opacity = Math.max(0, 1 - (p - 0.75) / 0.15);
      }
      textRef.current.style.opacity = String(opacity);
      textRef.current.style.transform = `translateY(${10 * (1 - opacity)}px)`;
    }

    // Vignette
    if (vignetteRef.current) {
      const vigP = Math.min(1, p / 0.3);
      vignetteRef.current.style.opacity = String(0.3 + 0.4 * vigP);
    }
  }, []);

  if (reducedMotion) {
    return (
      <section id="ambiance" className="relative h-screen">
        <Image
          src="/frames/ambiance/frame_0060.webp"
          alt="Diffuseur dans un hôtel de luxe"
          fill
          style={{ objectFit: "cover" }}
        />
      </section>
    );
  }

  return (
    <div id="ambiance">
    <ScrollCanvas
      frameCount={121}
      framePath={framePath}
      scrollHeight="250vh"
      onProgress={handleProgress}
    >
      {/* Cinematic vignette */}
      <div
        ref={vignetteRef}
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.3,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Overlay text */}
      <div
        ref={textRef}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <div className="text-center">
          <p className="font-heading text-xs uppercase tracking-[0.4em] text-or-luxe">
            Une expérience sensorielle
          </p>
          <h2 className="mt-4 font-heading text-xl leading-tight text-blanc-casse md:text-3xl lg:text-5xl">
            Le parfum qui habite
            <br />
            vos espaces
          </h2>
        </div>
      </div>
    </ScrollCanvas>
    </div>
  );
}
