"use client";

import React, { useEffect, useRef } from "react";

/**
 * HeroAmbientCanvas
 * Animation cinétique fluide d'ondes et géométries monochromes (inspiré de WheelOfWork).
 * Donne vie au hero en noir et blanc pur, 60fps, respectueux de prefers-reduced-motion.
 */
export default function HeroAmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    let t = 0;
    const linesCount = 14;

    const render = () => {
      t += 0.004;
      ctx.clearRect(0, 0, width, height);

      // Fond transparent noir
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1;

      for (let i = 0; i < linesCount; i++) {
        ctx.beginPath();
        const yOffset = (height / (linesCount + 1)) * (i + 1);
        const opacity = 0.04 + (i % 3 === 0 ? 0.05 : 0.02);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;

        for (let x = 0; x <= width; x += 30) {
          const wave1 = Math.sin(x * 0.003 + t + i * 0.4) * 45;
          const wave2 = Math.cos(x * 0.002 - t * 0.8 + i * 0.2) * 25;
          const y = yOffset + wave1 + wave2;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-60"
      />
      {/* Vignette radiale noire pour fondre les contours avec l'arrière-plan */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_85%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#000000]" />
    </div>
  );
}

