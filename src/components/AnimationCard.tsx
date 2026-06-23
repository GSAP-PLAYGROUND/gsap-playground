"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AnimationMiniPreview from "@/components/AnimationMiniPreview";
import { type AnimationItem, animations } from "@/data/components";
import { useAuthModal } from "@/provider/AuthModalProvider";
import { useSession } from "@/provider/SessionProvider";

interface AnimationCardProps {
  anim: AnimationItem;
}

const hoverColorsMap: Record<string, string> = {
  "bg-wtf-orange": "hover:bg-wtf-orange hover:text-white",
  "bg-wtf-green": "hover:bg-wtf-green hover:text-white",
  "bg-wtf-red": "hover:bg-wtf-red hover:text-white",
  "bg-wtf-blue": "hover:bg-wtf-blue hover:text-white",
  "bg-wtf-yellow": "hover:bg-wtf-yellow hover:text-black",
  "bg-wtf-purple": "hover:bg-wtf-purple hover:text-white",
};

export default function AnimationCard({ anim }: AnimationCardProps) {
  const router = useRouter();
  const { session } = useSession();
  const { openModal } = useAuthModal();
  const [isHovered, setIsHovered] = useState(false);

  const originalIndex = animations.findIndex((a) => a.id === anim.id);
  const displayId = String(
    originalIndex !== -1 ? originalIndex + 1 : 0,
  ).padStart(2, "0");

  const handleGetCode = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetUrl = `/code/${anim.componentName}`;
    if (session) {
      router.push(targetUrl);
    } else {
      openModal(targetUrl, true);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="brutalist-card brutalist-card-interactive p-5 md:p-6 bg-white flex flex-col justify-between gap-4 md:gap-5 h-full overflow-hidden"
    >
      <div className="flex flex-col gap-3 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base md:text-lg font-sans font-black uppercase tracking-tight text-[#2a2a2a] leading-tight break-words">
            <span className="font-mono font-bold text-[11px] text-zinc-400 mr-1.5">
              [{displayId}]
            </span>
            {anim.name}
          </h2>
          <span
            className={`shrink-0 inline-flex items-center border-2 border-[#2a2a2a] px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-mono font-bold uppercase ${anim.bgColor} ${anim.textColor} shadow-[1px_1px_0px_#2a2a2a]`}
          >
            {anim.bgColor.replace("bg-wtf-", "")}
          </span>
        </div>

        <Link href={anim.route} className="block w-full">
          <AnimationMiniPreview
            componentName={anim.componentName}
            isHovered={isHovered}
            previewImage={anim.preview}
            embedInteraction={anim.embedInteraction}
          />
        </Link>
      </div>

      <div className="flex gap-2 min-w-0">
        <Link href={anim.route} className="flex-1 min-w-0">
          <button
            className={`w-full brutalist-btn bg-white ${hoverColorsMap[anim.bgColor] || ""} border-[#2a2a2a] text-[#2a2a2a] font-mono font-bold text-[10px] md:text-xs py-2.5 md:py-3 px-3 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 whitespace-nowrap`}
          >
            View →
          </button>
        </Link>
        <button
          onClick={handleGetCode}
          className={`flex-1 min-w-0 brutalist-btn bg-white ${hoverColorsMap[anim.bgColor] || ""} border-[#2a2a2a] text-[#2a2a2a] font-mono font-bold text-[10px] md:text-xs py-2.5 md:py-3 px-3 rounded-lg uppercase tracking-wider cursor-pointer transition-colors duration-150 whitespace-nowrap`}
        >
          Get Code
        </button>
      </div>
    </div>
  );
}
