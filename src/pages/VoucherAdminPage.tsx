import { useState, useEffect } from 'react';
import { Voucher } from '@/types';
import { vouchers } from '@/data/vouchers';
import Title1 from '@/components/shared/typo/Title1';
import Title3 from '@/components/shared/typo/Title3';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';

/**
 * Trang quản lý voucher (Admin)
 * CRUD functionality cho mã giảm giá
 */
export default function VoucherAdminPage() {
  const [voucherList, setVoucherList] = useState<Voucher[]>([]);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    isActive: true,
    expiryDate: '',
  });

  // Load vouchers từ localStorage
  useEffect(() => {
    const loadVouchers = () => {
      try {
        const savedVouchers = localStorage.getItem('admin_vouchers');
        if (savedVouchers) {
          setVoucherList(JSON.parse(savedVouchers));
        } else {
          setVoucherList(vouchers);
          localStorage.setItem('admin_vouchers', JSON.stringify(vouchers));
        }
      } catch (error) {
        console.error('Error loading vouchers:', error);
        setVoucherList(vouchers);
      }
    };

    loadVouchers();
  }, []);

  // Save vouchers to localStorage
  const saveVouchers = (newVouchers: Voucher[]) => {
    localStorage.setItem('admin_vouchers', JSON.stringify(newVouchers));
    setVoucherList(newVouchers);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVoucher) {
      // Update existing voucher
      const updatedVouchers = voucherList.map(v => 
        v.id === editingVoucher.id 
          ? { ...v, ...formData, id: editingVoucher.id }
          : v
      );
      saveVouchers(updatedVouchers);
    } else {
      // Create new voucher
      const newVoucher: Voucher = {
        id: `voucher_${Date.now()}`,
        ...formData,
      };
      saveVouchers([...voucherList, newVoucher]);
    }

    // Reset form
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      isActive: true,
      expiryDate: '',
    });
    setEditingVoucher(null);
    setShowForm(false);
  };

  // Edit voucher
  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      code: voucher.code,
      name: voucher.name,
      description: voucher.description,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      minOrderAmount: voucher.minOrderAmount,
      maxDiscountAmount: voucher.maxDiscountAmount,
      isActive: voucher.isActive,
      expiryDate: voucher.expiryDate,
    });
    setShowForm(true);
  };

  // Delete voucher
  const handleDelete = (voucherId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      const updatedVouchers = voucherList.filter(v => v.id !== voucherId);
      saveVouchers(updatedVouchers);
    }
  };

  // Toggle voucher status
  const toggleStatus = (voucherId: string) => {
    const updatedVouchers = voucherList.map(v => 
      v.id === voucherId ? { ...v, isActive: !v.isActive } : v
    );
    saveVouchers(updatedVouchers);
  };

  // Reset form
  const handleCancel = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      isActive: true,
      expiryDate: '',
    });
    setEditingVoucher(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 mt-20">
      <div className="flex justify-between items-center mb-8">
        <Title1>Quản lý Voucher</Title1>
        <ButtonFilled onClick={() => setShowForm(true)}>
          Thêm voucher mới
        </ButtonFilled>
      </div>

      {/* Voucher Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <Title3>{editingVoucher ? 'Chỉnh sửa voucher' : 'Thêm voucher mới'}</Title3>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã voucher *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="VD: WELCOME10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên voucher *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="VD: Giảm 10% cho đơn đầu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Mô tả chi tiết về voucher"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại giảm giá *
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (₫)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá trị giảm *
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đơn tối thiểu (₫)
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giảm tối đa (₫)
                </label>
                <input
                  type="number"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày hết hạn
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded"
              />
              <label className="text-sm text-gray-700">Kích hoạt voucher</label>
            </div>

            <div className="flex gap-2">
              <ButtonFilled type="submit">
                {editingVoucher ? 'Cập nhật' : 'Tạo voucher'}
              </ButtonFilled>
              <ButtonOutline onClick={handleCancel}>
                Hủy
              </ButtonOutline>
            </div>
          </form>
        </div>
      )}

      {/* Voucher List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <Title3>Danh sách voucher</Title3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã voucher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {voucherList.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {voucher.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{voucher.name}</div>
                    <div className="text-sm text-gray-500">{voucher.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {voucher.discountType === 'percentage' 
                        ? `${voucher.discountValue}%` 
                        : `${voucher.discountValue.toLocaleString()}₫`}
                    </div>
                    <div className="text-sm text-gray-500">
                      Đơn tối thiểu: {voucher.minOrderAmount.toLocaleString()}₫
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      voucher.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {voucher.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(voucher)}
                        className="text-primary hover:text-primary-600"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => toggleStatus(voucher.id)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        {voucher.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                      </button>
                      <button
                        onClick={() => handleDelete(voucher.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
