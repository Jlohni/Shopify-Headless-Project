import {useParams, Form, Await, useRouteLoaderData} from '@remix-run/react';
import {Suspense, useEffect} from 'react';
import {CartForm} from '@shopify/hydrogen';
import {AnnouncementBar} from '~/components/AnnouncementBar';
import {SoleSelectHeader} from '~/components/SoleSelectHeader';
import {SoleSelectFooter} from '~/components/SoleSelectFooter';
import {Cart} from '~/components/Cart';
import {CartLoading} from '~/components/CartLoading';
import {Drawer, useDrawer} from '~/components/Drawer';
import {useCartFetchers} from '~/hooks/useCartFetchers';

export function PageLayout({children}) {
  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <div className="flex flex-col min-h-screen bg-ivory text-ink">
        <a href="#mainContent" className="sr-only">
          Skip to content
        </a>
        <AnnouncementBar />
        <HeaderWrapper openCart={openCart} />
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
        <SoleSelectFooter />
      </div>
    </>
  );
}

function HeaderWrapper({openCart}) {
  const rootData = useRouteLoaderData('root');

  return (
    <Suspense fallback={<SoleSelectHeader cartCount={0} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <SoleSelectHeader cartCount={cart?.totalQuantity || 0} />
        )}
      </Await>
    </Suspense>
  );
}

function CartDrawer({isOpen, onClose}) {
  const rootData = useRouteLoaderData('root');
  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}
