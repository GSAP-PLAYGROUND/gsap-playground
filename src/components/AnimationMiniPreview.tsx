"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface AnimationMiniPreviewProps {
  componentName: string;
  isHovered: boolean;
  /** Static thumbnail path (e.g. "/previews/FlipCards.webp") */
  previewImage?: string;
  /** Interaction mode sent to EmbedBridge via postMessage */
  embedInteraction?: "scroll" | "cursor" | "tabs" | "click-sequence";
}

/**
 * Production-grade iframe preview component:
 * - Static thumbnail displayed by default (zero cost, attractive)
 * - Iframe loads only on hover (50ms debounce prevents flicker on drive-by)
 * - Interaction command sent once iframe reports ready
 * - Iframe fully destroyed on unhover (frees memory, resets animations)
 * - ResizeObserver for efficient container-to-iframe scale mapping
 */
export default function AnimationMiniPreview({
  componentName,
  isHovered,
  previewImage,
  embedInteraction = "scroll",
}: AnimationMiniPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0.25);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Scale calculation via ResizeObserver (debounced + quantised) ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width && width > 0) {
        // Debounce: batch into next frame to avoid mid-animation scale jumps
        if (rafId != null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          // Quantise to nearest 0.005 to avoid sub-pixel jitter
          const raw = width / 1440;
          setScale(Math.round(raw * 200) / 200);
        });
      }
    });

    ro.observe(el);
    return () => {
      ro.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Hover lifecycle: load on hover, destroy on unhover ──
  useEffect(() => {
    if (isHovered) {
      // Debounce: only load after 50ms of sustained hover
      hoverTimerRef.current = setTimeout(() => {
        setIframeSrc(`/preview/${componentName}?embed=true`);
      }, 50);
    } else {
      // Cancel any pending load
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      // Cancel any pending command
      if (commandTimerRef.current) {
        clearTimeout(commandTimerRef.current);
        commandTimerRef.current = null;
      }
      // Destroy iframe — frees memory, resets all animations
      setIframeSrc(null);
      setIframeReady(false);
    }

    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (commandTimerRef.current) clearTimeout(commandTimerRef.current);
    };
  }, [isHovered, componentName]);

  // ── Send interaction command once iframe is ready ──
  useEffect(() => {
    if (!iframeReady || !iframeRef.current?.contentWindow) return;

    const commandMap: Record<string, string> = {
      scroll: "auto-scroll-start",
      cursor: "auto-cursor-start",
      tabs: "auto-tabs-start",
      "click-sequence": "auto-click-start",
    };

    // Cursor components need extra time for IntersectionObserver + GSAP quickTo
    const delay = embedInteraction === "cursor" ? 600 : 400;

    commandTimerRef.current = setTimeout(() => {
      try {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "tweenlabs-embed",
            command: commandMap[embedInteraction] || "auto-scroll-start",
          },
          window.location.origin,
        );
      } catch {
        // Iframe may have been destroyed between timeout scheduling and firing
      }
    }, delay);

    return () => {
      if (commandTimerRef.current) clearTimeout(commandTimerRef.current);
    };
  }, [iframeReady, embedInteraction]);

  const [imgError, setImgError] = useState(false);

  const handleIframeLoad = useCallback(() => {
    setIframeReady(true);
  }, []);

  /** Fallback placeholder shown when no image or image fails to load */
  const placeholder = (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center z-0 transition-opacity duration-300 ${iframeReady ? "opacity-0" : "opacity-100"}`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="w-8 h-8 rounded-full border-2 border-[#2a2a2a]/20 flex items-center justify-center">
        <svg
          className="w-3.5 h-3.5 text-[#2a2a2a]/30"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <span className="font-mono text-[9px] text-[#2a2a2a]/30 uppercase tracking-[0.15em] mt-2">
        Hover to preview
      </span>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-[#f0eadf] border-2 border-[#2a2a2a] rounded-lg overflow-hidden select-none shadow-[2px_2px_0px_rgba(42,42,42,0.15)]"
    >
      {/* ── Static thumbnail (fades when iframe is ready, falls back on error) ── */}
      {previewImage && !imgError ? (
        <Image
          src={previewImage}
          alt={`${componentName} preview`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover object-top z-0 transition-opacity duration-300 ${iframeReady ? "opacity-0" : "opacity-100"}`}
          priority={false}
          onError={() => setImgError(true)}
        />
      ) : (
        placeholder
      )}

      {/* ── Loading indicator ── */}
      {iframeSrc && !iframeReady && previewImage && !imgError && (
        <div className="absolute bottom-2 right-2 z-30">
          <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {iframeSrc && !iframeReady && !previewImage && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-5 h-5 border-2 border-[#2a2a2a] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── Live iframe (mount/unmount lifecycle tied to hover) ── */}
      {iframeSrc && (
        <iframe
          ref={iframeRef}
          title={`${componentName} preview`}
          src={iframeSrc}
          onLoad={handleIframeLoad}
          scrolling="no"
          className="absolute top-0 left-0 border-none pointer-events-none select-none z-10 transition-opacity duration-300"
          style={{
            width: "1440px",
            height: "810px",
            transform: `scale(${scale}) translate3d(0,0,0)`,
            transformOrigin: "top left",
            willChange: "transform",
            backfaceVisibility: "hidden",
            opacity: iframeReady ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}
