import React from 'react';

export function AnnouncementBar() {
  return (
    <aside className="bg-gradient-to-r from-amber-600 via-rose-700 to-amber-600 text-white text-[11px] font-bold tracking-widest uppercase py-2.5 px-4 text-center border-b border-white/20 z-50 relative shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
        <span className="flex items-center gap-1.5 text-amber-200">
          <span>🎉</span> GRAND OPENING SOON: 2 OCT 2026
        </span>
        <span className="hidden sm:inline opacity-40">|</span>
        <span className="font-semibold text-white/95">
          📍 SHOP LOCATION: NINECART, MALDHAN CHOUR NO 4, MAIN ROAD (NEAR LIC OFFICE)
        </span>
      </div>
    </aside>
  );
}
