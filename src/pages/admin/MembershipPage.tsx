import { useEffect, useState } from 'react';
import { lsGet, lsSet } from '@/utils/localStorageHelper';
import { priceWithSign } from '@/utils/helper';
import Title3 from '@/components/shared/typo/Title3';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  TrophyIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

type Member = { 
  id: string; 
  name: string; 
  email: string; 
  phone?: string;
  totalSpent: number; 
  totalOrders: number;
  points: number;
  level: 'Silver' | 'Gold' | 'Diamond';
  joinDate: string;
  lastOrderDate?: string;
};

const LS_KEY = 'admin_members';

function calcLevel(totalSpent: number): Member['level'] {
  if (totalSpent > 3000000) {return 'Diamond';}
  if (totalSpent >= 1000000) {return 'Gold';}
  return 'Silver';
}

const seed: Member[] = [
  { 
    id: 'm1', 
    name: 'Nguyễn Văn A', 
    email: 'a@example.com', 
    phone: '0123456789',
    totalSpent: 450000, 
    totalOrders: 12,
    points: 450,
    level: 'Silver',
    joinDate: '2024-01-15',
    lastOrderDate: '2024-12-10'
  },
  { 
    id: 'm2', 
    name: 'Trần Thị B', 
    email: 'b@example.com', 
    phone: '0987654321',
    totalSpent: 1500000, 
    totalOrders: 25,
    points: 1500,
    level: 'Gold',
    joinDate: '2023-11-20',
    lastOrderDate: '2024-12-15'
  },
  { 
    id: 'm3', 
    name: 'Lê Văn C', 
    email: 'c@example.com', 
    phone: '0369852147',
    totalSpent: 4200000, 
    totalOrders: 45,
    points: 4200,
    level: 'Diamond',
    joinDate: '2023-08-10',
    lastOrderDate: '2024-12-14'
  },
  { 
    id: 'm4', 
    name: 'Phạm Thị D', 
    email: 'd@example.com', 
    phone: '0741258963',
    totalSpent: 850000, 
    totalOrders: 18,
    points: 850,
    level: 'Silver',
    joinDate: '2024-03-05',
    lastOrderDate: '2024-12-12'
  },
  { 
    id: 'm5', 
    name: 'Hoàng Văn E', 
    email: 'e@example.com', 
    phone: '0852369741',
    totalSpent: 2200000, 
    totalOrders: 32,
    points: 2200,
    level: 'Gold',
    joinDate: '2023-12-01',
    lastOrderDate: '2024-12-13'
  },
];

/**
 * MembershipPage: Quản lý thành viên với UI/UX cải thiện
 * Bao gồm thống kê, tìm kiếm, lọc và quản lý cấp độ thành viên
 */
export default function MembershipPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'joinDate'>('totalSpent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const pageSize = 8;
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setMembers(lsGet<Member[]>(LS_KEY, seed));
  }, []);

  useEffect(() => { 
    lsSet(LS_KEY, members); 
  }, [members]);

  // Filter and sort members
  useEffect(() => {
    let filtered = [...members];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(query) ||
                member.email.toLowerCase().includes(query) ||
                member.phone?.includes(query)
      );
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(member => member.level === levelFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
            
      switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'totalSpent':
        aValue = a.totalSpent;
        bValue = b.totalSpent;
        break;
      case 'joinDate':
        aValue = new Date(a.joinDate);
        bValue = new Date(b.joinDate);
        break;
      default:
        aValue = a.totalSpent;
        bValue = b.totalSpent;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredMembers(filtered);
    setPage(1); // Reset to first page when filters change
  }, [members, searchQuery, levelFilter, sortBy, sortOrder]);

  const setLevel = (id: string, level: Member['level']) => {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, level } : m)));
    setToast('Đã cập nhật cấp độ thành viên');
    setTimeout(() => setToast(null), 2000);
  };

  const getLevelColor = (level: Member['level']) => {
    switch (level) {
    case 'Silver': return 'bg-gray-100 text-gray-800';
    case 'Gold': return 'bg-yellow-100 text-yellow-800';
    case 'Diamond': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: Member['level']) => {
    switch (level) {
    case 'Silver': return '🥈';
    case 'Gold': return '🥇';
    case 'Diamond': return '💎';
    default: return '👤';
    }
  };

  // Calculate stats
  const stats = {
    total: members.length,
    silver: members.filter(m => m.level === 'Silver').length,
    gold: members.filter(m => m.level === 'Gold').length,
    diamond: members.filter(m => m.level === 'Diamond').length,
    totalRevenue: members.reduce((sum, m) => sum + m.totalSpent, 0),
    avgOrderValue: members.reduce((sum, m) => sum + m.totalSpent, 0) / members.reduce((sum, m) => sum + m.totalOrders, 0) || 0,
  };

  const paginatedMembers = filteredMembers.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title3>Quản lý thành viên</Title3>
          <p className="text-gray-600 mt-1">
                        Quản lý thông tin và cấp độ thành viên của hệ thống
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <UserGroupIcon className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Tổng thành viên</div>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{priceWithSign(stats.totalRevenue)}</div>
              <div className="text-sm text-gray-600">Tổng doanh thu</div>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <TrophyIcon className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.diamond}</div>
              <div className="text-sm text-gray-600">Diamond</div>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <StarIcon className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-800">{priceWithSign(stats.avgOrderValue)}</div>
              <div className="text-sm text-gray-600">Giá trị TB/đơn</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm thành viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="all">Tất cả cấp độ</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Diamond">Diamond</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="totalSpent">Sắp xếp theo chi tiêu</option>
              <option value="name">Sắp xếp theo tên</option>
              <option value="joinDate">Sắp xếp theo ngày tham gia</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="desc">Giảm dần</option>
              <option value="asc">Tăng dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thành viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thống kê
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cấp độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg">{getLevelIcon(member.level)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">
                                                    Tham gia: {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.email}</div>
                    <div className="text-sm text-gray-500">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {priceWithSign(member.totalSpent)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.totalOrders} đơn • {member.points} điểm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(member.level)}`}>
                      {member.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select 
                      value={member.level} 
                      onChange={(e) => setLevel(member.id, e.target.value as any)}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    >
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Diamond">Diamond</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <ButtonOutline
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2"
            >
                            Trước
            </ButtonOutline>
            <ButtonOutline
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2"
            >
                            Sau
            </ButtonOutline>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                                Hiển thị{' '}
                <span className="font-medium">{(page - 1) * pageSize + 1}</span>
                {' '}đến{' '}
                <span className="font-medium">
                  {Math.min(page * pageSize, filteredMembers.length)}
                </span>
                {' '}trong{' '}
                <span className="font-medium">{filteredMembers.length}</span>
                {' '}kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <ButtonOutline
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </ButtonOutline>
                                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  if (pageNum > totalPages) {return null;}
                                    
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === page
                          ? 'z-10 bg-primary border-primary text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <ButtonOutline
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </ButtonOutline>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FunnelIcon className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Logic cấp độ thành viên:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Silver: Chi tiêu dưới 1,000,000 VND</li>
              <li>• Gold: Chi tiêu từ 1,000,000 - 3,000,000 VND</li>
              <li>• Diamond: Chi tiêu trên 3,000,000 VND</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5" />
          {toast}
        </div>
      )}
    </div>
  );
}