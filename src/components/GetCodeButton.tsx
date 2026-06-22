"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/provider/SessionProvider";
import { useAuthModal } from "@/provider/AuthModalProvider";

/**
 * Floating "Get Code" button that appears on individual component pages.
 * Lives in the layout — NOT inside component page files — so it won't
 * be included when users download components via CLI.
 */
export default function GetCodeButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useSession();
  const { openModal } = useAuthModal();

  // Only show on individual component pages like /components/FlipCards
  // Don't show on /components (listing) or /components/ root
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2 || segments[0] !== "components") return null;

  const componentName = segments[1];

  // Exclude known non-component routes
  const excludedRoutes = ["installation", "contribution", "playground"];
  if (excludedRoutes.includes(componentName.toLowerCase())) return null;

  const handleClick = () => {
    const targetUrl = `/code/${componentName}`;
    if (session) {
      router.push(targetUrl);
    } else {
      openModal(targetUrl, true);
    }
  };

  return (
    <div className="sticky top-3 z-40 flex justify-end gap-2 pr-4 pointer-events-none" style={{ marginBottom: "-48px" }}>
      <a
        href={`/preview/${componentName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#2a2a2a] bg-white border-2 border-[#2a2a2a] rounded-lg px-4 py-2 shadow-[3px_3px_0px_#2a2a2a] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#2a2a2a] active:translate-y-0.5 active:shadow-[1px_1px_0px_#2a2a2a] transition-all duration-150 cursor-pointer no-underline"
      >
        <svg className="w-3.5 h-3.5 transition-transform duration-150 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        View Full Page
      </a>
      <button
        onClick={handleClick}
        className="pointer-events-auto group inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#e55b3c] to-[#d44a2c] border-2 border-[#2a2a2a] rounded-lg px-4 py-2 shadow-[3px_3px_0px_#2a2a2a] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#2a2a2a] active:translate-y-0.5 active:shadow-[1px_1px_0px_#2a2a2a] transition-all duration-150 cursor-pointer"
      >
        <svg className="w-3.5 h-3.5 transition-transform duration-150 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        Get Code
      </button>
    </div>
  );
}
