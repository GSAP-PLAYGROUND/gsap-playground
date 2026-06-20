# How to Use: Parallax Hero

Full-viewport hero section with multi-layer depth parallax — background, midground, and foreground elements scroll at different speeds with a SplitText character scatter headline entrance.

### Core GSAP Animation Code
```javascript
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

// SplitText character scatter entrance
SplitText.create(".headline", {
  type: "chars",
  autoSplit: true,
  onSplit(self) {
    gsap.set(self.chars, { autoAlpha: 0, y: 80 });
    return gsap.to(self.chars, {
      autoAlpha: 1, y: 0, duration: 0.8,
      stagger: { from: "random", each: 0.03 },
      ease: "back.out(1.5)",
    });
  },
});

// Parallax layers at different speeds
layers.forEach((layer) => {
  gsap.to(layer.element, {
    y: -200 * layer.speed,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
  });
});
```

### Standalone Component Code
```tsx
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export interface ParallaxHeroProps {
  headline: string;
  subheadline?: string;
  intensity?: number;
  scrubSmoothing?: number;
}

export default function ParallaxHero({ headline, subheadline, intensity = 1, scrubSmoothing = 0.8 }: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = containerRef.current?.querySelector(".hero-headline");
    if (el) {
      SplitText.create(el, {
        type: "chars", autoSplit: true,
        onSplit(self) {
          gsap.set(self.chars, { autoAlpha: 0, y: 80 });
          return gsap.to(self.chars, { autoAlpha: 1, y: 0, duration: 0.8, stagger: { from: "random", each: 0.03 }, ease: "back.out(1.5)" });
        },
      });
    }

    gsap.to(".hero-headline-wrap", {
      y: -100 * intensity, ease: "none",
      scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: scrubSmoothing },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="hero-headline-wrap text-center max-w-4xl will-change-transform">
        <h1 className="hero-headline text-5xl md:text-8xl font-serif font-black uppercase tracking-tight">{headline}</h1>
      </div>
      {subheadline && <p className="mt-6 max-w-lg text-center text-sm font-sans font-medium text-zinc-600">{subheadline}</p>}
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
```bash
npx tweenlabs@latest add ParallaxHero
```

---

### 🛠️ Option B: Manual Installation

### ⚡ Step 1: Install Dependencies
```bash
npm install gsap @gsap/react
```

### 📁 Step 2: Save the Component File
1. Create `your-project/src/components/ParallaxHero.tsx`
2. Copy the **Standalone Component Code** above.

### 🚀 Step 3: Import and Render
```tsx
import ParallaxHero from "@/components/ParallaxHero.tsx";

export default function Page() {
  return (
    <main className="bg-[#f0eadf]">
      <ParallaxHero headline="Build Something Beautiful" subheadline="Premium motion design for modern interfaces." />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

> [!NOTE]
> This component is fully customizable and ready to use.

- `headline` (string, **required**): Hero headline text.
- `subheadline` (string): Supporting text below the headline.
- `intensity` (number, default `1`): Parallax movement multiplier.
- `scrubSmoothing` (number, default `0.8`): Scrub lag in seconds for smooth parallax.

### 🎨 Neo-Brutalist Theme Tokens
- **Canvas Backdrop**: `bg-[#f0eadf]`
- **High-contrast Borders**: `border-3 border-[#2a2a2a]`
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]`
