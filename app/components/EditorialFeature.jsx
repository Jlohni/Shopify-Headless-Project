import React from 'react';
import { Link } from '@remix-run/react';

export function EditorialFeature() {
  return (
    <section className="relative bg-ink overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
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

        {/* Right Lifestyle Photo Column */}
        <div className="lg:col-span-7 relative min-h-[350px] sm:min-h-[420px] lg:min-h-[500px]">
          <img
            src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80"
            alt="SoleSelect Journal Lifestyle Still Life"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coral/30 via-transparent to-transparent lg:hidden"></div>
        </div>

      </div>
    </section>
  );
}
