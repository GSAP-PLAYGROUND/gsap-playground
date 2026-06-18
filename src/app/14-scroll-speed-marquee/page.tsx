"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ScrollSpeedMarqueePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for the three marquee timelines
  const tl1Ref = useRef<gsap.core.Tween | null>(null);
  const tl2Ref = useRef<gsap.core.Tween | null>(null);
  const tl3Ref = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    // 1. Create the infinite scrolling timelines
    // Marquee 1 (scrolling left)
    tl1Ref.current = gsap.to(".marquee-inner-1", {
      xPercent: -50,
      ease: "none",
      duration: 15,
      repeat: -1,
    });

    // Marquee 2 (scrolling right)
    gsap.set(".marquee-inner-2", { xPercent: -50 });
    tl2Ref.current = gsap.to(".marquee-inner-2", {
      xPercent: 0,
      ease: "none",
      duration: 18,
      repeat: -1,
    });

    // Marquee 3 (scrolling left)
    tl3Ref.current = gsap.to(".marquee-inner-3", {
      xPercent: -50,
      ease: "none",
      duration: 12,
      repeat: -1,
    });

    // 2. Create ScrollTrigger to monitor scroll velocity and direction
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const velocity = self.getVelocity(); // pixels per second
        const scrollDir = self.direction; // 1 = down/forward, -1 = up/backward

        // Map velocity to a multiplier scale
        const speedMultiplier = 1 + Math.min(Math.abs(velocity) * 0.0025, 8);

        // Adjust direction: scrollDir is 1 when scrolling down, -1 when scrolling up.
        // We will make marquee 1 and 3 accelerate forward, and reverse if scrolling up.
        const scaleForward = speedMultiplier * scrollDir;
        // Marquee 2 runs opposite naturally, so we invert the scrollDir factor for it
        const scaleReverse = speedMultiplier * -scrollDir;

        // Smoothly update the timescale of each loop
        if (tl1Ref.current) {
          gsap.to(tl1Ref.current, {
            timeScale: scaleForward,
            duration: 0.4,
            overwrite: "auto",
          });
        }
        if (tl2Ref.current) {
          gsap.to(tl2Ref.current, {
            timeScale: scaleReverse,
            duration: 0.4,
            overwrite: "auto",
          });
        }
        if (tl3Ref.current) {
          gsap.to(tl3Ref.current, {
            timeScale: scaleForward,
            duration: 0.4,
            overwrite: "auto",
          });
        }
      },
    });

  }, { scope: containerRef });

  // Text scramble hover helper
  const handleTextHover = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.currentTarget;
    const originalText = target.getAttribute("data-original") || target.innerText;
    if (!target.getAttribute("data-original")) {
      target.setAttribute("data-original", originalText);
    }

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*";
    let iterations = 0;
    
    const interval = setInterval(() => {
      target.innerText = originalText
        .split("")
        .map((char, index) => {
          if (char === " " || char === "•") return char;
          if (index < iterations) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      
      iterations += 1 / 3;
      if (iterations >= originalText.length) {
        clearInterval(interval);
        target.innerText = originalText;
      }
    }, 25);
  };

  const marqueeText1 = "CREATIVE CODING • GSAP ANIMATION • NEO-BRUTALISM • PERFORMANCE • ";
  const marqueeText2 = "FAST FRAMES • REACT NINETEEN • NEXT SIXTEEN • TACTILE DOCK • ";
  const marqueeText3 = "VELOCITY ENGINE • LAGGING RETICLE • SMOOTH LENIS • STAGGER DECAY • ";

  return (
    <div
      className="relative bg-[#f0eadf] text-[#2a2a2a] selection:bg-wtf-yellow selection:text-black"
      ref={containerRef}
    >
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />

      {/* Intro Hero Area */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 gap-4 z-10 relative">
        <div className="inline-flex items-center gap-2 bg-wtf-yellow border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-black uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
          <span>Component 14</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-black uppercase max-w-3xl leading-[1.05] text-[#2a2a2a]">
          Scroll-Velocity Marquee
        </h1>
        <p className="max-w-md mx-auto text-zinc-700 text-sm leading-relaxed font-sans font-medium">
          Start scrolling down. The infinite text bands will accelerate, decelerate, and reverse direction based on your scroll velocity. Hover over the words to trigger a character scramble.
        </p>
        <p className="font-mono text-xs text-wtf-orange uppercase tracking-widest animate-bounce mt-8 font-bold">
          ↓ Scroll Down to test Velocity ↓
        </p>
      </section>

      {/* Marquee Bands Container */}
      <section className="py-20 bg-white border-y-4 border-[#2a2a2a] flex flex-col gap-8 overflow-hidden relative">
        <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-400">VELOCITY TICKER SPACE</div>

        {/* Marquee 1 */}
        <div className="w-full border-y-3 border-[#2a2a2a] bg-wtf-orange py-4 rotate-1 shadow-[4px_4px_0px_#2a2a2a] overflow-hidden flex whitespace-nowrap">
          <div className="marquee-inner-1 flex whitespace-nowrap will-change-transform font-serif font-black text-2xl md:text-4xl text-white uppercase select-none">
            <span onMouseEnter={handleTextHover} className="cursor-default px-4">{marqueeText1}</span>
            <span onMouseEnter={handleTextHover} className="cursor-default px-4">{marqueeText1}</span>
          </div>
        </div>

        {/* Marquee 2 */}
        <div className="w-full border-y-3 border-[#2a2a2a] bg-wtf-purple py-4 -rotate-1 shadow-[-4px_4px_0px_#2a2a2a] overflow-hidden flex whitespace-nowrap">
          <div className="marquee-inner-2 flex whitespace-nowrap will-change-transform font-serif font-black text-2xl md:text-4xl text-white uppercase select-none">
            <span onMouseEnter={handleTextHover} className="cursor-default px-4">{marqueeText2}</span>
            <span onMouseEnter={handleTextHover} className="cursor-default px-4">{marqueeText2}</span>
          </div>
        </div>

        {/* Marquee 3 */}
        <div className="w-full border-y-3 border-[#2a2a2a] bg-wtf-yellow py-4 rotate-0.5 shadow-[4px_4px_0px_#2a2a2a] overflow-hidden flex whitespace-nowrap">
          <div className="marquee-inner-3 flex whitespace-nowrap will-change-transform font-serif font-black text-2xl md:text-4xl text-black uppercase select-none">
            <span onMouseEnter={handleTextHover} className="cursor-default px-4">{marqueeText3}</span>
            <span onMouseEnter={handleTextHover} className="cursor-default px-4">{marqueeText3}</span>
          </div>
        </div>
      </section>

      {/* Extra Scroll Height to demonstrate velocity */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center p-8 gap-6 z-10 relative">
        <h2 className="text-3xl font-serif font-black uppercase text-[#2a2a2a]">
          Velocity Easing Completed
        </h2>
        <p className="max-w-md text-zinc-650 text-sm font-sans font-medium leading-relaxed">
          When you stop scrolling, the tickers gently ease back to their baseline speeds using GSAP's transition overwrite system.
        </p>
        <Link href="/">
          <button className="brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-3 px-8 rounded-lg uppercase tracking-wider cursor-pointer">
            ← Back to Dashboard
          </button>
        </Link>
      </section>
    </div>
  );
}
