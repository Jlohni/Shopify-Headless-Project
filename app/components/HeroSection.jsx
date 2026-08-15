import React from 'react';
import { Link } from '@remix-run/react';
import { Money, Image } from '@shopify/hydrogen';

export function HeroSection({ heroProduct }) {
  const title = heroProduct?.title || 'Air Max 270';
  const price = heroProduct?.priceRange?.minVariantPrice || heroProduct?.variants?.nodes?.[0]?.price;
  const handle = heroProduct?.handle || 'nike-air-max-270';

  const imageData =
    heroProduct?.featuredImage ||
    heroProduct?.variants?.nodes?.[0]?.image ||
    null;

  const fallbackUrl = 'https://cdn.shopify.com/s/files/1/0584/1050/0149/files/image.png?v=1786804763';

  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
        
        {/* Left Column (Ivory) */}
        <div className="lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 lg:pl-16 lg:pr-8 py-12 lg:py-16 space-y-6 z-10">
          
          {/* Eyebrow */}
          <div className="space-y-1">
            <div className="w-8 h-[2px] bg-coral"></div>
            <span className="text-xs font-bold tracking-[0.2em] text-coral uppercase block pt-1">
              FEATURED / 01
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink tracking-tight leading-[1.05] uppercase">
            MOVE<br />DIFFERENT.
          </h1>

          {/* Description */}
          <p className="text-mutedText text-sm sm:text-base max-w-md font-normal leading-relaxed">
            Curated silhouettes. Timeless design.<br />For those who move with intention.
          </p>

          {/* Price */}
          <div className="text-xl sm:text-2xl font-black text-ink pt-2">
            {price ? (
              <Money data={price} />
            ) : (
              <span>₹8,999.00 INR</span>
            )}
          </div>

          {/* SHOP NOW Button */}
          <div className="pt-2">
            <Link
              to={`/products/${handle}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-ink text-white font-bold text-xs tracking-[0.18em] uppercase hover:bg-black transition-all glow-hover"
            >
              <span>SHOP NOW</span>
              <span className="text-sm">→</span>
            </Link>
          </div>

        </div>

        {/* Right Column (Coral Red Stage) */}
        <div className="lg:col-span-7 bg-coral relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[640px] overflow-hidden p-6 sm:p-12">
          
          {/* Giant Outlined Typography Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-outline-hero font-black text-6xl sm:text-8xl lg:text-[140px] xl:text-[170px] leading-none text-center whitespace-nowrap opacity-90 transform -rotate-6 lg:rotate-0">
              MOVE DIFFERENT.
            </span>
          </div>

          {/* Featured Product Image */}
          <div className="relative z-10 w-full max-w-lg lg:max-w-xl transform hover:scale-105 transition-transform duration-500 flex items-center justify-center">
            {imageData?.url ? (
              <Image
                data={imageData}
                alt={title}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)]"
              />
            ) : (
              <img
                src={fallbackUrl}
                alt={title}
                className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)]"
              />
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
