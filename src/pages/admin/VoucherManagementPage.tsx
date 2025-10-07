import { useEffect, useState } from 'react';
import { lsGet, lsSet } from '@/utils/localStorageHelper';
import { vouchers as defaultVouchers } from '@/data/vouchers';
import { Voucher } from '@/types';

const LS_KEY = 'admin_vouchers_list';

/**
 * VoucherManagementPage: CRUD voucher (mock)
 */
export default function VoucherManagementPage() {
    const [list, setList] = useState<Voucher[]>([]);
    const [form, setForm] = useState<Partial<Voucher>>({ code: '', name: '', discountType: 'percentage' as any, discountValue: 10, expiryDate: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        setList(lsGet<Voucher[]>(LS_KEY, defaultVouchers));
    }, []);

    useEffect(() => {
        lsSet(LS_KEY, list);
    }, [list]);

    const resetForm = () => {
        setForm({ code: '', name: '', discountType: 'percentage' as any, discountValue: 10, expiryDate: '' });
        setEditingId(null);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.code || !form.name) return;
        if (editingId) {
            setList(prev => prev.map(v => (v.id === editingId ? { ...v, ...form } as Voucher : v)));
            setToast('Đã cập nhật voucher');
        } else {
            setList(prev => [...prev, { id: `v_${Date.now()}`, code: form.code!, name: form.name!, description: form.description || '', discountType: (form.discountType as any) || 'percentage', discountValue: Number(form.discountValue) || 0, minOrderAmount: form.minOrderAmount || 0, maxDiscountAmount: form.maxDiscountAmount || 0, isActive: true, expiryDate: form.expiryDate || '' }]);
            setToast('Đã thêm voucher mới');
        }
        resetForm();
        setTimeout(() => setToast(null), 1500);
    };

    const onDelete = (id: string) => { setList(prev => prev.filter(v => v.id !== id)); setToast('Đã xoá voucher'); setTimeout(() => setToast(null), 1500); };
    const onEdit = (v: Voucher) => { setForm(v); setEditingId(v.id); };

    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quản lý voucher</h2>

            <form onSubmit={onSubmit} className="grid md:grid-cols-6 gap-2 items-end mb-4">
                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Code</label>
                    <input value={form.code || ''} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Tên</label>
                    <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Giảm (%)</label>
                    <input type="number" value={form.discountValue || 0} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Hết hạn</label>
                    <input type="date" value={form.expiryDate || ''} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="md:col-span-6">
                    <button type="submit" className="px-3 py-2 rounded-lg bg-primary text-white mr-2">{editingId ? 'Cập nhật' : 'Thêm voucher'}</button>
                    <button type="button" onClick={resetForm} className="px-3 py-2 rounded-lg border">Reset</button>
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-600">
                            <th className="py-2 pr-3">Code</th>
                            <th className="py-2 pr-3">Tên</th>
                            <th className="py-2 pr-3">Giảm</th>
                            <th className="py-2 pr-3">Hết hạn</th>
                            <th className="py-2 pr-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.slice((page - 1) * pageSize, page * pageSize).map(v => (
                            <tr key={v.id} className="border-t">
                                <td className="py-2 pr-3">{v.code}</td>
                                <td className="py-2 pr-3">{v.name}</td>
                                <td className="py-2 pr-3">{v.discountValue}%</td>
                                <td className="py-2 pr-3">{v.expiryDate || '-'}</td>
                                <td className="py-2 pr-3">
                                    <button onClick={() => onEdit(v)} className="px-2 py-1 text-sm rounded border mr-2">Sửa</button>
                                    <button onClick={() => onDelete(v.id)} className="px-2 py-1 text-sm rounded border">Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-3 text-sm">
                <div>
                    Hiển thị {Math.min((page - 1) * pageSize + 1, list.length)}–{Math.min(page * pageSize, list.length)} trong {list.length}
                </div>
                <div className="inline-flex gap-2">
                    <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border rounded disabled:opacity-50">Trước</button>
                    <button disabled={page * pageSize >= list.length} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded disabled:opacity-50">Sau</button>
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


