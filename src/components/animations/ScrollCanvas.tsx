"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollCanvasProps {
  frameCount: number;
  framePath: (index: number) => string;
  scrollHeight?: string;
  className?: string;
  children?: ReactNode;
  onProgress?: (progress: number) => void;
}

export default function ScrollCanvas({
  frameCount,
  framePath,
  scrollHeight = "600vh",
  className = "",
  children,
  onProgress,
}: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function render() {
      if (!ctx || !canvas) return;
      const img = imagesRef.current[currentFrameRef.current];
      if (!img || !img.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
      );
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;

      ctx.drawImage(img, x, y, w, h);
    }

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    // Progressive frame loading: load first frame immediately,
    // then batch-load nearby frames as scroll progresses
    const images: HTMLImageElement[] = new Array(frameCount);
    const loaded = new Set<number>();

    function loadFrame(index: number) {
      if (loaded.has(index) || index < 0 || index >= frameCount) return;
      loaded.add(index);
      const img = new Image();
      img.src = framePath(index + 1); // 1-indexed paths
      img.onload = () => {
        if (index === 0) render();
      };
      images[index] = img;
    }

    // Load first 5 frames immediately
    for (let i = 0; i < Math.min(5, frameCount); i++) {
      loadFrame(i);
    }
    imagesRef.current = images;

    // Load frames around current position
    function loadNearby(frameIndex: number) {
      for (let offset = -3; offset <= 10; offset++) {
        loadFrame(frameIndex + offset);
      }
    }

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(self.progress * frameCount)
        );
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          loadNearby(frameIndex);
          render();
        }
        onProgress?.(self.progress);
      },
    });

    // Preload all remaining frames after initial render
    requestAnimationFrame(() => {
      for (let i = 5; i < frameCount; i++) {
        loadFrame(i);
      }
    });

    resize();
    window.addEventListener("resize", resize);

    return () => {
      st.kill();
      window.removeEventListener("resize", resize);
    };
  }, [frameCount, framePath, onProgress]);

  return (
    <div ref={containerRef} style={{ height: scrollHeight }} className={`relative ${className}`}>
      <div className="sticky top-0 h-screen w-full">
        <canvas ref={canvasRef} className="h-full w-full" />
        {/* Overlay children render on top of the canvas */}
        {children}
      </div>
    </div>
  );
}
