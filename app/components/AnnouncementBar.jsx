import React from 'react';

export function AnnouncementBar() {
  return (
    <aside className="bg-ink text-white text-[11px] font-bold tracking-widest uppercase py-2.5 px-4 text-center border-b border-white/10 z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="text-coral">✈</span> FREE SHIPPING ABOVE ₹7,500
        </span>
        <span className="hidden sm:inline opacity-30">|</span>
        <span className="hidden sm:inline">EASY 30-DAY RETURNS</span>
        <span className="hidden md:inline opacity-30">|</span>
        <span className="hidden md:inline">AUTHENTICITY GUARANTEED</span>
      </div>
    </aside>
  );
}
