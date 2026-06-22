# How to Use: Morphing Text

This guide explains how to integrate the **Morphing Text** component — a smooth auto-cycling text animation that transitions between words using GSAP-powered blur, scale, and position morphing with an SVG threshold filter for a gooey dissolve effect.

### Core GSAP Animation Code
```javascript
// SVG filter for gooey threshold morph effect
// Apply filter id="morph-threshold" to the container wrapping both text layers
//
// <filter id="morph-threshold">
//   <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
//   <feColorMatrix in="blur" mode="matrix"
//     values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="threshold" />
//   <feComposite in="SourceGraphic" in2="threshold" operator="atop" />
// </filter>

const texts = ["Creative", "Morphing", "Dynamic", "Seamless", "Animated"];
let currentIndex = 0;

function morphToNext(text1El, text2El) {
  const nextIndex = (currentIndex + 1) % texts.length;

  // Update text content
  text1El.textContent = texts[currentIndex];
  text2El.textContent = texts[nextIndex];

  // Set initial states
  gsap.set(text1El, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)" });
  gsap.set(text2El, { autoAlpha: 0, y: 40, scale: 0.92, filter: "blur(8px)" });

  const tl = gsap.timeline();

  // Current text morphs out
  tl.to(text1El, {
    autoAlpha: 0,
    y: -40,
    scale: 1.08,
    filter: "blur(8px)",
    duration: 0.7,
    ease: "power2.inOut",
  }, "morph");

  // Next text morphs in
  tl.to(text2El, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    duration: 0.7,
    ease: "power2.inOut",
  }, "morph+=0.15");

  // After morph completes, swap layers
  tl.call(() => {
    gsap.set(text1El, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)" });
    gsap.set(text2El, { autoAlpha: 0, y: 40, scale: 0.92, filter: "blur(8px)" });
    text1El.textContent = texts[nextIndex];
    currentIndex = nextIndex;
  });

  return tl;
}

// Auto-cycle every 2.4 seconds
setInterval(() => {
  morphToNext(text1Element, text2Element);
}, 2400);
```

### Standalone Component Code
```tsx
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useCallback, useEffect } from "react";

gsap.registerPlugin(useGSAP);

interface MorphingTextProps {
  /** Array of words/phrases to cycle through */
  texts: string[];
  /** Accent colors for each text (cycles if fewer than texts) */
  colors?: string[];
  /** Time in ms between transitions (default: 2400) */
  interval?: number;
  /** Morph transition duration in seconds (default: 0.7) */
  morphDuration?: number;
  /** Additional CSS class for the text */
  className?: string;
}

export default function MorphingText({
  texts,
  colors = ["#e55b3c", "#0c9367", "#6758a5", "#3b82f6", "#f1b333", "#c53b3a"],
  interval = 2400,
  morphDuration = 0.7,
  className = "",
}: MorphingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const cycleText = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % texts.length;
      setNextIndex((next + 1) % texts.length);
      return next;
    });
  }, [texts.length]);

  useGSAP(
    () => {
      if (!text1Ref.current || !text2Ref.current) return;
      if (timelineRef.current) timelineRef.current.kill();

      const tl = gsap.timeline();
      timelineRef.current = tl;

      gsap.set(text1Ref.current, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)" });
      gsap.set(text2Ref.current, { autoAlpha: 0, y: 40, scale: 0.92, filter: "blur(8px)" });

      tl.to(text1Ref.current, {
        autoAlpha: 0, y: -40, scale: 1.08, filter: "blur(8px)",
        duration: morphDuration, ease: "power2.inOut",
      }, "morph")
        .to(text2Ref.current, {
          autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: morphDuration, ease: "power2.inOut",
        }, "morph+=0.15")
        .call(() => {
          if (text1Ref.current && text2Ref.current) {
            gsap.set(text1Ref.current, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)" });
            gsap.set(text2Ref.current, { autoAlpha: 0, y: 40, scale: 0.92, filter: "blur(8px)" });
          }
        });
    },
    { scope: containerRef, dependencies: [currentIndex] }
  );

  useEffect(() => {
    const timer = setInterval(cycleText, interval);
    return () => clearInterval(timer);
  }, [cycleText, interval]);

  const getColor = (idx: number) => colors[idx % colors.length];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="morph-threshold">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="threshold" />
            <feComposite in="SourceGraphic" in2="threshold" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div style={{ filter: "url(#morph-threshold)" }}
        className="relative flex items-center justify-center overflow-hidden"
      >
        <div className="relative h-[1.3em] flex items-center justify-center w-full">
          <span ref={text1Ref}
            className="absolute font-serif font-black uppercase tracking-tight will-change-transform select-none"
            style={{ color: getColor(nextIndex) }}
          >
            {texts[nextIndex]}
          </span>
          <span ref={text2Ref}
            className="absolute font-serif font-black uppercase tracking-tight will-change-transform select-none"
            style={{ color: getColor((nextIndex + 1) % texts.length), visibility: "hidden" }}
          >
            {texts[(nextIndex + 1) % texts.length]}
          </span>
        </div>
      </div>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs@latest add MorphingText
```

---

### 🛠️ Option B: Manual Installation

### ⚡ Step 1: Install Dependencies
Open your project terminal and install the required GreenSock libraries:
```bash
npm install gsap @gsap/react
```

### 📁 Step 2: Save the Component File
1. Create a new component file inside your React/Next.js folder structure, for example:
   `your-project/src/components/MorphingText.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import MorphingText from "@/components/MorphingText.tsx";

const words = ["Creative", "Morphing", "Dynamic", "Seamless", "Animated"];

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <MorphingText
        texts={words}
        className="text-5xl md:text-8xl"
      />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

> [!NOTE]
> This component is fully customizable and ready to use.

- `texts` (string[]): **Required**. An array of words or phrases to cycle through. Minimum 2 items recommended.
- `colors` (string[]): Optional. Array of hex color strings for each text. Cycles through if fewer colors than texts. Defaults to the TweenLabs palette.
- `interval` (number): Optional. Time in milliseconds between each morph transition. Default: `2400`.
- `morphDuration` (number): Optional. Duration in seconds for each morph transition. Default: `0.7`.
- `className` (string): Optional. Additional CSS classes for the wrapper. Use to control text size (e.g., `text-6xl md:text-9xl`).

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)
