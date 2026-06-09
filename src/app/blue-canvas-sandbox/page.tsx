"use client";

import Link from "next/link";

export default function AnimationFourPage() {
  return (
    <div className="relative min-h-screen bg-[#f0eadf] text-[#2a2a2a] flex flex-col items-center justify-center p-4 selection:bg-wtf-yellow selection:text-black">
      <div className="absolute inset-0 dot-grid pointer-events-none z-0" />
      
      <div className="z-10 w-full max-w-xl brutalist-card p-8 bg-white flex flex-col gap-6 text-center">
        <div className="inline-flex self-center items-center gap-2 bg-wtf-blue border-2 border-[#2a2a2a] px-4 py-1.5 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[3px_3px_0px_#2a2a2a] tilt-right">
          <span>Blue Canvas Sandbox</span>
        </div>
        
        <h1 className="text-4xl font-serif font-black uppercase tracking-tight leading-none">
          Blue Canvas Sandbox
        </h1>
        
        <p className="text-sm font-sans font-medium text-zinc-700">
          This is your sandbox page for <span className="font-bold">Blue Canvas Sandbox</span>. Replace this content with your custom layouts and GSAP animations.
        </p>

        <div className="border-3 border-dashed border-zinc-300 rounded-xl p-8 bg-zinc-50 flex flex-col items-center justify-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="font-mono text-xs font-bold text-zinc-500">Animation Sandbox Ready</span>
        </div>

        <Link href="/" className="inline-block mt-2">
          <button className="w-full brutalist-btn bg-wtf-yellow text-[#2a2a2a] font-mono font-bold text-sm py-3 px-6 rounded-lg uppercase tracking-wider cursor-pointer">
            ← Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
