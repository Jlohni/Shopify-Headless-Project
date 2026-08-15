import React, { useState, useRef } from 'react';
import { Link } from '@remix-run/react';
import { Money } from '@shopify/hydrogen';
import { getTransparentProductImage } from '~/lib/transparentImages';

export function HeroShowcase({ products = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const carouselRef = useRef(null);

  if (!products || products.length === 0) return null;

  const currentProduct = products[selectedIndex] || products[0];

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
    <section className="bg-[#F5F5F5] py-8 sm:py-12 border-b border-[#E2E2E2] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Stage (Top Hero Showcase) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[460px] lg:min-h-[520px] gap-8 relative">
          
          {/* Left Content Area */}
          <div className="lg:col-span-6 space-y-5 z-20">
            
            {/* Vendor / Brand Accent Tag */}
            <div className="text-sm font-bold tracking-widest text-[#D7192D] uppercase">
              {vendor}.
            </div>

            {/* Product Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#151515] tracking-tight uppercase leading-[1.05]">
              {title}
            </h1>

            {/* Subtitle / Model Spec */}
            <div className="text-xs font-bold tracking-[0.2em] text-[#666666] uppercase">
              {currentProduct.productType || 'PERFORMANCE FOOTWEAR'}
            </div>

            {/* CTA + Price Combined Block */}
            <div className="flex items-center gap-0 pt-3">
              
              {/* Red SHOP NOW Button */}
              <Link
                to={`/products/${handle}`}
                className="bg-[#D7192D] hover:bg-[#b51223] text-white font-black text-xs sm:text-sm tracking-[0.18em] uppercase px-7 py-3.5 transition-colors shadow-md flex items-center justify-center"
              >
                SHOP NOW
              </Link>

              {/* Price Box */}
              <div className="border-2 border-[#D7192D] bg-white text-[#D7192D] font-bold text-xs sm:text-sm px-5 py-3 flex items-center gap-2">
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

          {/* Right Featured Image Stage */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[320px] sm:min-h-[380px] lg:min-h-[480px]">
            
            {/* Decorative Background Year / Collection Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="font-black text-7xl sm:text-9xl lg:text-[160px] leading-none text-black/[0.04] tracking-tighter uppercase">
                2026
              </span>
            </div>

            {/* Featured Transparent Product Image */}
            <div className="relative z-10 w-full max-w-md lg:max-w-lg transition-all duration-500 transform hover:scale-105">
              <img
                key={currentProduct.id}
                src={transparentImageUrl}
                alt={title}
                className="w-full h-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.18)] animate-fade-in"
              />
            </div>

          </div>

        </div>

        {/* Bottom Selector Carousel Controls */}
        <div className="pt-8 sm:pt-12 relative flex items-center">
          
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="p-3 text-[#D7192D] hover:text-[#900e1c] transition-colors z-20 shrink-0"
            aria-label="Previous Product"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="flex items-center gap-4 overflow-x-auto scrollbar-none py-2 px-2 flex-1 scroll-smooth snap-x snap-mandatory"
          >
            {products.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const thumbUrl = getTransparentProductImage(item);
              const itemPrice = item.priceRange?.minVariantPrice;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedIndex(idx)}
                  className={`snap-start flex flex-col items-center min-w-[140px] sm:min-w-[160px] p-2.5 rounded-xl transition-all duration-300 text-left border ${
                    isSelected
                      ? 'bg-white border-[#D7192D] shadow-md scale-105'
                      : 'bg-transparent border-transparent hover:bg-white/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-24 h-16 sm:w-28 sm:h-20 flex items-center justify-center p-1">
                    <img
                      src={thumbUrl}
                      alt={item.title}
                      className="w-full h-full object-contain drop-shadow-sm"
                    />
                  </div>
                  <div className="mt-2 text-center w-full">
                    <div className={`text-xs font-bold truncate ${isSelected ? 'text-[#D7192D]' : 'text-[#151515]'}`}>
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

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="p-3 text-[#D7192D] hover:text-[#900e1c] transition-colors z-20 shrink-0"
            aria-label="Next Product"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>

      </div>
    </section>
  );
}
