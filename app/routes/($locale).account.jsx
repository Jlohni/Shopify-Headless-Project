import {
  Await,
  Form,
  Outlet,
  useLoaderData,
  useMatches,
  useOutlet,
} from '@remix-run/react';
import {Suspense} from 'react';
import {defer} from '@shopify/remix-oxygen';
import {flattenConnection} from '@shopify/hydrogen';
import {PageHeader, Text} from '~/components/Text';
import {Button} from '~/components/Button';
import {OrderCard} from '~/components/OrderCard';
import {AccountDetails} from '~/components/AccountDetails';
import {AccountAddressBook} from '~/components/AccountAddressBook';
import {Modal} from '~/components/Modal';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {FeaturedCollections} from '~/components/FeaturedCollections';
import {usePrefixPathWithLocale} from '~/lib/utils';
import {CACHE_NONE, routeHeaders} from '~/data/cache';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

import {doLogout} from './($locale).account_.logout';
import {getFeaturedData} from './($locale).featured-products';

export const headers = routeHeaders;

export async function loader({request, context, params}) {
  let data = null;
  let errors = null;

  try {
    if (context.customerAccount) {
      const res = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY);
      data = res?.data;
      errors = res?.errors;
    }
  } catch (err) {
    // Fallback if Customer Account API is unauthenticated or not configured
    return defer({
      customer: null,
      heading: 'Account Details',
      featuredDataPromise: getFeaturedData(context.storefront).catch(() => null),
    });
  }

  const customer = data?.customer;

  if (!customer) {
    return defer({
      customer: null,
      heading: 'Account Details',
      featuredDataPromise: getFeaturedData(context.storefront).catch(() => null),
    });
  }

  const heading = customer.firstName
    ? `Welcome, ${customer.firstName}.`
    : `Welcome to your account.`;

  return defer(
    {
      customer,
      heading,
      featuredDataPromise: getFeaturedData(context.storefront).catch(() => null),
    },
    {
      headers: {
        'Cache-Control': CACHE_NONE,
      },
    },
  );
}

export default function Account() {
  const {customer, heading, featuredDataPromise} = useLoaderData();
  const outlet = useOutlet();
  const matches = useMatches();

  const customPage = matches.some((match) => match.handle?.renderInOutlet);

  if (outlet && customPage) {
    return outlet;
  }

  return (
    <div className="bg-ivory min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <PageHeader heading={heading}>
          <Form method="post" action="/account/logout">
            <button type="submit" className="text-xs font-bold text-coral uppercase hover:underline">
              Sign out
            </button>
          </Form>
        </PageHeader>

        {customer ? (
          <AccountDetails customer={customer} />
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-borderColor text-center space-y-4 max-w-md mx-auto">
            <h2 className="text-xl font-black text-ink uppercase">Customer Portal</h2>
            <p className="text-xs text-mutedText">Sign in to view your orders, addresses, and saved wishlist.</p>
            <a href="/account/login" className="inline-block btn-soleselect px-6 py-3 text-xs tracking-widest">
              SIGN IN / REGISTER
            </a>
          </div>
        )}

        <Suspense fallback={null}>
          <Await resolve={featuredDataPromise}>
            {(featuredData) => (
              <>
                {featuredData?.featuredProducts && (
                  <ProductSwimlane
                    title="Featured Silhouettes"
                    products={featuredData.featuredProducts}
                  />
                )}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
