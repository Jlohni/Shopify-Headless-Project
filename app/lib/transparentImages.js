/**
 * Mapping of supplied high-res transparent PNG images to Shopify product handles.
 * Falls back to Shopify product featuredImage URL when no supplied image is matched.
 */
export const SUPPLIED_TRANSPARENT_IMAGES = {
  'adidas-ultraboost-22': '/assets/shoes/adidas-ultraboost-22.png',
  'new-balance-574': '/assets/shoes/new-balance-574.png',
  'puma-rs-x-sneakers': '/assets/shoes/puma-rs-x-sneakers.png',
  'reebok-classic-leather': '/assets/shoes/reebok-classic-leather.png',
};

export function getTransparentProductImage(product) {
  if (!product) return null;
  const handle = product.handle?.toLowerCase();
  
  if (handle && SUPPLIED_TRANSPARENT_IMAGES[handle]) {
    return SUPPLIED_TRANSPARENT_IMAGES[handle];
  }

  // Fallback to Shopify featured image or variant image
  return (
    product.featuredImage?.url ||
    product.variants?.nodes?.[0]?.image?.url ||
    product.images?.nodes?.[0]?.url ||
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
  );
}
