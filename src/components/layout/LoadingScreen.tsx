"use client";

import { useState, useEffect } from "react";
import { LOADING_SCREEN } from "@/lib/constants";

type LoadingScreenProps = {
  onComplete: () => void;
};

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"drawing" | "revealing" | "done">("drawing");

  useEffect(() => {
    // drawDuration: time to let the SVG stroke animation finish before fading
    const drawTimer = setTimeout(() => setPhase("revealing"), LOADING_SCREEN.drawDuration);
    // totalDuration: draw + fade — after this the overlay is invisible and can unmount
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, LOADING_SCREEN.totalDuration);

    return () => {
      clearTimeout(drawTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-noir-profond"
      style={{
        opacity: phase === "revealing" ? 0 : 1,
        transition: "opacity 0.8s ease-out",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-32 h-32"
        fill="none"
        stroke="#C99700"
        strokeWidth="1.5"
      >
        {/* Circle */}
        <circle
          cx="100"
          cy="100"
          r="80"
          className="loading-draw"
          style={{ animationDelay: "0s" }}
        />
        {/* Simplified dragonfly wing left */}
        <path
          d="M100 100 Q60 60 80 30 Q100 50 100 100"
          className="loading-draw"
          style={{ animationDelay: "0.5s" }}
        />
        {/* Wing right */}
        <path
          d="M100 100 Q140 60 120 30 Q100 50 100 100"
          className="loading-draw"
          style={{ animationDelay: "0.8s" }}
        />
        {/* Body */}
        <path
          d="M100 100 L100 150"
          className="loading-draw"
          style={{ animationDelay: "1.1s" }}
        />
      </svg>

      {/* Progress bar — scaleX animates on the compositor thread (no layout) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-px bg-blanc-casse/20 overflow-hidden">
        <div
          className="h-full w-full bg-or-luxe origin-left"
          style={{
            animation: "loading-progress 2s ease-out forwards",
          }}
        />
      </div>
    </div>
  );
}
