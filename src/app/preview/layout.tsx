import type React from "react";
import PreviewLenis from "./PreviewLenis";

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      id="main-scroller"
      className="h-svh w-full overflow-y-auto overflow-x-hidden bg-[#f0eadf] scroll-smooth scrollbar-none"
    >
      {children}
      <PreviewLenis />
    </main>
  );
}
