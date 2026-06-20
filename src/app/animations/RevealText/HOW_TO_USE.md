# How to Use: Reveal Text

This guide shows you how to copy and use the **Reveal Text** animation as a standalone React component.

### Core GSAP Animation Code
```javascript
const blocks = gsap.utils.toArray(".reveal-block");

blocks.forEach((block) => {
  const split = SplitText.create(block, {
    type: "lines",
    linesClass: "reveal-line",
    mask: "lines",
  });

  gsap.from(split.lines, {
    y: "100%",
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.12,
    scrollTrigger: {
      trigger: block,
      start: "top 80%",
      end: "bottom 60%",
      toggleActions: "play none none reverse",
    },
  });
});
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface RevealTextProps {
  paragraphs?: string[];
}

const defaultParagraphs = [
  "We craft digital experiences that push the boundaries of what's possible on the web.",
  "Every pixel is intentional. Every animation is purposeful. Every interaction tells a story.",
];

export default function RevealText({ paragraphs = defaultParagraphs }: RevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const blocks = gsap.utils.toArray<HTMLElement>(".reveal-block");

    blocks.forEach((block) => {
      const split = SplitText.create(block, {
        type: "lines",
        linesClass: "reveal-line",
        mask: "lines",
      });

      gsap.from(split.lines, {
        y: "100%",
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: block,
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-6 py-20 space-y-[20vh]">
      {paragraphs.map((text, i) => (
        <p key={i} className="reveal-block font-serif font-bold text-3xl leading-snug tracking-tight">
          {text}
        </p>
      ))}
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
You can install this component directly into your project via the TweenLabs CLI:
```bash
npx tweenlabs@latest add reveal-text
```

---

### 🛠️ Option B: Manual Installation

Follow these beginner-friendly, step-by-step instructions to integrate the component into your project.

### ⚡ Step 1: Install Dependencies
Open your project terminal and install the required GreenSock libraries:
```bash
npm install gsap @gsap/react
```

### 📁 Step 2: Save the Component File
1. Create a new component file inside your React/Next.js folder structure, for example:
   `file:///your-project/src/components/RevealText.tsx`
2. Copy the **Standalone Component Code** shown in the code tabs above.
3. Paste it directly into the new file.

### 🚀 Step 3: Import and Render
Import the component and render it inside any page layout:
```tsx
import RevealText from "@/components/RevealText.tsx";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f0eadf] p-8">
      <RevealText />
    </main>
  );
}
```

### ⚠️ Plugin Registration Notice
Since this component uses GSAP plugins (ScrollTrigger, SplitText), they must be imported and registered at the top of your component file:
```tsx
import { ScrollTrigger } from "gsap/all";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
```

---

## 🛠️ Customization & Component Properties (Props)

> [!NOTE]
> This component is fully customizable and ready to use.

You can pass the following settings to configure the layout and animation details:

- `paragraphs` (Array): An array of text strings. Each string is rendered as a separate reveal-animated block.

### 🎨 Neo-Brutalist Theme Tokens
To match TweenLabs' signature premium editorial styling:
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[6px_6px_0px_#2a2a2a]` (tactile offsets)
