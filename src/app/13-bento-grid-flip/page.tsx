"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";

// Register Flip plugin
gsap.registerPlugin(useGSAP, Flip);

interface BentoItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  defaultClass: string;
  activeClass: string;
  color: string;
}

export default function BentoGridFlipPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const bentoItems: BentoItem[] = [
    {
      id: 1,
      title: "Core Mechanics",
      subtitle: "STATS MONITOR",
      description: "Optimized and virtualized event pipelines running at 60fps. Handles complex coordinate transforms, collision grids, and bounding check trees dynamically.",
      defaultClass: "col-span-1 md:col-span-2 row-span-1 h-48",
      activeClass: "col-span-1 md:col-span-3 row-span-2 h-96",
      color: "bg-wtf-orange text-white",
    },
    {
      id: 2,
      title: "Design System",
      subtitle: "UI TOKENS",
      description: "Full customization and CSS custom property sync. Neo-Brutalist utility layers, interactive variables, and asymmetric structural skews.",
      defaultClass: "col-span-1 row-span-1 md:row-span-2 h-48 md:h-102",
      activeClass: "col-span-1 md:col-span-3 row-span-2 h-96",
      color: "bg-wtf-green text-white",
    },
    {
      id: 3,
      title: "Velocity Engine",
      subtitle: "SCROLL DETECTOR",
      description: "Inertia metrics reading delta inputs to drive canvas rendering. Auto-clamps bounds to maximize frames.",
      defaultClass: "col-span-1 row-span-1 h-48",
      activeClass: "col-span-1 md:col-span-3 row-span-2 h-96",
      color: "bg-wtf-yellow text-black",
    },
    {
      id: 4,
      title: "Elastic Cursor",
      subtitle: "LAGGING RETICLE",
      description: "Dual-coordinate pointer smoothing with custom elasticity weights. Morphing boundaries snap to hover nodes.",
      defaultClass: "col-span-1 row-span-1 h-48",
      activeClass: "col-span-1 md:col-span-3 row-span-2 h-96",
      color: "bg-wtf-purple text-white",
    },
    {
      id: 5,
      title: "Morphing Accordions",
      subtitle: "STAGGER DETAIL",
      description: "Color transitions driven by background morph targets. Inner elements unfold using autoAlpha spring tweens.",
      defaultClass: "col-span-1 md:col-span-2 row-span-1 h-48",
      activeClass: "col-span-1 md:col-span-3 row-span-2 h-96",
      color: "bg-wtf-blue text-white",
    },
  ];

  const flipStateRef = useRef<any>(null);

  useGSAP(() => {
    if (!flipStateRef.current) return;

    Flip.from(flipStateRef.current, {
      duration: 0.7,
      ease: "power3.inOut",
      absolute: true,
      nested: true,
    });

    flipStateRef.current = null;
  }, { dependencies: [activeCardId], scope: containerRef });

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleCardClick = contextSafe((id: number) => {
    // 1. Get Flip state
    flipStateRef.current = Flip.getState(".bento-card", {
      props: "box-shadow,transform",
      simple: true,
    });

    // 2. Change layout state
    setActiveCardId(activeCardId === id ? null : id);
  });

  return (
    <div
      className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-between p-8 selection:bg-wtf-yellow selection:text-black overflow-x-hidden"
      ref={containerRef}
    >
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      {/* Header Info */}
      <header className="z-10 w-full max-w-2xl text-center flex flex-col gap-4 mt-8">
        <div className="inline-flex self-center items-center gap-2 bg-wtf-green border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
          <span>Component 13</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-[#2a2a2a] leading-none">
          Bento Grid Expansion
        </h1>
        <p className="max-w-md mx-auto text-zinc-700 text-sm leading-relaxed font-sans font-medium">
          Click any card inside the Bento box grid. GSAP's Flip plugin will interpolate layout shifts and re-arrange items smoothly.
        </p>
      </header>

      {/* Bento Grid Area */}
      <main className="z-10 w-full max-w-4xl my-12 flex flex-col gap-4">
        {activeCardId && (
          <div className="flex justify-end">
            <button
              onClick={() => handleCardClick(activeCardId)}
              className="brutalist-btn bg-white text-xs font-mono font-bold py-2 px-4 rounded-md uppercase cursor-pointer"
            >
              Close Expand Mode ×
            </button>
          </div>
        )}

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto"
        >
          {bentoItems.map((item) => {
            const isActive = activeCardId === item.id;
            const isAnyActive = activeCardId !== null;
            const itemClass = isActive
              ? item.activeClass
              : isAnyActive
              ? `${item.defaultClass} opacity-30 scale-95 pointer-events-none`
              : item.defaultClass;

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                className={`bento-card brutalist-card p-6 bg-white flex flex-col justify-between cursor-pointer overflow-hidden ${itemClass}`}
                style={{ contentVisibility: "auto" }}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">
                      [{item.subtitle}]
                    </span>
                    <span
                      className={`inline-block border-2 border-[#2a2a2a] px-2.5 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase shadow-[1px_1px_0px_#2a2a2a] ${item.color}`}
                    >
                      {isActive ? "ACTIVE HERO" : "CLICK TO EXPAND"}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-black uppercase tracking-tight text-[#2a2a2a]">
                    {item.title}
                  </h2>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <p
                    className={`font-sans font-medium text-zinc-700 leading-relaxed transition-all duration-300 ${
                      isActive ? "text-sm md:text-base max-w-2xl" : "text-xs line-clamp-2"
                    }`}
                  >
                    {item.description}
                  </p>

                  {isActive && (
                    <div className="flex gap-4 border-t-2 border-[#2a2a2a] pt-4 mt-2">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[8px] text-zinc-400">FPS CAPABILITY</span>
                        <span className="font-mono text-xs font-bold text-wtf-green">60 FPS METRICS</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[8px] text-zinc-400">ANIMATION LAYER</span>
                        <span className="font-mono text-xs font-bold text-wtf-purple">GSAP FLIP v3</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[8px] text-zinc-400">INTERACTIVE STATUS</span>
                        <span className="font-mono text-xs font-bold text-wtf-orange">REUSABLE CONTAINER</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer link */}
      <footer className="z-10 mb-8">
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-xs py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer">
            ← Dashboard
          </button>
        </Link>
      </footer>
    </div>
  );
}
