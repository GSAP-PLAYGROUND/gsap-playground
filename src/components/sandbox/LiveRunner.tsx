"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as LucideIcons from "lucide-react";
import { SandboxErrorBoundary } from "./ErrorBoundary";
import { Loader2 } from "lucide-react";

// Register GSAP plugins in outer scope
gsap.registerPlugin(useGSAP);

interface LiveRunnerProps {
  code: string;
  onCompileStart?: () => void;
  onCompileSuccess?: (logs: string[]) => void;
  onCompileError?: (err: Error) => void;
}

export default function LiveRunner({
  code,
  onCompileStart,
  onCompileSuccess,
  onCompileError,
}: LiveRunnerProps) {
  const [isBabelLoaded, setIsBabelLoaded] = useState(false);
  const [babelError, setBabelError] = useState<string | null>(null);
  const [RenderedComponent, setRenderedComponent] = useState<React.ComponentType | null>(null);
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const compileTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load Babel Standalone from CDN
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Babel is already loaded
    if ((window as any).Babel) {
      setIsBabelLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@babel/standalone@7.24.0/babel.min.js";
    script.async = true;
    script.onload = () => {
      setIsBabelLoaded(true);
    };
    script.onerror = () => {
      setBabelError("Failed to load Babel compiler from CDN. Please check your internet connection.");
    };

    document.head.appendChild(script);

    return () => {
      // Clean up script if unmounted before loading completes (rare)
    };
  }, []);

  // Compile TSX to JS when code changes and Babel is loaded
  useEffect(() => {
    if (!isBabelLoaded) return;

    if (compileTimeoutRef.current) {
      clearTimeout(compileTimeoutRef.current);
    }

    // Debounce compilation to avoid thrashing CPU on keypresses
    compileTimeoutRef.current = setTimeout(() => {
      compileCode();
    }, 400);

    return () => {
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current);
      }
    };
  }, [code, isBabelLoaded]);

  const compileCode = () => {
    onCompileStart?.();
    const startTime = performance.now();
    const logs: string[] = [];

    try {
      logs.push(`[Compiler] Initializing transpilation...`);
      const Babel = (window as any).Babel;
      if (!Babel) {
        throw new Error("Babel standalone compiler is not ready.");
      }

      // Transpile JSX/TSX code
      logs.push(`[Compiler] Parsing TSX syntax trees...`);
      const transformed = Babel.transform(code, {
        presets: ["env", "react"],
        filename: "dynamic-component.tsx",
      }).code;

      logs.push(`[Compiler] Transpilation complete. Executing module factory...`);

      // Mock CJS require
      const customRequire = (moduleName: string) => {
        logs.push(`[Runtime] Resolving module: "${moduleName}"`);
        if (moduleName === "react" || moduleName === "React") {
          return React;
        }
        if (moduleName === "gsap") {
          return gsap;
        }
        if (moduleName === "@gsap/react") {
          return { useGSAP };
        }
        if (moduleName === "lucide-react") {
          return LucideIcons;
        }
        throw new Error(`Module "${moduleName}" is not available in the sandbox workspace.`);
      };

      // Set up CJS environment
      const exports: any = {};
      const module = { exports };

      // Wrap in scope and execute
      // Injected keys: React, gsap, useGSAP, require, exports, module
      const factory = new Function(
        "React",
        "gsap",
        "useGSAP",
        "require",
        "exports",
        "module",
        transformed
      );

      factory(React, gsap, useGSAP, customRequire, exports, module);

      // Extract the exported react component
      const Component = exports.default || module.exports.default || module.exports;

      if (!Component) {
        throw new Error(
          "The compiled code did not export a default component. Ensure you have 'export default function ComponentName() { ... }'"
        );
      }

      // Test instantiate
      if (typeof Component !== "function") {
        throw new Error("Exported default element is not a valid React Component function.");
      }

      const duration = (performance.now() - startTime).toFixed(1);
      logs.push(`[Compiler] Success! Component compiled and linked in ${duration}ms.`);
      
      setRenderedComponent(() => Component);
      setCompileLogs(logs);
      onCompileSuccess?.(logs);
    } catch (err: any) {
      logs.push(`[Compiler Error] ${err.message}`);
      setCompileLogs(logs);
      onCompileError?.(err);
      
      // Fallback component showing execution error
      const ErrComponent = () => {
        throw err; // Trigger ErrorBoundary
      };
      setRenderedComponent(() => ErrComponent);
    }
  };

  if (babelError) {
    return (
      <div className="p-6 bg-[#1a1a1a] text-red-500 border-3 border-red-500 font-mono text-sm shadow-[4px_4px_0px_#000]">
        <p className="font-bold">❌ BABEL ERROR:</p>
        <p className="mt-2 text-red-400">{babelError}</p>
      </div>
    );
  }

  if (!isBabelLoaded) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-[#f0eadf] border-3 border-dashed border-[#2a2a2a] p-8">
        <Loader2 className="w-10 h-10 animate-spin text-[#6758a5] mb-4" />
        <p className="font-mono text-xs font-bold text-[#2a2a2a] uppercase tracking-wider">
          Fetching Client-Side Compiler Engine...
        </p>
        <p className="font-mono text-[10px] text-zinc-500 mt-1">
          Downloading @babel/standalone (2.4MB)
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <SandboxErrorBoundary>
        {RenderedComponent ? (
          <RenderedComponent />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#171717] text-zinc-500 font-mono text-sm">
            Compiling and rendering workspace...
          </div>
        )}
      </SandboxErrorBoundary>
    </div>
  );
}
