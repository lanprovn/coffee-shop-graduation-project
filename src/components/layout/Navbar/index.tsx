import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useShoppingCart } from '@/hooks/useShoppingCart';
import { APP_NAME } from '@/constants/constants';
import { useModal } from '@/hooks/useModal';
import MenuDrawer from './MenuDrawer';
import NavButton from './NavButton';
import { useAuth } from '@/hooks/useAuth';
import NotificationCenter from '@/components/shared/NotificationCenter';
import { useProduct } from '@/hooks/useProduct';
import { ProductCategory } from '@/types';
import { useDebounce, useOptimizedCallback } from '@/hooks/usePerformance';

export default function Navbar() {
  const { user } = useAuth();
  const { itemCount } = useShoppingCart();
  const { showCartModal } = useModal();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { coffees } = useProduct();

  const [showDrawer, setShowDrawer] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [menuQuery, setMenuQuery] = useState('');

  // Optimized callbacks
  const handleCartClick = useOptimizedCallback(() => {
    if (itemCount > 0) {
      navigate('/cart');
    } else {
      showCartModal();
    }
  }, [itemCount, navigate, showCartModal]);

  const handelDrawerOpen = useOptimizedCallback(() => setShowDrawer(true), []);
  const handelDrawerClose = useOptimizedCallback(() => setShowDrawer(false), []);

  const isActive = useOptimizedCallback((to: string) => pathname.startsWith(to), [pathname]);

  const toggleMobileMenu = useOptimizedCallback(() => setShowMobileMenu(!showMobileMenu), [showMobileMenu]);

  // Debounced menu query
  const debouncedMenuQuery = useDebounce(menuQuery, 300);

  // Memoized filtered categories
  const filteredCategories = useMemo(() => {
    return Array.from(new Set(coffees.map(p => p.category)))
      .filter(cat => {
        if (!debouncedMenuQuery || typeof debouncedMenuQuery !== 'string' || !debouncedMenuQuery.trim()) return true;
        const viName = ((): string => {
          switch (cat as ProductCategory) {
            case ProductCategory.Coffee: return 'Cà phê';
            case ProductCategory.Tea: return 'Trà';
            case ProductCategory.Freeze: return 'Đá xay / Freeze';
            case ProductCategory.Cake: return 'Bánh ngọt';
            default: return String(cat);
          }
        })();
        return viName.toLowerCase().includes(debouncedMenuQuery.toLowerCase());
      });
  }, [coffees, debouncedMenuQuery]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {showMobileMenu ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Logo - Mobile Optimized */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-1 sm:space-x-2 focus:outline-none text-primary hover:opacity-80"
              >
                <img src="/images/app-logo.svg" className="h-6 sm:h-7 lg:h-8" alt="Logo ứng dụng" />
                <span className="font-semibold whitespace-nowrap text-sm sm:text-base lg:text-lg hidden xs:block">
                  {APP_NAME}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Menu Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setShowMenu(true)}
                  onMouseLeave={() => setShowMenu(false)}
                >
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="group relative flex items-center gap-2 focus:outline-none px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary"
                  >
                    <span className="text-base">☕</span>
                    <span className="relative">
                      Thực đơn
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                    </span>
                    <svg
                      className={`w-4 h-4 mt-[2px] transition-transform duration-200 ${showMenu ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown content */}
                  {showMenu && (
                    <div className="absolute left-0 top-full bg-white border border-gray-100 rounded-xl shadow-xl mt-2 w-64 z-30 transition-opacity duration-300 ease-in-out opacity-100">
                      <div className="p-3 border-b">
                        <div className="relative">
                          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            value={menuQuery}
                            onChange={(e) => setMenuQuery(e.target.value)}
                            placeholder="Tìm trong thực đơn..."
                            className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <ul className="py-2 text-gray-700 text-sm font-medium max-h-80 overflow-auto">
                        {filteredCategories.map((cat) => {
                            const first = coffees.find(p => p.category === cat);
                            const img = first?.image || '/images/app-logo.png';
                            const viName = ((): string => {
                              switch (cat as ProductCategory) {
                                case ProductCategory.Coffee: return 'Cà phê';
                                case ProductCategory.Tea: return 'Trà';
                                case ProductCategory.Freeze: return 'Đá xay / Freeze';
                                case ProductCategory.Cake: return 'Bánh ngọt';
                                default: return String(cat);
                              }
                            })();
                            const to = `/products?category=${encodeURIComponent(String(cat))}`;
                            return (
                              <li key={String(cat)} className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 transition">
                                <img src={img} className="w-5 h-5 rounded" />
                                <Link to={to}>{viName}</Link>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  )}
                </div>

                <Link
                  to="/about"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Về chúng tôi
                </Link>
                <Link
                  to="/stores"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/stores') ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Cửa hàng
                </Link>
                <Link
                  to="/news"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/news') ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Tin tức
                </Link>
                <Link
                  to="/membership"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/membership') ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Thành viên
                </Link>
                <Link
                  to="/contact"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/contact') ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Liên hệ
                </Link>
              </div>
            </div>

            {/* Right side items */}
            <div className="hidden lg:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* User Profile */}
                <Link
                  to={user?.name ? '/profile' : '/login'}
                  className="text-gray-500 hover:text-primary font-semibold hover:underline mr-4"
                >
                  {user?.name || 'Đăng nhập'}
                </Link>

                {/* Notifications */}
                {user && <NotificationCenter />}

                {/* Cart */}
                <button
                  onClick={handleCartClick}
                  className="relative hover:bg-primary-50 text-black hover:text-primary-600 rounded-full p-2 ease-in ml-2"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {!!itemCount && (
                    <div className="absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-primary-500 rounded-full top-0 end-0">
                      {itemCount}
                    </div>
                  )}
                </button>

              </div>
            </div>

            {/* Mobile right side */}
            <div className="flex items-center lg:hidden">
              {/* Cart for mobile */}
              <button
                onClick={handleCartClick}
                className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {!!itemCount && (
                  <div className="absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-primary-500 rounded-full top-0 end-0">
                    {itemCount}
                  </div>
                )}
              </button>

              {/* User menu for mobile */}
              <NavButton onClick={handelDrawerOpen} Icon={UserIcon} />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {/* Mobile menu items */}
              <Link
                to="/products"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                ☕ Thực đơn
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Về chúng tôi
              </Link>
              <Link
                to="/stores"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Cửa hàng
              </Link>
              <Link
                to="/news"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Tin tức
              </Link>
              <Link
                to="/membership"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Thành viên
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Liên hệ
              </Link>

              {/* Mobile user section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  to={user?.name ? '/profile' : '/login'}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {user?.name || 'Đăng nhập'}
                </Link>

              </div>
            </div>
          </div>
        )}
      </nav>

      <MenuDrawer show={showDrawer} onClose={handelDrawerClose} />
    </>
  );
}