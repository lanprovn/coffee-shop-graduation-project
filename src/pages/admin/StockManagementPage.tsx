import { useEffect, useMemo, useState } from 'react';
import { lsGet, lsSet } from '@/utils/localStorageHelper';
import { products as defaultProducts } from '@/data/products';
import { CoffeeProduct } from '@/types';

type StockRow = CoffeeProduct & { stock: number };

const LS_KEY = 'admin_stock_products';

/**
 * StockManagementPage: Quản lý tồn kho (mock)
 */
export default function StockManagementPage() {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<StockRow[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const initial: StockRow[] = lsGet<StockRow[]>(LS_KEY, defaultProducts.map(p => ({ ...p, stock: 20 })));
    setRows(initial);
  }, []);

  useEffect(() => {
    if (rows.length) {lsSet(LS_KEY, rows);}
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {return rows;}
    return rows.filter(r => r.displayName.toLowerCase().includes(q));
  }, [rows, query]);

  const changeStock = (id: string, delta: number) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, stock: Math.max(0, r.stock + delta) } : r)));
    setToast('Cập nhật tồn kho thành công');
    setTimeout(() => setToast(null), 1500);
  };

  const resetStock = () => {
    const reset = defaultProducts.map(p => ({ ...p, stock: 20 }));
    setRows(reset);
    setToast('Đã reset tồn kho về mặc định');
    setTimeout(() => setToast(null), 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Quản lý tồn kho</h2>
        <button onClick={resetStock} className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50">Reset Stock</button>
      </div>

      <div className="mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm sản phẩm..."
          className="w-full md:w-80 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="text-left text-gray-600">
              <th className="py-2 pr-3">Sản phẩm</th>
              <th className="py-2 pr-3">Giá</th>
              <th className="py-2 pr-3">Tồn kho</th>
              <th className="py-2 pr-3">Trạng thái</th>
              <th className="py-2 pr-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice((page - 1) * pageSize, page * pageSize).map(row => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-3">
                    <img src={row.image} alt={row.displayName} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <div className="font-medium text-gray-800">{row.displayName}</div>
                      <div className="text-xs text-gray-500">{row.category}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2 pr-3">{row.basePrice.toLocaleString('vi-VN')} VND</td>
                <td className="py-2 pr-3">{row.stock}</td>
                <td className="py-2 pr-3">{row.stock > 0 ? '✅ Còn hàng' : '❌ Hết hàng'}</td>
                <td className="py-2 pr-3">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => changeStock(row.id, -1)} className="w-8 h-8 rounded-full border hover:bg-gray-100">-</button>
                    <button onClick={() => changeStock(row.id, +1)} className="w-8 h-8 rounded-full border hover:bg-gray-100">+</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3 text-sm">
        <div>
                    Hiển thị {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} trong {filtered.length}
        </div>
        <div className="inline-flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border rounded disabled:opacity-50">Trước</button>
          <button disabled={page * pageSize >= filtered.length} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded disabled:opacity-50">Sau</button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
