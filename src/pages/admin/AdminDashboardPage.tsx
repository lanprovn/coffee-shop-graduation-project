import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { lsGet, lsSet } from '@/utils/localStorageHelper';
import { lsGet as getLS } from '@/utils/localStorageHelper';
import { monthlyStats } from '@/data/adminStats';
import { products as defaultProducts } from '@/data/products';

/**
 * AdminDashboardPage: Khung trang Admin với sidebar điều hướng
 */
export default function AdminDashboardPage() {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => lsGet<'light' | 'dark'>('admin_theme', 'light'));

  useEffect(() => {
    lsSet('admin_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('admin-dark');
    } else {
      root.classList.remove('admin-dark');
    }
  }, [theme]);
  const navItem = (to: string, label: string) => (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-lg text-sm font-medium ${pathname === to ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </Link>
  );

  // Dashboard cards (when on /admin)
  const stock = useMemo(() => getLS<any[]>('admin_stock_products', defaultProducts.map(p => ({ ...p, stock: 20 }))), []);
  const lowStockCount = (stock || []).filter((s) => s.stock < 5).length;
  const stats = lsGet('admin_monthly_stats', monthlyStats);
  const latest = stats[stats.length - 1];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1e1e1e] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`fixed top-0 inset-x-0 z-40 ${theme === 'dark' ? 'bg-[#232323]' : 'bg-white'} border-b`}>
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="md:hidden p-2 rounded hover:bg-gray-100/20" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">☰</button>
            <span className="font-semibold">Xin chào, Admin 👋</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
            <button className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-red-600 hover:bg-red-500 text-white' : 'border hover:bg-red-50 text-red-600 border-red-200'}`}>Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 pt-20 pb-6 grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className={`${theme === 'dark' ? 'bg-[#232323] border-gray-700' : 'bg-white'} border rounded-xl p-3 h-max sticky top-20 col-span-12 md:col-span-3 lg:col-span-2 ${sidebarOpen ? '' : 'hidden'} md:block`}>
          <nav className="space-y-1">
            {navItem('/admin', '🏠 Dashboard')}
            {navItem('/admin/stock', '📦 Tồn kho')}
            {navItem('/admin/voucher', '🎟️ Voucher')}
            {navItem('/admin/membership', '👥 Thành viên')}
            {navItem('/admin/revenue', '📊 Doanh thu')}
          </nav>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className={`${theme === 'dark' ? 'bg-[#232323] border-gray-700' : 'bg-white'} border rounded-xl p-4 shadow-sm`}>
            {pathname === '/admin' ? (
              <div>
                <h1 className="text-xl font-semibold mb-4">Coffee-Shop Admin Dashboard</h1>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className={`${theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-primary/10'} rounded-xl p-4 hover:opacity-95 transition`}>
                    <div className="text-sm">💰 Tổng doanh thu (tháng)</div>
                    <div className="text-2xl font-bold mt-1">{latest?.revenue?.toLocaleString('vi-VN')} VND</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-emerald-50'} rounded-xl p-4 hover:opacity-95 transition`}>
                    <div className="text-sm">🛍️ Số đơn hàng</div>
                    <div className="text-2xl font-bold mt-1">{latest?.orders}</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-amber-50'} rounded-xl p-4 hover:opacity-95 transition`}>
                    <div className="text-sm">⚠️ Sản phẩm sắp hết hàng</div>
                    <div className="text-2xl font-bold mt-1">{lowStockCount}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Chọn module ở sidebar để quản lý chi tiết.</p>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
