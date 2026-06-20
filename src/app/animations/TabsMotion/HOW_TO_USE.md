# How to Use: Tabs Motion

This guide shows you how to copy and use the **Tabs Motion** animation as a standalone React component.

### Core GSAP Animation Code
```javascript
// Sliding pill indicator
gsap.to(pillRef, {
  x: target.offsetLeft,
  width: target.offsetWidth,
  backgroundColor: tabs[index].color,
  duration: 0.4,
  ease: "power3.out",
});

// Directional content crossfade
const tl = gsap.timeline();
tl.to(contentRef, {
  opacity: 0,
  x: -30 * direction,
  duration: 0.2,
  ease: "power2.in",
});
tl.fromTo(
  contentRef,
  { opacity: 0, x: 30 * direction },
  { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
);
```

### Standalone Component Code
```tsx
"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Tab {
  label: string;
  color: string;
  content: { headline: string; body: string; tags: string[] };
}

interface TabsMotionProps {
  tabs?: Tab[];
}

const defaultTabs: Tab[] = [
  {
    label: "Design",
    color: "#e55b3c",
    content: {
      headline: "Pixel-Perfect Systems",
      body: "Cohesive design languages that scale across products.",
      tags: ["Figma", "Tokens", "Components"],
    },
  },
  {
    label: "Develop",
    color: "#0c9367",
    content: {
      headline: "Modern Stack",
      body: "React 19, Next.js 16, and GSAP power our frontend.",
      tags: ["React", "Next.js", "GSAP"],
    },
  },
];

export default function TabsMotion({ tabs = defaultTabs }: TabsMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    const direction = index > activeIndex ? 1 : -1;
    const tabButtons = containerRef.current?.querySelectorAll<HTMLElement>(".tab-btn");
    const target = tabButtons?.[index];

    if (target && pillRef.current) {
      gsap.to(pillRef.current, {
        x: target.offsetLeft,
        width: target.offsetWidth,
        backgroundColor: tabs[index].color,
        duration: 0.4,
        ease: "power3.out",
      });
    }

    if (contentRef.current) {
      const tl = gsap.timeline();
      tl.to(contentRef.current, {
        opacity: 0, x: -30 * direction, duration: 0.2, ease: "power2.in",
        onComplete: () => setActiveIndex(index),
      });
      tl.fromTo(contentRef.current,
        { opacity: 0, x: 30 * direction },
        { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
      );
    }
  };

  useGSAP(() => {
    const tabButtons = containerRef.current?.querySelectorAll<HTMLElement>(".tab-btn");
    const firstTab = tabButtons?.[0];
    if (firstTab && pillRef.current) {
      gsap.set(pillRef.current, {
        x: firstTab.offsetLeft,
        width: firstTab.offsetWidth,
        backgroundColor: tabs[0].color,
      });
    }
  }, { scope: containerRef });

  const active = tabs[activeIndex];

  return (
    <div ref={containerRef} className="w-full max-w-xl mx-auto">
      <div className="relative bg-white border-3 border-[#2a2a2a] rounded-xl p-1.5 flex gap-1 mb-6">
        <div ref={pillRef} className="absolute top-1.5 left-0 h-[calc(100%-12px)] rounded-lg z-0" />
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className="tab-btn relative z-10 flex-1 font-mono text-xs font-black uppercase tracking-wider py-3 rounded-lg cursor-pointer"
            style={{ color: activeIndex === i ? "#fff" : "#2a2a2a" }}
            onClick={() => handleTabClick(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div ref={contentRef} className="bg-white border-3 border-[#2a2a2a] rounded-xl p-8">
        <h2 className="font-serif font-black text-2xl mb-3">{active.content.headline}</h2>
        <p className="text-sm text-stone-600 mb-4">{active.content.body}</p>
        <div className="flex flex-wrap gap-2">
          {active.content.tags.map((tag) => (
            <span key={tag} className="font-mono text-[9px] font-bold uppercase px-2.5 py-1 rounded-md border border-stone-200 bg-zinc-50">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Setup & Integration Guide

### 💻 Option A: Install via CLI (Recommended)
```bash
npx tweenlabs@latest add tabs-motion
```

---

### 🛠️ Option B: Manual Installation

### ⚡ Step 1: Install Dependencies
```bash
npm install gsap @gsap/react
```

### 📁 Step 2: Save the Component File
1. Create: `file:///your-project/src/components/TabsMotion.tsx`
2. Copy the **Standalone Component Code** above.
3. Paste it into the new file.

### 🚀 Step 3: Import and Render
```tsx
import TabsMotion from "@/components/TabsMotion.tsx";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0eadf] p-8">
      <TabsMotion />
    </main>
  );
}
```

---

## 🛠️ Customization & Component Properties (Props)

> [!NOTE]
> This component is fully customizable and ready to use.

- `tabs` (Array): An array of tab objects. Each contains `label` (string), `color` (hex string), and `content` with `headline`, `body`, and `tags` array.

### 🎨 Neo-Brutalist Theme Tokens
- **Canvas Backdrop**: `bg-[#f0eadf]` (warm sand color)
- **High-contrast Borders**: `border-3 border-[#2a2a2a]` (solid charcoal outline)
- **Drop Shadow Blocks**: `shadow-[4px_4px_0px_#2a2a2a]` (tactile offsets)
