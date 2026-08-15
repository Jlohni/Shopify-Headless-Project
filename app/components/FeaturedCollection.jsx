import React, { useState } from 'react';
import { Link } from '@remix-run/react';
import { Money, Image } from '@shopify/hydrogen';
import { AddToCartButton } from './AddToCartButton';

export function FeaturedCollection({ products = [] }) {
  return (
    <section className="bg-ivory py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink uppercase tracking-tight">
            FIVE PAIRS.{' '}
            <span className="font-editorial font-normal lowercase italic text-ink/90 block sm:inline">
              ENDLESS ROTATION.
            </span>
          </h2>
          <div className="w-12 h-[2px] bg-coral mx-auto"></div>
        </div>

        {/* 5 Product Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCardItem key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ProductCardItem({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const variant = product.variants?.nodes?.[0];
  const price = product.priceRange?.minVariantPrice || variant?.price;

  // Robust Image Extraction from GraphQL Response
  const imageData =
    product.featuredImage ||
    variant?.image ||
    product.images?.nodes?.[0] ||
    null;

  const imageUrl =
    imageData?.url ||
    (typeof product.featuredImage === 'string' ? product.featuredImage : null) ||
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="product-card group flex flex-col justify-between bg-white rounded-2xl p-4 border border-borderColor/80 shadow-sm hover:shadow-xl transition-all duration-300 relative">
      
      {/* Top Wishlist Control */}
      <div className="flex items-center justify-between z-10 mb-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-mutedText">
          {product.vendor}
        </span>
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="text-slate-400 hover:text-coral transition-colors p-1"
          aria-label="Wishlist"
        >
          <svg className={`w-4 h-4 ${isWishlisted ? 'fill-coral text-coral' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-7.682-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Image Stage */}
      <Link to={`/products/${product.handle}`} className="block aspect-square overflow-hidden rounded-xl bg-ivory/60 p-2 mb-4 relative flex items-center justify-center">
        {imageData?.url ? (
          <Image
            data={imageData}
            alt={product.title}
            aspectRatio="1/1"
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
            className="product-card-image w-full h-full object-contain"
          />
        ) : (
          <img
            src={imageUrl}
            alt={product.title}
            className="product-card-image w-full h-full object-contain"
          />
        )}
      </Link>

      {/* Product Details */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-ink uppercase tracking-wider block">
          {product.vendor}
        </span>
        <Link to={`/products/${product.handle}`} className="font-extrabold text-sm sm:text-base text-ink line-clamp-1 hover:text-coral transition-colors">
          {product.title}
        </Link>
        <div className="text-sm font-bold text-ink pt-1">
          {price ? <Money data={price} /> : <span>₹8,999.00 INR</span>}
        </div>
      </div>

      {/* Quick Add Button */}
      <div className="pt-4 mt-2">
        {variant?.id ? (
          <AddToCartButton
            lines={[{ merchandiseId: variant.id, quantity: 1 }]}
            className="w-full btn-soleselect py-2.5 rounded-xl text-center flex items-center justify-center gap-2"
          >
            Quick Add
          </AddToCartButton>
        ) : (
          <button disabled className="w-full bg-slate-200 text-slate-400 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
            Sold Out
          </button>
        )}
      </div>

    </div>
  );
}
