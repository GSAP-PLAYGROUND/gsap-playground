export default function Header() {
  return (
    <header className="sticky top-0 left-0 w-full z-45 bg-white border-b-3 border-[#2a2a2a] shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 rounded-full bg-wtf-orange border border-[#2a2a2a] shadow-[1px_1px_0px_#2a2a2a] animate-pulse" />
          <span className="font-serif font-black text-lg md:text-xl tracking-tight text-[#2a2a2a]">
            TweenLabs
          </span>
        </div>
      </div>
    </header>
  );
}
