// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import {
  createRequestHandler,
  getStorefrontHeaders,
} from '@shopify/remix-oxygen';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
  createCustomerAccountClient,
} from '@shopify/hydrogen';

import {AppSession} from '~/lib/session.server';
import {getLocaleFromRequest} from '~/lib/utils';

/**
 * Export a fetch handler in module format.
 */
export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {ExecutionContext} executionContext
   * @return {Promise<Response>}
   */
  async fetch(request, env, executionContext) {
    try {
      // Fallback Environment Credentials for Oxygen Production Workers
      const storeDomain = env?.PUBLIC_STORE_DOMAIN || 'jagdish-lohni.myshopify.com';
      const publicStorefrontToken = env?.PUBLIC_STOREFRONT_API_TOKEN || 'f90eccea41ffa08d57535479c8823b1b';
      const privateStorefrontToken = env?.PRIVATE_STOREFRONT_API_TOKEN;
      const sessionSecret = env?.SESSION_SECRET || 'soleselect_secret_session_2026';

      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        AppSession.init(request, [sessionSecret]),
      ]);

      /**
       * Create Hydrogen's Storefront client.
       */
      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n: getLocaleFromRequest(request),
        publicStorefrontToken,
        privateStorefrontToken,
        storeDomain,
        storefrontId: env?.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
      });

      /**
       * Create a client for Customer Account API only if Client ID is configured.
       */
      let customerAccount = undefined;
      if (env?.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID) {
        customerAccount = createCustomerAccountClient({
          waitUntil,
          request,
          session,
          customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
          shopId: env.SHOP_ID,
        });
      }

      const cart = createCartHandler({
        storefront,
        ...(customerAccount ? {customerAccount} : {}),
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
      });

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          session,
          waitUntil,
          storefront,
          customerAccount,
          cart,
          env: {
            ...env,
            PUBLIC_STORE_DOMAIN: storeDomain,
            PUBLIC_STOREFRONT_API_TOKEN: publicStorefrontToken,
            PRIVATE_STOREFRONT_API_TOKEN: privateStorefrontToken,
            SESSION_SECRET: sessionSecret,
          },
        }),
      });

      const response = await handleRequest(request);

      if (session.isPending) {
        response.headers.set('Set-Cookie', await session.commit());
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
