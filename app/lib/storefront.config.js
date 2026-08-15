/**
 * SoleSelect Storefront Configuration
 * Centralized settings for featured handles & fallback dataset
 */

export const STOREFRONT_CONFIG = {
  brandName: 'SOLESELECT',
  featuredProductHandle: 'nike-air-max-270',
  homepageCollectionHandle: 'home-page-shoes',
  productLimit: 5,
};

export const FALLBACK_PRODUCTS = [
  {
    id: 'gid://shopify/Product/fallback-1',
    vendor: 'Nike',
    title: 'Air Max 270',
    handle: 'nike-air-max-270',
    availableForSale: true,
    badge: 'Bestseller',
    colour: 'Crimson / Charcoal',
    priceRange: {
      minVariantPrice: {
        amount: '8999.00',
        currencyCode: 'INR',
      },
    },
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0584/1050/0149/files/image.png?v=1786804763',
      altText: 'Nike Air Max 270',
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/fallback-v1',
          availableForSale: true,
          price: { amount: '8999.00', currencyCode: 'INR' },
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/fallback-2',
    vendor: 'Adidas',
    title: 'Ultraboost 22',
    handle: 'adidas-ultraboost-22',
    availableForSale: true,
    badge: 'New season',
    colour: 'Cloud White / Lime',
    priceRange: {
      minVariantPrice: {
        amount: '12999.00',
        currencyCode: 'INR',
      },
    },
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0584/1050/0149/files/image_56e5c907-bb6d-4b41-85e9-c57c3f2b50ce.png?v=1786804950',
      altText: 'Adidas Ultraboost 22',
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/fallback-v2',
          availableForSale: true,
          price: { amount: '12999.00', currencyCode: 'INR' },
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/fallback-3',
    vendor: 'Puma',
    title: 'RS-X Sneakers',
    handle: 'puma-rs-x-sneakers',
    availableForSale: true,
    badge: '',
    colour: 'Cobalt / Orange',
    priceRange: {
      minVariantPrice: {
        amount: '7499.00',
        currencyCode: 'INR',
      },
    },
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0584/1050/0149/files/image_db9d69aa-ac28-4434-8836-3d800224a6de.png?v=1786804977',
      altText: 'Puma RS-X Sneakers',
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/fallback-v3',
          availableForSale: true,
          price: { amount: '7499.00', currencyCode: 'INR' },
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/fallback-4',
    vendor: 'Reebok',
    title: 'Classic Leather',
    handle: 'reebok-classic-leather',
    availableForSale: true,
    badge: '',
    colour: 'Chalk / Forest',
    priceRange: {
      minVariantPrice: {
        amount: '5999.00',
        currencyCode: 'INR',
      },
    },
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0584/1050/0149/files/image_60bd2041-e018-44de-a412-23737706d56e.png?v=1786805052',
      altText: 'Reebok Classic Leather',
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/fallback-v4',
          availableForSale: true,
          price: { amount: '5999.00', currencyCode: 'INR' },
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/fallback-5',
    vendor: 'New Balance',
    title: '574',
    handle: 'new-balance-574',
    availableForSale: true,
    badge: "Editor's pick",
    colour: 'Sand / Burgundy',
    priceRange: {
      minVariantPrice: {
        amount: '6999.00',
        currencyCode: 'INR',
      },
    },
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0584/1050/0149/files/image_ef823cb3-0f5d-4149-b13e-48dec082ce43.png?v=1786805027',
      altText: 'New Balance 574',
    },
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/fallback-v5',
          availableForSale: true,
          price: { amount: '6999.00', currencyCode: 'INR' },
        },
      ],
    },
  },
];
