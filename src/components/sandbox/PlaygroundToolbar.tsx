"use client";

import { Code, ExternalLink, Eye, RotateCcw } from "lucide-react";

type ThemeType = "default" | "white" | "dark";

interface PlaygroundLeftToolbarProps {
  status: "idle" | "running" | "paused" | "completed" | "error";
}

export function PlaygroundLeftToolbar({ status }: PlaygroundLeftToolbarProps) {
  return (
    <div className="border-b-3 border-black bg-white flex items-center shrink-0 h-[52px] px-3 md:px-4 gap-2 w-full select-none">
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
      <h1 className="font-mono text-sm font-black uppercase tracking-tight">
        TWEENBOT
      </h1>
    </div>
  );
}

interface PlaygroundRightToolbarProps {
  code: string;
  showCode: boolean;
  theme: ThemeType;
  onReplay: () => void;
  onToggleCode: () => void;
  onThemeChange: (theme: ThemeType) => void;
}

function getComponentName(code: string): string {
  const match = code.match(
    /export\s+default\s+(?:function|class)\s+([A-Za-z0-9_]+)/,
  );
  if (match?.[1]) {
    return match[1];
  }
  const exportDefaultMatch = code.match(/export\s+default\s+([A-Za-z0-9_]+)/);
  if (
    exportDefaultMatch?.[1] &&
    !["const", "let", "var", "function", "class", "async"].includes(
      exportDefaultMatch[1],
    )
  ) {
    return exportDefaultMatch[1];
  }
  const constMatch = code.match(/export\s+const\s+([A-Za-z0-9_]+)/);
  if (constMatch?.[1]) {
    return constMatch[1];
  }
  return "App";
}

export function PlaygroundRightToolbar({
  code,
  showCode,
  theme,
  onReplay,
  onToggleCode,
  onThemeChange,
}: PlaygroundRightToolbarProps) {
  return (
    <div className="border-b-3 border-black bg-white flex items-center justify-between shrink-0 h-[52px] px-3 md:px-4 gap-2 w-full select-none playground-toolbar-right">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReplay}
          title="Replay Animation"
          className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-white border-2 border-black font-mono text-[10px] font-black uppercase rounded shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer text-black"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="playground-btn-text hidden sm:inline">Replay</span>
        </button>

        <button
          type="button"
          onClick={onToggleCode}
          title="Toggle Code View"
          className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 border-2 border-black font-mono text-[10px] font-black uppercase rounded shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer ${
            showCode ? "bg-[#6758a5] text-white" : "bg-white text-black"
          }`}
        >
          {showCode ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span className="playground-btn-text hidden sm:inline">
                Preview
              </span>
            </>
          ) : (
            <>
              <Code className="w-3.5 h-3.5" />
              <span className="playground-btn-text hidden sm:inline">Code</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              const name = getComponentName(code);
              const previewId = `${name}_${Date.now()}`;
              localStorage.setItem(`tweenbot_sandbox_code_${previewId}`, code);
              localStorage.setItem(
                `tweenbot_sandbox_theme_${previewId}`,
                theme,
              );
              window.open(`/preview/sandbox?id=${previewId}`, "_blank");
            }
          }}
          title="Open Web Preview in New Tab"
          className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-white border-2 border-black font-mono text-[10px] font-black uppercase rounded shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer text-black"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="playground-btn-text hidden sm:inline">
            Web Preview
          </span>
        </button>
      </div>

      {/* Theme switcher */}
      <div className="playground-theme-switcher flex items-center border-2 border-black bg-white rounded divide-x-2 divide-black shadow-[2px_2px_0px_#000] font-mono text-[10px] font-black overflow-hidden">
        {(["default", "white", "dark"] as ThemeType[]).map((t) => (
          <button
            key={t}
            type="button"
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
  );
}
