import React from 'react';
import { Link } from '@remix-run/react';

export function EditorialFeature() {
  return (
    <section className="relative bg-ink overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] lg:min-h-[560px]">
        
        {/* Left Coral Column */}
        <div className="lg:col-span-5 bg-coral flex flex-col justify-center px-6 sm:px-12 lg:pl-16 lg:pr-8 py-12 lg:py-16 space-y-6 text-white z-10">
          
          <div className="space-y-1">
            <div className="w-8 h-[2px] bg-white"></div>
            <span className="text-xs font-bold tracking-[0.2em] text-white/90 uppercase block pt-1">
              JOURNAL / STYLE GUIDE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.1]">
            THE ONE-SHOE<br />
            <span className="font-editorial font-normal lowercase italic text-white/90 block">
              HOLIDAY PACKING LIST.
            </span>
          </h2>

          <p className="text-white/80 text-sm sm:text-base max-w-md font-normal leading-relaxed">
            Lighten your luggage. Elevate every look.<br />One pair that goes the distance.
          </p>

          <div className="pt-2">
            <Link
              to="/journal/one-shoe-holiday-packing-list"
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-ink text-white font-bold text-xs tracking-[0.18em] uppercase hover:bg-black transition-all glow-hover"
            >
              <span>READ THE STORY</span>
              <span>→</span>
            </Link>
          </div>

        </div>

        {/* Right Stage with Transparent Sneaker Asset */}
        <div className="lg:col-span-7 bg-[#F3EFEA] relative flex items-center justify-center p-8 sm:p-12 lg:p-16 min-h-[380px] sm:min-h-[440px] lg:min-h-[560px] overflow-hidden">
          
          {/* Subtle Background Typography */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-black text-7xl sm:text-9xl lg:text-[140px] leading-none text-ink/[0.04] uppercase tracking-tighter transform -rotate-3">
              ESSENTIAL
            </span>
          </div>

          {/* Transparent Sneaker Image */}
          <div className="relative z-10 w-full max-w-md sm:max-w-lg transform hover:scale-105 transition-transform duration-500">
            <img
              src="/assets/shoes/new-balance-574.png"
              alt="The One-Shoe Holiday Packing List Sneaker"
              className="w-full h-auto object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.22)]"
            />
          </div>

          {/* Small Floating Spec Tag */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-borderColor shadow-sm text-[11px] font-bold text-ink uppercase tracking-widest z-20">
            NEW BALANCE 574
          </div>

        </div>

      </div>
    </section>
  );
}
