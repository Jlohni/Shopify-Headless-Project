import {defer} from '@shopify/remix-oxygen';
import {Await, Form, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import {
  Pagination,
  getPaginationVariables,
  Analytics,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Heading, PageHeader, Section, Text} from '~/components/Text';
import {Input} from '~/components/Input';
import {Grid} from '~/components/Grid';
import {ProductCard} from '~/components/ProductCard';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {FeaturedCollections} from '~/components/FeaturedCollections';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';

import {getFeaturedData} from './($locale).featured-products';

export async function loader({request, context: {storefront}}) {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('q');
  const variables = getPaginationVariables(request, {pageBy: 8});

  const res = await storefront.query(SEARCH_QUERY, {
    variables: {
      searchTerm: searchTerm || '',
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  }).catch(() => null);

  const products = res?.products || {nodes: [], pageInfo: {hasNextPage: false, hasPreviousPage: false}};
  const shouldGetRecommendations = !searchTerm || products?.nodes?.length === 0;

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'search',
      title: 'Search',
      handle: 'search',
      descriptionHtml: 'Search results',
      description: 'Search results',
      seo: {
        title: 'Search',
        description: `Showing ${products?.nodes?.length || 0} search results for "${searchTerm || ''}"`,
      },
      metafields: [],
      products,
      updatedAt: new Date().toISOString(),
    },
  });

  return defer({
    searchTerm,
    products,
    noResultRecommendations: shouldGetRecommendations
      ? getFeaturedData(storefront).catch(() => null)
      : Promise.resolve(null),
    seo,
  });
}

export const meta = ({data}) => {
  return getSeoMeta(data?.seo);
};

export default function Search() {
  const {searchTerm, products, noResultRecommendations} = useLoaderData();
  const noResults = products?.nodes?.length === 0;

  return (
    <>
      <PageHeader>
        <Heading as="h1" size="copy" className="mb-8">
          Search
        </Heading>
        <Form method="get" className="relative flex w-full text-heading">
          <Input
            defaultValue={searchTerm}
            placeholder="Search products..."
            type="search"
            variant="search"
            name="q"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 flex h-full items-center justify-center px-4 font-bold text-coral"
          >
            Search
          </button>
        </Form>
      </PageHeader>
      {noResults ? (
        <Section className="space-y-8">
          <Text className="opacity-70">
            No results found for &quot;{searchTerm}&quot;
          </Text>

          <Suspense>
            <Await
              errorElement="There was a problem loading recommendations"
              resolve={noResultRecommendations}
            >
              {(data) => (
                <>
                  {data?.featuredProducts && (
                    <ProductSwimlane
                      title="Popular Products"
                      products={data.featuredProducts}
                    />
                  )}
                  {data?.featuredCollections && (
                    <FeaturedCollections
                      title="Explore Collections"
                      collections={data.featuredCollections}
                    />
                  )}
                </>
              )}
            </Await>
          </Suspense>
        </Section>
      ) : (
        <Section>
          <Pagination connection={products}>
            {({nodes, isLoading, NextLink, PreviousLink}) => (
              <>
                <div className="flex items-center justify-center mb-6">
                  <PreviousLink className="btn-soleselect px-4 py-2 text-xs">
                    {isLoading ? 'Loading...' : 'Previous'}
                  </PreviousLink>
                </div>
                <Grid data-test="product-grid" layout="products">
                  {nodes.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      loading={getImageLoadingPriority(i)}
                    />
                  ))}
                </Grid>
                <div className="flex items-center justify-center mt-6">
                  <NextLink className="btn-soleselect px-4 py-2 text-xs">
                    {isLoading ? 'Loading...' : 'Next'}
                  </NextLink>
                </div>
              </>
            )}
          </Pagination>
        </Section>
      )}
      <Analytics.SearchView data={{searchTerm: searchTerm || '', searchResults: products?.nodes || []}} />
    </>
  );
}

const SEARCH_QUERY = `#graphql
  query PaginatedProductsSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $searchTerm: String
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      after: $endCursor,
      before: $startCursor,
      sortKey: RELEVANCE,
      query: $searchTerm
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;
