import AuthProvider from './hooks/provider/AuthProvider';
import ProductProvider from './hooks/provider/ProductProvider';
import ShoppingCartProvider from './hooks/provider/ShoppingCartProvider';
import ModalProvider from './hooks/provider/ModalProvider/index.tsx';
import UserAddressProvider from './hooks/provider/UserAddressProvider.tsx';
import ScrollToTop from './components/shared/ScrollToTop.tsx';
import Router from './Router.tsx';

export default function App() {
  return (
    <AuthProvider>
      <UserAddressProvider>
        <ProductProvider>
          <ShoppingCartProvider>
            <ModalProvider>
              <ScrollToTop />
              <Router />
            </ModalProvider>
          </ShoppingCartProvider>
        </ProductProvider>
      </UserAddressProvider>
    </AuthProvider>
  );
}
