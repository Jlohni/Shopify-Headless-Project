import React, { useState, useRef } from 'react';
import { Link } from '@remix-run/react';
import { Money } from '@shopify/hydrogen';
import { getTransparentProductImage } from '~/lib/transparentImages';

export function HeroShowcase({ products = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const carouselRef = useRef(null);

  if (!products || products.length === 0) return null;

  // Determine active item (Hover preview if hovering over thumbnail, else selectedIndex)
  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const currentProduct = products[activeIndex] || products[0];

  // Data Extraction
  const vendor = currentProduct.vendor || 'SoleSelect';
  const title = currentProduct.title || 'Sneaker Edition';
  const handle = currentProduct.handle || '';
  const price = currentProduct.priceRange?.minVariantPrice;
  const compareAtPrice = currentProduct.variants?.nodes?.[0]?.compareAtPrice;
  const showCompareAt = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price?.amount || '0');
  const transparentImageUrl = getTransparentProductImage(currentProduct);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-[#F6F6F6] py-8 sm:py-14 border-b border-[#E5E5E5] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Hero Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[480px] lg:min-h-[560px] gap-8 lg:gap-12 relative">
          
          {/* Left Text & Details Content */}
          <div key={`text-${currentProduct.id}`} className="lg:col-span-5 space-y-6 z-20 animate-text-pop">
            
            {/* Vendor / Brand Accent Tag */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#D7192D]"></span>
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#D7192D] uppercase">
                {vendor}.
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#151515] tracking-tight uppercase leading-[1.04]">
              {title}
            </h1>

            {/* Subtitle / Model Spec */}
            <div className="text-xs font-bold tracking-[0.2em] text-[#777777] uppercase">
              {currentProduct.productType || 'PERFORMANCE FOOTWEAR'}
            </div>

            {/* CTA + Price Combined Block */}
            <div className="flex items-center gap-0 pt-4">
              
              {/* Red SHOP NOW Button */}
              <Link
                to={`/products/${handle}`}
                className="bg-[#D7192D] hover:bg-[#b51223] text-white font-black text-xs sm:text-sm tracking-[0.2em] uppercase px-8 py-4 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                SHOP NOW
              </Link>

              {/* Price Box */}
              <div className="border-2 border-[#D7192D] bg-white text-[#D7192D] font-bold text-xs sm:text-sm px-6 py-4 flex items-center gap-2 shadow-sm">
                {price ? (
                  <Money data={price} />
                ) : (
                  <span>₹8,999.00 INR</span>
                )}
                {showCompareAt && (
                  <span className="line-through text-xs text-slate-400 font-normal">
                    <Money data={compareAtPrice} />
                  </span>
                )}
              </div>

            </div>

          </div>

          {/* Right Featured Image Stage (Expanded to full right space) */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[560px] p-4 sm:p-8">
            
            {/* Subtle Background Glow behind shoe */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 lg:w-[460px] lg:h-[460px] bg-gradient-to-tr from-[#D7192D]/10 via-[#D7192D]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            {/* Decorative Background Year / Collection Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="font-black text-8xl sm:text-[140px] lg:text-[200px] leading-none text-black/[0.035] tracking-tighter uppercase">
                2026
              </span>
            </div>

            {/* Prominent Featured Transparent Product Image with Hover & Switch Animations */}
            <div
              key={`image-${currentProduct.id}`}
              className="relative z-10 w-full max-w-lg lg:max-w-xl xl:max-w-2xl animate-shoe-pop shoe-hover-stage flex items-center justify-center"
            >
              <img
                src={transparentImageUrl}
                alt={title}
                className="w-full h-auto object-contain max-h-[440px] lg:max-h-[520px] drop-shadow-[0_22px_25px_rgba(0,0,0,0.2)]"
              />
            </div>

          </div>

        </div>

        {/* Bottom Selector Grid Controls (Balanced Full Width Layout) */}
        <div className="pt-8 sm:pt-14 relative flex items-center gap-2 sm:gap-4">
          
          {/* Previous Arrow Button */}
          <button
            onClick={handlePrev}
            className="p-2.5 text-[#D7192D] hover:text-[#900e1c] transition-all hover:scale-125 z-20 shrink-0"
            aria-label="Previous Product"
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.8} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Product Track Grid (5 Equal Width Cards) */}
          <div
            ref={carouselRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 flex-1 items-center"
          >
            {products.slice(0, 5).map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isHovered = idx === hoveredIndex;
              const thumbUrl = getTransparentProductImage(item);
              const itemPrice = item.priceRange?.minVariantPrice;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedIndex(idx)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`group flex flex-col items-center w-full p-3.5 rounded-2xl transition-all duration-300 text-left border ${
                    isSelected
                      ? 'bg-white border-[#D7192D] shadow-lg scale-105 -translate-y-1'
                      : isHovered
                      ? 'bg-white/80 border-[#D7192D]/40 shadow-md scale-105 -translate-y-1'
                      : 'bg-white/40 border-transparent hover:bg-white/70 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="w-full h-16 sm:h-20 flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={thumbUrl}
                      alt={item.title}
                      className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                    />
                  </div>
                  <div className="mt-2 text-center w-full">
                    <div className={`text-xs font-bold truncate ${isSelected || isHovered ? 'text-[#D7192D]' : 'text-[#151515]'}`}>
                      {item.title}
                    </div>
                    <div className="text-[11px] font-bold text-[#D7192D] mt-0.5">
                      {itemPrice ? <Money data={itemPrice} /> : '₹8,999.00'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Arrow Button */}
          <button
            onClick={handleNext}
            className="p-2.5 text-[#D7192D] hover:text-[#900e1c] transition-all hover:scale-125 z-20 shrink-0"
            aria-label="Next Product"
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.8} d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>

      </div>
    </section>
  );
}
