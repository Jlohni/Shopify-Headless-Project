import {useRef, Suspense, useState} from 'react';
import {Disclosure} from '@headlessui/react';
import {defer} from '@shopify/remix-oxygen';
import {useLoaderData, Await, Link} from '@remix-run/react';
import {
  getSeoMeta,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import {AddToCartButton} from '~/components/AddToCartButton';
import {Skeleton} from '~/components/Skeleton';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {getExcerpt} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getTransparentProductImage} from '~/lib/transparentImages';

export const headers = routeHeaders;

export async function loader(args) {
  const {productHandle} = args.params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const criticalData = await loadCriticalData(args);
  return defer({...criticalData});
}

async function loadCriticalData({params, request, context}) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  let shop = null;
  let product = null;

  try {
    const res = await context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    });
    shop = res?.shop;
    product = res?.product;
  } catch (err) {
    // Fallback handling
  }

  // Fallback to nike-air-max-270 if requested handle is missing
  if (!product?.id) {
    try {
      const fallbackRes = await context.storefront.query(PRODUCT_QUERY, {
        variables: {
          handle: 'nike-air-max-270',
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
      });
      product = fallbackRes?.product;
      shop = fallbackRes?.shop || shop;
    } catch (e) {
      // Fallback
    }
  }

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);
  const variants = product.variants?.nodes || [];
  const selectedVariant = variants[0] || {};

  const seo = seoPayload.product({
    product: {...product, variants},
    selectedVariant,
    url: request.url,
  });

  return {
    product,
    variants,
    shop: shop || {primaryDomain: {url: 'jagdish-lohni.myshopify.com'}},
    storeDomain: shop?.primaryDomain?.url || 'jagdish-lohni.myshopify.com',
    recommended,
    seo,
  };
}

export const meta = ({data}) => {
  return getSeoMeta(data?.seo);
};

export default function Product() {
  const {product, shop, recommended, variants, storeDomain} = useLoaderData();
  const {title, vendor, descriptionHtml} = product;
  const {shippingPolicy, refundPolicy} = shop || {};

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = variants[selectedVariantIndex] || variants[0] || {};

  // Extract transparent image or fallback
  const transparentImg = getTransparentProductImage(product);

  const checkoutUrl = selectedVariant?.id
    ? `https://${storeDomain}/cart/${selectedVariant.id.replace('gid://shopify/ProductVariant/', '')}:1`
    : '#';

  return (
    <div className="bg-ivory min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-mutedText uppercase">
          <Link to="/" className="hover:text-coral transition-colors">HOME</Link>
          <span>/</span>
          <Link to="/collections/all" className="hover:text-coral transition-colors">PRODUCTS</Link>
          <span>/</span>
          <span className="text-ink">{title}</span>
        </div>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Image Stage */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-12 border border-borderColor shadow-sm flex items-center justify-center relative overflow-hidden min-h-[420px] lg:min-h-[540px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-coral/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 w-full max-w-lg transform hover:scale-105 transition-transform duration-500 flex items-center justify-center">
              <img
                src={transparentImg}
                alt={title}
                className="w-full h-auto object-contain max-h-[440px] drop-shadow-[0_22px_25px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>

          {/* Right Column: Product Form & Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Vendor Tag */}
            <div className="space-y-1">
              <div className="w-8 h-[2px] bg-coral"></div>
              <span className="text-xs font-bold tracking-[0.2em] text-coral uppercase block pt-1">
                {vendor}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink uppercase tracking-tight leading-[1.08]">
              {title}
            </h1>

            {/* Price Display */}
            <div className="text-2xl font-black text-ink flex items-center gap-3 pt-1">
              {selectedVariant?.price ? (
                <Money data={selectedVariant.price} />
              ) : (
                <span>₹8,999.00 INR</span>
              )}
              {selectedVariant?.compareAtPrice && (
                <span className="line-through text-sm text-slate-400 font-normal">
                  <Money data={selectedVariant.compareAtPrice} />
                </span>
              )}
            </div>

            {/* Product Variant Option Selectors */}
            <div className="space-y-6 pt-2">
              {variants.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold tracking-wider text-ink uppercase block">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {variants.map((v, idx) => {
                      const isSelected = idx === selectedVariantIndex;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariantIndex(idx)}
                          className={`px-4 py-2.5 text-xs font-bold rounded-xl uppercase transition-all duration-200 border ${
                            isSelected
                              ? 'bg-ink text-white border-ink shadow-md scale-105'
                              : v.availableForSale
                              ? 'bg-white text-ink border-borderColor hover:border-coral'
                              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                          }`}
                        >
                          {v.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to Bag & Direct Checkout Buttons */}
              <div className="space-y-3 pt-2">
                {!selectedVariant?.availableForSale ? (
                  <button disabled className="w-full bg-slate-200 text-slate-400 py-4 rounded-xl text-xs font-bold uppercase tracking-wider">
                    Sold Out
                  </button>
                ) : (
                  <>
                    <AddToCartButton
                      lines={[
                        {
                          merchandiseId: selectedVariant?.id,
                          quantity: 1,
                        },
                      ]}
                      className="w-full btn-soleselect py-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs tracking-[0.18em]"
                    >
                      <span>ADD TO BAG</span>
                      <span>—</span>
                      {selectedVariant?.price && (
                        <Money withoutTrailingZeros data={selectedVariant.price} />
                      )}
                    </AddToCartButton>

                    <a
                      href={checkoutUrl}
                      className="w-full bg-[#151515] hover:bg-black text-white font-bold py-4 rounded-xl text-center block text-xs tracking-[0.18em] uppercase transition-all shadow-md hover:shadow-lg"
                    >
                      BUY IT NOW
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Accordion Disclosures */}
            <div className="border-t border-borderColor pt-6 space-y-4">
              {descriptionHtml && (
                <ProductDetail
                  title="Product Details & Crafting"
                  content={descriptionHtml}
                />
              )}
              {shippingPolicy?.body && (
                <ProductDetail
                  title="Express Delivery"
                  content={getExcerpt(shippingPolicy.body)}
                  learnMore={`/policies/${shippingPolicy.handle}`}
                />
              )}
              {refundPolicy?.body && (
                <ProductDetail
                  title="30-Day Easy Returns"
                  content={getExcerpt(refundPolicy.body)}
                  learnMore={`/policies/${refundPolicy.handle}`}
                />
              )}
            </div>

          </div>

        </div>

        {/* Related Products Section */}
        <div className="pt-16 border-t border-borderColor">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <Await
              errorElement="There was a problem loading related products"
              resolve={recommended}
            >
              {(products) => (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-ink uppercase tracking-tight">
                      RELATED SILHOUETTES
                    </h2>
                    <div className="w-12 h-[2px] bg-coral mx-auto"></div>
                  </div>
                  <ProductSwimlane products={products?.nodes || []} />
                </div>
              )}
            </Await>
          </Suspense>
        </div>

      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price?.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

function ProductDetail({title, content, learnMore}) {
  return (
    <Disclosure key={title} as="div" className="border-b border-borderColor/60 pb-4">
      {({open}) => (
        <>
          <Disclosure.Button className="w-full flex items-center justify-between py-2 text-left">
            <span className="text-xs font-bold tracking-wider text-ink uppercase">
              {title}
            </span>
            <span className="text-lg font-bold text-coral">
              {open ? '−' : '+'}
            </span>
          </Disclosure.Button>

          <Disclosure.Panel className="pt-2 text-xs text-mutedText leading-relaxed space-y-2">
            <div dangerouslySetInnerHTML={{__html: content}} />
            {learnMore && (
              <Link to={learnMore} className="inline-block text-coral font-bold pt-1 hover:underline">
                Learn Policy →
              </Link>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    variants(first: 20) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
    media(first: 7) {
      nodes {
        ...Media
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

async function getRecommendedProducts(storefront, productId) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  }).catch(() => null);

  if (!products) return {nodes: []};

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional?.nodes || [])
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  if (originalProduct !== -1) {
    mergedProducts.splice(originalProduct, 1);
  }

  return {nodes: mergedProducts};
}
