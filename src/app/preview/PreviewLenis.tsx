"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";

export default function PreviewLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip Lenis in embed mode — programmatic scrollTop needs direct control
    if (new URLSearchParams(window.location.search).get("embed") === "true")
      return;

    gsap.registerPlugin(ScrollTrigger);

    const scroller = document.getElementById("main-scroller");
    if (!scroller) return;

    scroller.scrollTop = 0;

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller,
      eventsTarget: scroller,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.3,
    });

    lenisRef.current = lenis;

    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);

    const gsapTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTick);
    gsap.ticker.lagSmoothing(0);

    // Recalculate after content finishes rendering
    const resizeTimer = setTimeout(() => {
      lenis.resize();
    }, 100);

    return () => {
      clearTimeout(resizeTimer);
      lenisRef.current = null;
      lenis.destroy();
      gsap.ticker.remove(gsapTick);
    };
  }, []);

  return null;
}
