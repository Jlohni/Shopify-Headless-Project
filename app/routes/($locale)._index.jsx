import {defer} from '@shopify/remix-oxygen';
import {Suspense, useState} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';

import {HeroShowcase} from '~/components/HeroShowcase';
import {FeaturedCollection} from '~/components/FeaturedCollection';
import {EditorialFeature} from '~/components/EditorialFeature';
import {ServiceBenefits} from '~/components/ServiceBenefits';
import {NewsletterSection} from '~/components/NewsletterSection';
import {OpeningSoon} from '~/components/OpeningSoon';

import {STOREFRONT_CONFIG, FALLBACK_PRODUCTS} from '~/lib/storefront.config';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader(args) {
  const {params, context, request} = args;
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    throw new Response(null, {status: 404});
  }

  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context, request}) {
  const {language, country} = context.storefront.i18n;

  const [
    {product: heroProduct},
    {collection: homepageCollection},
    metaobjectsData,
  ] = await Promise.all([
    context.storefront
      .query(FEATURED_PRODUCT_QUERY, {
        variables: {
          handle: STOREFRONT_CONFIG.featuredProductHandle,
          country,
          language,
        },
      })
      .catch(() => ({product: null})),

    context.storefront
      .query(HOMEPAGE_COLLECTION_QUERY, {
        variables: {
          handle: STOREFRONT_CONFIG.homepageCollectionHandle,
          country,
          language,
        },
      })
      .catch(() => ({collection: null})),

    context.storefront
      .query(HOMEPAGE_METAOBJECTS_QUERY, {
        variables: {country, language},
      })
      .catch(() => null),
  ]);

  // Fallback query if home-page-shoes collection isn't created yet in live Shopify store
  let fallbackProducts = null;
  if (!homepageCollection || !homepageCollection.products?.nodes?.length) {
    const allProductsData = await context.storefront
      .query(ALL_PRODUCTS_QUERY, {
        variables: {country, language},
      })
      .catch(() => null);
    fallbackProducts = allProductsData?.products?.nodes || null;
  }

  return {
    heroProduct,
    homepageCollection,
    fallbackProducts,
    homepageMetaobjects: metaobjectsData?.metaobjects?.nodes || [],
    seo: seoPayload.home({url: request.url}),
  };
}

function loadDeferredData() {
  return {};
}

export const meta = ({matches}) => {
  return getSeoMeta(...matches.map((match) => match.data.seo));
};

const TARGET_LAUNCH_DATE = new Date('2026-10-02T00:00:00+05:30').getTime();

export default function Homepage() {
  const [isLive, setIsLive] = useState(() => Date.now() >= TARGET_LAUNCH_DATE);
  const {homepageCollection, fallbackProducts, homepageMetaobjects} = useLoaderData();

  if (!isLive) {
    return <OpeningSoon onLaunch={() => setIsLive(true)} />;
  }

  // Determine products to display (Live Collection -> Live All Products -> Fallback Static Data)
  const displayProducts =
    homepageCollection?.products?.nodes?.length > 0
      ? homepageCollection.products.nodes.slice(0, 6)
      : fallbackProducts?.length > 0
      ? fallbackProducts.slice(0, 6)
      : FALLBACK_PRODUCTS;

  return (
    <div className="space-y-0">
      {/* Top Interactive Hero Showcase with Metaobject Customization Support */}
      <HeroShowcase products={displayProducts} metaobjects={homepageMetaobjects} />

      {/* 5-Pair Featured Collection Edit */}
      <FeaturedCollection products={displayProducts} />

      {/* Editorial Journal Feature */}
      <EditorialFeature />

      {/* Service Benefits */}
      <ServiceBenefits />

      {/* Good Shoes Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}

const FEATURED_PRODUCT_QUERY = `#graphql
  query featuredProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      description
      productType
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
      }
      variants(first: 1) {
        nodes {
          id
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

const HOMEPAGE_COLLECTION_QUERY = `#graphql
  query homepageCollection($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: 6) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

const ALL_PRODUCTS_QUERY = `#graphql
  query allProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 6) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

const HOMEPAGE_METAOBJECTS_QUERY = `#graphql
  query homepageMetaobjects($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    metaobjects(type: "homepage_hero", first: 5) {
      nodes {
        id
        handle
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;
