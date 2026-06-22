"use client";

import React from "react";
import { RotateCcw, Code, Eye, MessageSquare, Monitor } from "lucide-react";

type ThemeType = "default" | "white" | "dark";
type MobileTab = "chat" | "preview";

interface PlaygroundToolbarProps {
  status: "idle" | "running" | "paused" | "completed" | "error";
  showCode: boolean;
  theme: ThemeType;
  onReplay: () => void;
  onToggleCode: () => void;
  onThemeChange: (theme: ThemeType) => void;
  isMobile?: boolean;
  activeTab?: MobileTab;
  onTabChange?: (tab: MobileTab) => void;
}

export default function PlaygroundToolbar({
  status,
  showCode,
  theme,
  onReplay,
  onToggleCode,
  onThemeChange,
  isMobile = false,
  activeTab = "chat",
  onTabChange,
}: PlaygroundToolbarProps) {
  return (
    <div className="border-b-3 border-black bg-white flex items-center shrink-0 z-10 h-[52px]">
      {/* Left: Chatbot name + mobile tab switcher */}
      <div
        className={`flex items-center gap-2 px-3 md:px-4 shrink-0 ${
          isMobile ? "" : "md:w-[30%]"
        }`}
      >
        <span
          className={`w-3 h-3 rounded-full border-2 border-black shrink-0 ${
            status === "running"
              ? "bg-[#e55b3c] animate-pulse"
              : status === "paused"
                ? "bg-[#f1b333] animate-pulse"
                : status === "completed"
                  ? "bg-[#0c9367]"
                  : "bg-zinc-400"
          }`}
        />
        <h1 className="font-mono text-sm font-black uppercase tracking-tight hidden sm:block">
          TWEENBOT
        </h1>

        {/* Mobile tab switcher */}
        {isMobile && onTabChange && (
          <div className="flex items-center border-2 border-black bg-white rounded divide-x-2 divide-black shadow-[2px_2px_0px_#000] font-mono text-[10px] font-black overflow-hidden ml-1">
            <button
              onClick={() => onTabChange("chat")}
              className={`flex items-center gap-1 px-2.5 py-1.5 uppercase transition-colors cursor-pointer ${
                activeTab === "chat"
                  ? "bg-black text-white"
                  : "hover:bg-zinc-100 text-black"
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => onTabChange("preview")}
              className={`flex items-center gap-1 px-2.5 py-1.5 uppercase transition-colors cursor-pointer ${
                activeTab === "preview"
                  ? "bg-black text-white"
                  : "hover:bg-zinc-100 text-black"
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>Preview</span>
            </button>
          </div>
        )}
      </div>

      {/* Divider — hidden on mobile */}
      <div className="self-stretch w-px bg-zinc-200 hidden md:block" />

      {/* Right: Preview Controls */}
      <div className="flex-1 flex items-center justify-end md:justify-between px-3 md:px-4 gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onReplay}
            title="Replay Animation"
            className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-white border-2 border-black font-mono text-[10px] font-black uppercase rounded shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          <button
            onClick={onToggleCode}
            title="Toggle Code View"
            className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 border-2 border-black font-mono text-[10px] font-black uppercase rounded shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer ${
              showCode ? "bg-[#6758a5] text-white" : "bg-white text-black"
            }`}
          >
            {showCode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Code</span>
              </>
            )}
          </button>
        </div>

        {/* Theme switcher — hidden on mobile to save space */}
        <div className="hidden sm:flex items-center border-2 border-black bg-white rounded divide-x-2 divide-black shadow-[2px_2px_0px_#000] font-mono text-[10px] font-black overflow-hidden">
          {(["default", "white", "dark"] as ThemeType[]).map((t) => (
            <button
              key={t}
              onClick={() => onThemeChange(t)}
              className={`px-3 py-1.5 uppercase transition-colors cursor-pointer ${
                theme === t
                  ? "bg-black text-white"
                  : "hover:bg-zinc-100 text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
