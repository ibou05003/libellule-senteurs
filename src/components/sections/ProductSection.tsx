"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ProductSectionProps {
  id: string;
  label: string;
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  imageAspect?: string;
  imageSide?: "left" | "right" | "center";
  theme?: "light" | "dark";
}

export default function ProductSection({
  id,
  label,
  title,
  description,
  imageSrc,
  imageAlt,
  imageAspect = "3/4",
  imageSide = "right",
  theme = "dark",
}: ProductSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    if (!section || !image || !text) return;

    // Parallax: image moves slower than scroll
    const parallax = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const yShift = (self.progress - 0.5) * -40;
        image.style.transform = `translateY(${yShift}px)`;
      },
    });

    // Entrance animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "top 30%",
        scrub: 1,
      },
    });

    tl.fromTo(image, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1 });

    if (labelRef.current) {
      tl.fromTo(labelRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 }, 0.15);
    }
    if (lineRef.current) {
      tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, 0.2);
    }
    tl.fromTo(text, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.25);

    return () => {
      parallax.kill();
      tl.kill();
    };
  }, [reducedMotion]);

  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-noir-profond" : "bg-blanc-casse";
  const textColor = isDark ? "text-blanc-casse" : "text-noir-profond";
  const subTextColor = isDark ? "text-blanc-casse/60" : "text-noir-profond/60";
  const lineColor = isDark ? "bg-or-luxe/60" : "bg-or-luxe";
  const isCentered = imageSide === "center";

  if (isCentered) {
    return (
      <section
        id={id}
        ref={sectionRef}
        className={`relative flex min-h-screen flex-col items-center justify-center ${bgClass} px-4 py-20 md:px-8 md:py-32`}
      >
        <div
          ref={imageRef}
          className="relative w-full max-w-xs md:max-w-sm lg:max-w-md"
          style={{ aspectRatio: imageAspect }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 80vw, 400px"
          />
          {/* Subtle glow behind centered products */}
          <div
            className="absolute inset-0 -z-10 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(201,151,0,0.08) 0%, transparent 70%)" }}
          />
        </div>
        <div ref={textRef} className="mt-16 text-center">
          <p ref={labelRef} className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe">
            {label}
          </p>
          <div ref={lineRef} className={`mx-auto my-4 h-px w-16 ${lineColor}`} style={{ transformOrigin: "center" }} />
          <h2 className={`font-heading text-2xl leading-tight md:text-4xl lg:text-5xl ${textColor}`}>{title}</h2>
          {description && <p className={`mx-auto mt-5 max-w-lg font-body text-lg leading-relaxed ${subTextColor}`}>{description}</p>}
        </div>
      </section>
    );
  }

  const isLeft = imageSide === "left";

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative flex min-h-screen items-center overflow-hidden ${bgClass} px-4 py-20 md:px-12 md:py-24 lg:px-20`}
    >
      <div className={`flex w-full flex-col gap-8 md:gap-12 md:flex-row md:items-center lg:gap-16 ${isLeft ? "" : "md:flex-row-reverse"}`}>
        {/* Image with parallax */}
        <div className="relative w-full md:w-1/2">
          <div ref={imageRef} className="relative mx-auto w-full max-w-lg" style={{ aspectRatio: imageAspect }}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 90vw, 45vw"
            />
          </div>
        </div>

        {/* Text block */}
        <div ref={textRef} className={`w-full md:w-1/2 ${isLeft ? "md:pl-8 lg:pl-16" : "md:pr-8 lg:pr-16"}`}>
          <p ref={labelRef} className="font-heading text-xs uppercase tracking-[0.3em] text-or-luxe">
            {label}
          </p>
          <div ref={lineRef} className={`my-4 h-px w-12 ${lineColor}`} style={{ transformOrigin: "left" }} />
          <h2 className={`font-heading text-2xl leading-tight md:text-3xl lg:text-5xl ${textColor}`}>
            {title}
          </h2>
          {description && (
            <p className={`mt-6 max-w-md font-body text-lg leading-relaxed ${subTextColor}`}>
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
