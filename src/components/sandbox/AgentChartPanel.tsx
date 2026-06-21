"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, CornerDownLeft } from "lucide-react";

interface Message {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
}

interface AgentChartPanelProps {
  onSendMessage?: (text: string) => void;
}

export default function AgentChartPanel({ onSendMessage }: AgentChartPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "agent",
      text: "Hello! I am TweenBot. Describe the GSAP animation component you want to build, and I will generate the React + TypeScript code for you.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    onSendMessage?.(inputValue);
    setInputValue("");

    // Simulate agent typing & responding
    setTimeout(() => {
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: `Understood! Initiating GSAP compilation for your request: "${inputValue}". Generating code...`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f0eadf] text-[#2a2a2a] overflow-hidden select-none">
      {/* Workspace Header */}
      <div className="p-4 border-b-3 border-black bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#0c9367] border-2 border-black animate-pulse" />
          <h1 className="font-mono text-sm font-black uppercase tracking-tight">
            TWEENBOT // WORKSPACE
          </h1>
        </div>
        <div className="px-2 py-0.5 bg-[#f1b333] border-2 border-black font-mono text-[9px] font-black uppercase rounded shadow-[1.5px_1.5px_0px_#000]">
          V0.1.6-AGENT
        </div>
      </div>

      {/* Scrollable Agent Chat Logs */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-none">
        {messages.map((msg) => {
          const isAgent = msg.sender === "agent";
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                isAgent ? "self-start" : "self-end"
              }`}
            >
              {/* Message Header */}
              <div
                className={`flex items-center gap-1.5 font-mono text-[10px] font-bold text-zinc-500 mb-1 px-1 ${
                  isAgent ? "justify-start" : "justify-end"
                }`}
              >
                {isAgent ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-[#6758a5]" />
                    <span>TWEENBOT</span>
                  </>
                ) : (
                  <>
                    <span>USER</span>
                    <User className="w-3.5 h-3.5 text-[#e55b3c]" />
                  </>
                )}
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Content Bubble */}
              <div
                className={`p-3 border-3 border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] text-xs font-mono leading-relaxed select-text ${
                  isAgent ? "bg-white text-black" : "bg-[#6758a5] text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Fixed bottom input box */}
      <div className="p-4 border-t-3 border-black bg-white shrink-0">
        <div className="relative border-3 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden flex bg-white">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or request an animation change..."
            className="flex-1 bg-transparent px-4 py-3 font-mono text-xs focus:outline-none resize-none h-16 max-h-16 text-black"
          />
          <div className="flex flex-col justify-end p-2 bg-white">
            <button
              onClick={handleSend}
              className="p-2 bg-[#6758a5] text-white border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-zinc-400 select-none px-1">
          <span>Press Enter to send</span>
          <span className="flex items-center gap-0.5">
            Shift + Enter for new line <CornerDownLeft className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
