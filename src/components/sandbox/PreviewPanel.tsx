"use client";

import { Check, Copy, Download } from "lucide-react";
import { useRef, useState } from "react";
import { highlightCode } from "@/lib/highlight";
import LiveRunner from "./LiveRunner";

interface PreviewPanelProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  onCompileStart?: () => void;
  onCompileSuccess?: (logs: string[]) => void;
  onCompileError?: (err: Error) => void;
  remountKey: number;
  showCode: boolean;
  theme: "default" | "white" | "dark";
}

export default function PreviewPanel({
  code,
  onCodeChange,
  onCompileStart,
  onCompileSuccess,
  onCompileError,
  remountKey,
  showCode,
  theme,
}: PreviewPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const getComponentName = () => {
    // Look for export default function Name or export default class Name
    const match = code.match(
      /export\s+default\s+(?:function|class)\s+([A-Za-z0-9_]+)/,
    );
    if (match?.[1]) {
      return match[1];
    }

    // Look for export default Name (if declared earlier)
    const exportDefaultMatch = code.match(/export\s+default\s+([A-Za-z0-9_]+)/);
    if (
      exportDefaultMatch?.[1] &&
      !["const", "let", "var", "function", "class", "async"].includes(
        exportDefaultMatch[1],
      )
    ) {
      return exportDefaultMatch[1];
    }

    // Look for export const Name
    const constMatch = code.match(/export\s+const\s+([A-Za-z0-9_]+)/);
    if (constMatch?.[1]) {
      return constMatch[1];
    }

    return "App";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const handleDownload = () => {
    const componentName = getComponentName();
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${componentName}.tsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getThemeBg = () => {
    switch (theme) {
      case "white":
        return "bg-white text-black";
      case "dark":
        return "bg-[#121212] text-white";
      default:
        return "bg-[#f0eadf] text-[#2a2a2a]";
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const componentName = getComponentName();

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden relative select-none">
      {/* Main Container Area */}
      <div
        className={`flex-1 relative overflow-auto scrollbar-none ${getThemeBg()} transition-colors duration-500`}
      >
        {showCode ? (
          /* Inline Code Editor */
          <div className="w-full h-full flex flex-col bg-[#1e1e1e] relative text-[#abb2bf]">
            {/* Header info */}
            <div className="bg-[#121212] px-4 py-2 border-b-2 border-black flex items-center justify-between text-zinc-500 font-mono text-[9px] select-none">
              <span>src/{componentName}.tsx</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy Code"
                  className={`font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1 ${
                    copied
                      ? "bg-[#0c9367] text-white border-[#0c9367]"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-700"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPY</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  title="Download Code File"
                  className="font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded border transition-all cursor-pointer bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-700 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>DOWNLOAD</span>
                </button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative flex overflow-hidden">
              {/* Simulated Line Numbers */}
              <div className="w-10 bg-[#121212] text-zinc-650 font-mono text-xs text-right py-4 pr-2 select-none border-r border-zinc-800 z-10">
                {Array.from({
                  length: Math.max(code.split("\n").length, 1),
                }).map((_, i) => (
                  <div key={i} className="leading-5 h-5">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Editing & Highlighting Overlay Container */}
              <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
                {/* Highlighted Code Display (Overlay underneath) */}
                <pre
                  ref={preRef}
                  className="absolute inset-0 p-4 font-mono text-xs leading-5 overflow-auto pointer-events-none whitespace-pre select-none tab-size-2 scrollbar-none text-[#abb2bf] m-0"
                  style={{ tabSize: 2 }}
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(code, "component.tsx"),
                  }}
                />

                {/* Transparent Interactive Textarea (User inputs here) */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => onCodeChange(e.target.value)}
                  onScroll={handleScroll}
                  className="absolute inset-0 bg-transparent text-transparent caret-white font-mono text-xs p-4 leading-5 w-full h-full focus:outline-none resize-none overflow-auto scrollbar-none whitespace-pre tab-size-2 select-text"
                  style={{ tabSize: 2 }}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Warning footer */}
            <div className="p-2.5 bg-zinc-900 border-t border-black text-[9px] font-mono text-zinc-550 select-none">
              💡 Editing compiles your GSAP changes automatically in real-time.
            </div>
          </div>
        ) : (
          /* Compiled Component Canvas */
          <div key={remountKey} className="w-full h-full relative z-10">
            <LiveRunner
              code={code}
              onCompileStart={onCompileStart}
              onCompileSuccess={onCompileSuccess}
              onCompileError={onCompileError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
