"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import PreviewLenis from "./PreviewLenis";

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const slug = pathname?.split("/").pop() || "";

  return (
    <div className="relative w-full h-svh bg-[#f0eadf] overflow-hidden">
      {/* Floating Brutalist Back Button at Top-Left */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50 pointer-events-none">
        <Link
          href={slug === "sandbox" ? "/playground" : `/components/${slug}`}
          className="pointer-events-auto group inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#2a2a2a] bg-white border-2 border-[#2a2a2a] rounded-lg px-4 py-2 shadow-[3px_3px_0px_#2a2a2a] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#2a2a2a] active:translate-y-0.5 active:shadow-[1px_1px_0px_#2a2a2a] transition-all duration-150 cursor-pointer no-underline"
        >
          <svg
            className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {slug === "sandbox" ? "Playground" : "Back"}
        </Link>
      </div>

      <main
        id="main-scroller"
        className="w-full h-full overflow-y-auto overflow-x-hidden bg-[#f0eadf] scroll-smooth scrollbar-none"
      >
        {children}
        <PreviewLenis />
      </main>
    </div>
  );
}
