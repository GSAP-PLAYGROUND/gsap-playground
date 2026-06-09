"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const navItems = ["podcast", "community", "offline", "fund", "careers"];

const hoverClasses: Record<string, string> = {
  podcast: "hover:bg-[#0c9367] hover:text-white",
  community: "hover:bg-[#c53b3a] hover:text-white",
  offline: "hover:bg-[#3b82f6] hover:text-white",
  fund: "hover:bg-[#f1b333] hover:text-black",
  careers: "hover:bg-[#6758a5] hover:text-white",
};

export default function AnimationFivePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // Set initial states for all panels to ensure off-screen panels are fully hidden
    gsap.set(".panel-0", { y: "0vh", scale: 1, autoAlpha: 1 });
    gsap.set(".panel-1, .panel-2, .panel-3, .panel-4", { y: "100vh", scale: 1, autoAlpha: 0 });

    // Master timeline linked to vertical scroll pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        pin: true,
        scrub: 0.5,
        start: "top top",
        end: "+=4000",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Dynamic calculation of active section to highlight sidebar items
          const progress = self.progress;
          let active = "podcast";
          if (progress > 0.82) {
            active = "careers";
          } else if (progress > 0.58) {
            active = "fund";
          } else if (progress > 0.35) {
            active = "offline";
          } else if (progress > 0.1) {
            active = "community";
          }

          // Directly update DOM nodes for high-performance scroll transitions
          navItems.forEach((item) => {
            const el = document.getElementById(`nav-${item}`);
            if (el) {
              if (item === active) {
                el.classList.add("shadow-[3px_3px_0px_#000]", "scale-105", "!rotate-[-4deg]");
                el.classList.remove("opacity-60", "rotate-[2deg]");
                if (item === "podcast") {
                  el.style.backgroundColor = "#0c9367";
                  el.style.color = "white";
                } else if (item === "community") {
                  el.style.backgroundColor = "#c53b3a";
                  el.style.color = "white";
                } else if (item === "offline") {
                  el.style.backgroundColor = "#3b82f6";
                  el.style.color = "white";
                } else if (item === "fund") {
                  el.style.backgroundColor = "#f1b333";
                  el.style.color = "black";
                } else if (item === "careers") {
                  el.style.backgroundColor = "#6758a5";
                  el.style.color = "white";
                }
              } else {
                el.style.backgroundColor = "";
                el.style.color = "";
                el.classList.remove("shadow-[3px_3px_0px_#000]", "scale-105", "!rotate-[-4deg]");
                el.classList.add("opacity-60", "rotate-[2deg]");
              }
            }
          });
        }
      }
    });

    tlRef.current = tl;

    // Initial label and hold/cushion for podcast
    tl.addLabel("podcast", 0);
    tl.to({}, { duration: 0.5 });

    // Section 2 (Community) Slides Up Over Green
    tl.set(".panel-1", { autoAlpha: 1 });
    tl.to(".panel-1", {
      y: "0vh",
      duration: 1.0,
      ease: "power2.inOut",
    });
    tl.to(".panel-0", {
      scale: 0.85,
      y: "-10vh",
      autoAlpha: 0,
      transformOrigin: "center center",
      duration: 1.0,
      ease: "power2.inOut",
    }, "<");
    tl.addLabel("community");
    tl.to({}, { duration: 0.5 }); // Hold state

    // Section 3 (Offline) Slides Up Over Red
    tl.set(".panel-2", { autoAlpha: 1 });
    tl.to(".panel-2", {
      y: "0vh",
      duration: 1.0,
      ease: "power2.inOut",
    });
    tl.to(".panel-1", {
      scale: 0.85,
      y: "-10vh",
      autoAlpha: 0,
      transformOrigin: "center center",
      duration: 1.0,
      ease: "power2.inOut",
    }, "<");
    tl.addLabel("offline");
    tl.to({}, { duration: 0.5 }); // Hold state

    // Section 4 (Fund) Slides Up Over Blue
    tl.set(".panel-3", { autoAlpha: 1 });
    tl.to(".panel-3", {
      y: "0vh",
      duration: 1.0,
      ease: "power2.inOut",
    });
    tl.to(".panel-2", {
      scale: 0.85,
      y: "-10vh",
      autoAlpha: 0,
      transformOrigin: "center center",
      duration: 1.0,
      ease: "power2.inOut",
    }, "<");
    tl.addLabel("fund");
    tl.to({}, { duration: 0.5 }); // Hold state

    // Section 5 (Careers) Slides Up Over Yellow
    tl.set(".panel-4", { autoAlpha: 1 });
    tl.to(".panel-4", {
      y: "0vh",
      duration: 1.0,
      ease: "power2.inOut",
    });
    tl.to(".panel-3", {
      scale: 0.85,
      y: "-10vh",
      autoAlpha: 0,
      transformOrigin: "center center",
      duration: 1.0,
      ease: "power2.inOut",
    }, "<");
    tl.addLabel("careers");
    tl.to({}, { duration: 0.5 }); // End Hold

  }, { scope: containerRef });

  const handleNavClick = (label: string) => {
    const tl = tlRef.current;
    if (tl && tl.scrollTrigger) {
      const scrollPos = tl.scrollTrigger.labelToScroll(label);
      window.scrollTo({
        top: scrollPos,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1e1e1e] overflow-hidden" ref={containerRef}>
      {/* Tactile Noise Overlay */}
      <div className="noise-overlay fixed inset-0 pointer-events-none z-[49] opacity-40" />

      {/* Dashboard Back Link */}
      <Link href="/" className="fixed left-6 top-6 z-50">
        <button className="brutalist-btn bg-[#f8f5ee] text-[#2a2a2a] px-4 py-2 text-xs font-mono font-bold uppercase rounded-md cursor-pointer border-2 border-black shadow-[3px_3px_0px_#000]">
          ← Dashboard
        </button>
      </Link>

      {/* Floating Navigator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
        {navItems.map((item) => (
          <button
            key={item}
            id={`nav-${item}`}
            onClick={() => handleNavClick(item)}
            className={`w-28 text-left border-2 border-black bg-white text-[#2a2a2a] px-3 py-1.5 font-mono font-bold text-[10px] uppercase rounded shadow-[2px_2px_0px_rgba(0,0,0,0.85)] cursor-pointer transform rotate-[2deg] transition-all duration-200 hover:scale-105 opacity-60 hover:opacity-100 ${hoverClasses[item]}`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Main Pinned Scroll Section Container */}
      <div ref={scrollSectionRef} className="h-screen w-full relative overflow-hidden">
        
        {/* PANEL 0: GREEN SECTION (Podcasts) */}
        <section className="panel-0 absolute inset-0 bg-[#0c9367] text-white flex flex-col justify-between p-8 md:p-16 z-10 select-none">
          <div className="flex justify-between items-center w-full">
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">/ sandbox-05 / module-01</span>
            <span className="font-serif font-black text-xl tracking-tight">DEV</span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
              PODCASTS & TALKS
            </h1>
            <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
              Weekly unscripted development talk sessions covering core compiler engineering, VM performance, layout engines, and the realities of developer productivity.
            </p>
            <div className="flex gap-4 mt-2">
              <button className="brutalist-btn bg-white text-black px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                Listen on Spotify
              </button>
              <button className="brutalist-btn bg-black text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                Read Notes
              </button>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold opacity-75">Recent Episodes:</span>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none w-full">
              {[
                { ep: "EP-42", title: "Compilers in Rust", dur: "48 MIN" },
                { ep: "EP-43", title: "React 19 Server Actions", dur: "52 MIN" },
                { ep: "EP-44", title: "Is CSS Turing Complete?", dur: "37 MIN" },
                { ep: "EP-45", title: "The Vim Exit Protocol", dur: "41 MIN" },
              ].map((item, i) => (
                <div key={i} className="bg-[#fbfaf7] text-[#2a2a2a] border-3 border-black p-4 rounded-xl flex flex-col justify-between gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] w-56 h-32 shrink-0">
                  <span className="font-mono text-[9px] font-bold text-zinc-400">{item.ep}</span>
                  <h3 className="font-serif font-black text-sm uppercase leading-tight tracking-tight">{item.title}</h3>
                  <span className="font-mono text-[8px] font-bold text-zinc-500">{item.dur}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PANEL 1: RED SECTION (Community) */}
        <section className="panel-1 absolute inset-0 bg-[#c53b3a] text-white flex flex-col justify-between p-8 md:p-16 z-12 transform translate-y-[120vh] select-none origin-bottom-left">
          <div className="panel-1-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">/ sandbox-05 / module-02</span>
              <span className="font-serif font-black text-xl tracking-tight">DEV</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
                DEV COMMUNITY
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
                An invite-only global guild for high-agency engineers, systems programmers, and active open-source contributors to share architectural plans and build side projects.
              </p>
              <div className="flex gap-4 mt-2">
                <button className="brutalist-btn bg-white text-black px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Apply to Guild
                </button>
                <button className="brutalist-btn bg-black text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  View Charter
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold opacity-75">Community Highlights:</span>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none w-full">
                {[
                  { tag: "HACKATHON", title: "Tokyo War Room Meetup", size: "32 ENGINEERS" },
                  { tag: "COLLABORATION", title: "Open Source CSS Parser", size: "4 MAINTAINERS" },
                  { tag: "MEETUP", title: "London Rust Coffee Jam", size: "18 INDIE BUILDERS" },
                  { tag: "WORKSHOP", title: "Wasm Assembly Hacks", size: "24 DEVELOPERS" },
                ].map((item, i) => (
                  <div key={i} className="bg-[#fbfaf7] text-[#2a2a2a] border-3 border-black p-4 rounded-xl flex flex-col justify-between gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] w-56 h-32 shrink-0">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">[{item.tag}]</span>
                    <h3 className="font-serif font-black text-sm uppercase leading-tight tracking-tight">{item.title}</h3>
                    <span className="font-mono text-[8px] font-bold text-zinc-500">{item.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PANEL 2: BLUE SECTION (Offline Events) */}
        <section className="panel-2 absolute inset-0 bg-[#3b82f6] text-white flex flex-col justify-between p-8 md:p-16 z-14 transform translate-y-[120vh] select-none origin-bottom-left">
          <div className="panel-2-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">/ sandbox-05 / module-03</span>
              <span className="font-serif font-black text-xl tracking-tight">DEV</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
                OFFLINE EVENTS
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
                Digital is where we chat, offline is where we ship. Face-to-face debugging rooms, technical weekend builds, and structured coffee talks without slides.
              </p>
              <div className="flex gap-4 mt-2">
                <button className="brutalist-btn bg-white text-black px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Schedule List
                </button>
                <button className="brutalist-btn bg-black text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Host an Event
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold opacity-75">Upcoming Locations:</span>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none w-full">
                {[
                  { tag: "SF", title: "Mission Hackathon Room", date: "DECEMBER 12-14" },
                  { tag: "TOKYO", title: "Shibuya Coffee Hack", date: "JANUARY 8" },
                  { tag: "BERLIN", title: "Kreuzberg Rust Day", date: "FEBRUARY 1" },
                  { tag: "MUMBAI", title: "Bandra Web3 Summit", date: "MARCH 22" },
                ].map((item, i) => (
                  <div key={i} className="bg-[#fbfaf7] text-[#2a2a2a] border-3 border-black p-4 rounded-xl flex flex-col justify-between gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] w-56 h-32 shrink-0">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">[{item.tag}]</span>
                    <h3 className="font-serif font-black text-sm uppercase leading-tight tracking-tight">{item.title}</h3>
                    <span className="font-mono text-[8px] font-bold text-zinc-500">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PANEL 3: YELLOW SECTION (Fund) */}
        <section className="panel-3 absolute inset-0 bg-[#f1b333] text-[#2a2a2a] flex flex-col justify-between p-8 md:p-16 z-16 transform translate-y-[120vh] select-none origin-bottom-left">
          <div className="panel-3-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">/ sandbox-05 / module-04</span>
              <span className="font-serif font-black text-xl tracking-tight">DEV</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-[#2a2a2a] pb-3">
                OPEN SOURCE FUND
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90 text-zinc-800">
                Direct equity-free micro-grants for developers under 25 who are creating devtools, utility compilers, packaging libraries, and essential web components.
              </p>
              <div className="flex gap-4 mt-2">
                <button className="brutalist-btn bg-white text-[#2a2a2a] px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Submit Project
                </button>
                <button className="brutalist-btn bg-black text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  View Grantees
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold opacity-75">Funded Projects:</span>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none w-full">
                {[
                  { type: "UTILITY", name: "Indie CSS Parser engine", grant: "$5,000 GRANT" },
                  { type: "DEVTOOL", name: "Wasm Terminal Emulator", grant: "$5,000 GRANT" },
                  { type: "COMPILER", name: "Rust to JS AST transpiler", grant: "$7,500 GRANT" },
                  { type: "LIBRARY", name: "Neo-Brutalism CSS framework", grant: "$4,000 GRANT" },
                ].map((item, i) => (
                  <div key={i} className="bg-white text-[#2a2a2a] border-3 border-black p-4 rounded-xl flex flex-col justify-between gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] w-56 h-32 shrink-0">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">[{item.type}]</span>
                    <h3 className="font-serif font-black text-sm uppercase leading-tight tracking-tight">{item.name}</h3>
                    <span className="font-mono text-[8px] font-bold text-zinc-500">{item.grant}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PANEL 4: PURPLE SECTION (Careers) */}
        <section className="panel-4 absolute inset-0 bg-[#6758a5] text-white flex flex-col justify-between p-8 md:p-16 z-18 transform translate-y-[120vh] select-none origin-bottom-left">
          <div className="panel-4-content flex flex-col justify-between h-full w-full origin-bottom-left">
            <div className="flex justify-between items-center w-full">
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">/ sandbox-05 / module-05</span>
              <span className="font-serif font-black text-xl tracking-tight">DEV</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black uppercase tracking-tight leading-[1.05] border-b-6 border-white pb-3">
                DEV CAREERS
              </h1>
              <p className="text-sm md:text-base font-sans font-medium max-w-2xl leading-relaxed opacity-90">
                Skip HR and standard application tracking algorithms. Get placed directly into engineering roles at early-stage open source startups and engineering teams.
              </p>
              <div className="flex gap-4 mt-2">
                <button className="brutalist-btn bg-white text-black px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Submit Profile
                </button>
                <button className="brutalist-btn bg-black text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase cursor-pointer">
                  Browse Roles
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold opacity-75">Active Open Roles:</span>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none w-full">
                {[
                  { tag: "SYSTEMS", title: "Rust Compiler Dev", location: "TOKYO / REMOTE" },
                  { tag: "FRONTEND", title: "NextJS Component Lead", location: "SAN FRANCISCO" },
                  { tag: "DATABASE", title: "Wasm SQL Parser Engineer", location: "REMOTE" },
                  { tag: "ENGINEERING", title: "Founding Infra Architect", location: "BERLIN / ONSITE" },
                ].map((item, i) => (
                  <div key={i} className="bg-[#fbfaf7] text-[#2a2a2a] border-3 border-black p-4 rounded-xl flex flex-col justify-between gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.95)] w-56 h-32 shrink-0">
                    <span className="font-mono text-[9px] font-bold text-zinc-400">[{item.tag}]</span>
                    <h3 className="font-serif font-black text-sm uppercase leading-tight tracking-tight">{item.title}</h3>
                    <span className="font-mono text-[8px] font-bold text-zinc-500">{item.location}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
