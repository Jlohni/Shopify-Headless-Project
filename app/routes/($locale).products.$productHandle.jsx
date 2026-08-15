import {useRef, Suspense, useState} from 'react';
import {Disclosure, Listbox} from '@headlessui/react';
import {defer} from '@shopify/remix-oxygen';
import {useLoaderData, Await, Link} from '@remix-run/react';
import {
  getSeoMeta,
  Money,
  ShopPayButton,
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  getProductOptions,
  Image,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';

import {AddToCartButton} from '~/components/AddToCartButton';
import {Skeleton} from '~/components/Skeleton';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {IconCaret, IconCheck, IconClose} from '~/components/Icon';
import {getExcerpt} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getTransparentProductImage} from '~/lib/transparentImages';

export const headers = routeHeaders;

export async function loader(args) {
  const {productHandle} = args.params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({params, request, context}) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const [{shop, product}] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        selectedOptions,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
  ]);

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);
  const selectedVariant = product.selectedOrFirstAvailableVariant ?? {};
  const variants = getAdjacentAndFirstAvailableVariants(product);

  const seo = seoPayload.product({
    product: {...product, variants},
    selectedVariant,
    url: request.url,
  });

  return {
    product,
    variants,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    seo,
  };
}

function loadDeferredData() {
  return {};
}

export const meta = ({matches}) => {
  return getSeoMeta(...matches.map((match) => match.data.seo));
};

export default function Product() {
  const {product, shop, recommended, variants, storeDomain} = useLoaderData();
  const {media, title, vendor, descriptionHtml} = product;
  const {shippingPolicy, refundPolicy} = shop;

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    variants,
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  // Extract transparent image or Shopify media image
  const transparentImg = getTransparentProductImage(product);

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
            
            <div className="relative z-10 w-full max-w-lg transform hover:scale-105 transition-transform duration-500">
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

            {/* Product Options & Add to Bag */}
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
              storeDomain={storeDomain}
            />

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

export function ProductForm({productOptions, selectedVariant, storeDomain}) {
  const closeRef = useRef(null);
  const isOutOfStock = !selectedVariant?.availableForSale;

  return (
    <div className="space-y-6 pt-2">
      {productOptions.map((option) => (
        <div key={option.name} className="space-y-3">
          <label className="text-xs font-bold tracking-wider text-ink uppercase block">
            Select {option.name}
          </label>
          <div className="flex flex-wrap gap-2.5">
            {option.optionValues.map(
              ({
                name,
                variantUriQuery,
                handle,
                selected,
                available,
              }) => (
                <Link
                  key={option.name + name}
                  to={`/products/${handle}?${variantUriQuery}`}
                  preventScrollReset
                  prefetch="intent"
                  replace
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl uppercase transition-all duration-200 border ${
                    selected
                      ? 'bg-ink text-white border-ink shadow-md'
                      : available
                      ? 'bg-white text-ink border-borderColor hover:border-coral'
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                  }`}
                >
                  {name}
                </Link>
              ),
            )}
          </div>
        </div>
      ))}

      {/* Add to Cart & Buy Now Buttons */}
      <div className="space-y-3 pt-2">
        {isOutOfStock ? (
          <button disabled className="w-full bg-slate-200 text-slate-400 py-4 rounded-xl text-xs font-bold uppercase tracking-wider">
            Sold Out
          </button>
        ) : (
          <AddToCartButton
            lines={[
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
              },
            ]}
            className="w-full btn-soleselect py-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs tracking-[0.18em]"
          >
            <span>ADD TO BAG</span>
            <span>—</span>
            <Money withoutTrailingZeros data={selectedVariant?.price} />
          </AddToCartButton>
        )}

        {!isOutOfStock && (
          <ShopPayButton
            width="100%"
            variantIds={[selectedVariant?.id]}
            storeDomain={storeDomain}
          />
        )}
      </div>
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
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
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
    $selectedOptions: [SelectedOptionInput!]!
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
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}
