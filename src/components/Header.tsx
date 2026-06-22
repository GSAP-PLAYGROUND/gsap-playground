"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { animations } from "@/data/components";
import { authClient } from "@/lib/auth-client";
import { useAuthModal } from "@/provider/AuthModalProvider";
import { useSession } from "@/provider/SessionProvider";

gsap.registerPlugin(useGSAP);

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { session, isPending } = useSession();
  const { openModal } = useAuthModal();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasEverOpened, setHasEverOpened] = useState(false);

  // Normalize pathname
  const normalizedPath = pathname?.replace(/\/$/, "") ?? "";
  const currentAnim = animations.find((a) => a.route === normalizedPath);
  const codeSlug = normalizedPath.startsWith("/code/")
    ? normalizedPath.split("/").pop() ?? null
    : null;

  const handleGetCode = () => {
    if (!currentAnim) return;
    const url = `/code/${currentAnim.componentName}`;
    session ? router.push(url) : openModal(url, true);
  };

  // ─── Header entrance animation ─────────────────────────
  useGSAP(
    () => {
      if (!headerRef.current) return;
      gsap.from(headerRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.05,
      });
    },
    { scope: headerRef },
  );

  useEffect(() => setMounted(true), []);
  useEffect(() => setMobileMenuOpen(false), [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Auth action button (desktop)
  const authButtonDesktop = session ? (
    <button
      onClick={async () => { await authClient.signOut(); window.location.reload(); }}
      className="brutalist-btn bg-wtf-red hover:bg-[#a82a29] text-white font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
    >
      Sign Out
    </button>
  ) : (
    <button
      onClick={() => openModal()}
      className="brutalist-btn bg-wtf-green hover:bg-[#09734f] text-white font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
    >
      Sign In
    </button>
  );

  // Auth action button (mobile)
  const mobileAuthButton = session ? (
    <button
      onClick={async () => { await authClient.signOut(); window.location.reload(); }}
      className="brutalist-btn bg-wtf-red hover:bg-[#a82a29] text-white font-mono font-bold text-[11px] py-2.5 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 w-full text-center"
    >
      Sign Out
    </button>
  ) : (
    <button
      onClick={() => { setMobileMenuOpen(false); openModal(); }}
      className="brutalist-btn bg-wtf-green hover:bg-[#09734f] text-white font-mono font-bold text-[11px] py-2.5 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 w-full text-center"
    >
      Sign In
    </button>
  );

  return (
    <header ref={headerRef} className="fixed top-0 left-0 w-full z-50 bg-[#fafaf9] border-b-3 border-[#2a2a2a]">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 h-14 md:h-16 flex items-center justify-between">
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          {currentAnim && (
            <button
              onClick={() => window.history.length > 1 ? router.back() : router.push("/")}
              className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-[10px] md:text-xs py-1 px-2.5 md:py-1.5 md:px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
            >
              ← Back
            </button>
          )}
          <Link href="/" className="flex items-center gap-2 md:gap-3 cursor-pointer group" aria-label="TweenLabs Home">
            <Image src="/logo.svg" alt="TweenLabs Logo" width={28} height={28} priority className="object-contain transition-transform duration-200 group-hover:scale-105 w-7 h-7 md:w-8 md:h-8" />
            <span className="font-serif font-black text-lg md:text-2xl lg:text-[1.65rem] tracking-tight text-[#2a2a2a] group-hover:text-wtf-orange transition-colors duration-150">
              TweenLabs
            </span>
          </Link>
        </div>

        {/* Right: Desktop Nav */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {currentAnim && (
            <button
              onClick={handleGetCode}
              className="brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-[#2a2a2a] font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
              aria-label={`Get source code for ${currentAnim.name}`}
            >
              Get Code
            </button>
          )}
          <a
            href="https://github.com/TweenLabs/TweenLabs"
            target="_blank"
            rel="noopener noreferrer"
            className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-xs py-1.5 px-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150"
            aria-label="Star TweenLabs repository on GitHub"
          >
            Star us on GitHub ↗
          </a>
          {authButtonDesktop}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => { if (!mobileMenuOpen) setHasEverOpened(true); setMobileMenuOpen(!mobileMenuOpen); }}
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-[5px] cursor-pointer z-[60]"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`block w-5 h-[2.5px] bg-[#2a2a2a] rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""}`} />
          <span className={`block w-5 h-[2.5px] bg-[#2a2a2a] rounded-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-0" : ""}`} />
          <span className={`block w-5 h-[2.5px] bg-[#2a2a2a] rounded-full transition-all duration-300 origin-center ${mobileMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu (lazy-mounted) */}
      {hasEverOpened && (
        <>
          <div
            className={`md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className={`md:hidden fixed top-[53px] right-0 w-[280px] max-w-[85vw] h-[calc(100dvh-53px)] bg-[#fafaf9] border-l-3 border-[#2a2a2a] z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            aria-hidden={!mobileMenuOpen}
          >
            <div className="flex flex-col gap-3 p-5">
              {currentAnim && (
                <button
                  onClick={() => { setMobileMenuOpen(false); handleGetCode(); }}
                  className="brutalist-btn bg-wtf-yellow hover:bg-[#e5a420] text-[#2a2a2a] font-mono font-bold text-[11px] py-2.5 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 text-center w-full"
                  aria-label={`Get source code for ${currentAnim.name}`}
                >
                  Get Code
                </button>
              )}
              <a
                href="https://github.com/TweenLabs/TweenLabs"
                target="_blank"
                rel="noopener noreferrer"
                className="brutalist-btn bg-white hover:bg-wtf-orange hover:text-white text-[#2a2a2a] font-mono font-bold text-[11px] py-2.5 px-4 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 text-center"
                aria-label="Star TweenLabs repository on GitHub"
              >
                Star us on GitHub ↗
              </a>
              <div className="border-t-2 border-[#2a2a2a]/15 my-2" />
              {mobileAuthButton}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
