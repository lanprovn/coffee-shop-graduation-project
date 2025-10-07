import { useState, useEffect } from 'react';
import { stores } from '@/data/stores';
import { Store } from '@/types';
import Title1 from '@/components/shared/typo/Title1';
import Title3 from '@/components/shared/typo/Title3';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import ButtonOutline from '@/components/shared/button/ButtonOutline';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

/**
 * StoresPage: Trang hiển thị hệ thống cửa hàng với Google Maps
 * Danh sách chi nhánh với thông tin chi tiết và bản đồ tương tác
 */
export default function StoresPage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState<Store[]>(stores);

  // Filter stores based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.services.some(service =>
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredStores(filtered);
    }
  }, [searchQuery]);

  const formatOpeningHours = (store: Store) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

    return days.map((day, index) => (
      <div key={day} className="flex justify-between text-sm">
        <span className="text-gray-600">{dayNames[index]}:</span>
        <span className="font-medium text-gray-800">{store.openingHours[day as keyof typeof store.openingHours]}</span>
      </div>
    ));
  };

  const openGoogleMaps = (store: Store) => {
    const url = `https://www.google.com/maps?q=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const getGoogleMapsEmbedUrl = (store: Store) => {
    // Mock Google Maps embed URL - không cần API key thật
    return `https://www.google.com/maps/embed/v1/place?key=mock-api-key&q=${store.coordinates.lat},${store.coordinates.lng}&zoom=15`;
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 mt-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <Title1 className="text-gray-800 mb-2">Hệ thống cửa hàng</Title1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Coffee Shop hiện có mặt tại nhiều khu vực trên toàn quốc.
          Hãy chọn chi nhánh gần bạn nhất để thưởng thức hương vị cà phê tuyệt hảo!
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
        <div className="relative max-w-md mx-auto">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm cửa hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold">{stores.length}</div>
          <div className="text-blue-100">Chi nhánh</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold">24/7</div>
          <div className="text-green-100">Hỗ trợ</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold">100%</div>
          <div className="text-purple-100">Hài lòng</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Stores List */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Danh sách cửa hàng ({filteredStores.length})
          </h3>

          {filteredStores.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${selectedStore?.id === store.id ? 'border-primary bg-primary/5' : 'border-gray-100'
                    }`}
                  onClick={() => setSelectedStore(store)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">
                        {store.name}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span className="text-sm">{store.address}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <ButtonOutline
                        onClick={(e) => {
                          e.stopPropagation();
                          openGoogleMaps(store);
                        }}
                        className="text-xs px-3 py-1"
                      >
                        <ArrowTopRightOnSquareIcon className="w-3 h-3 mr-1" />
                        Maps
                      </ButtonOutline>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <PhoneIcon className="w-4 h-4" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <EnvelopeIcon className="w-4 h-4" />
                      <span>{store.email}</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {store.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Không tìm thấy cửa hàng
              </h3>
              <p className="text-gray-600 mb-4">
                Hãy thử từ khóa tìm kiếm khác
              </p>
              <ButtonOutline onClick={() => setSearchQuery('')}>
                Xóa bộ lọc
              </ButtonOutline>
            </div>
          )}
        </div>

        {/* Map and Store Details */}
        <div className="space-y-6">
          {selectedStore ? (
            <>
              {/* Store Details */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Title3>{selectedStore.name}</Title3>
                  <ButtonFilled onClick={() => openGoogleMaps(selectedStore)}>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-2" />
                    Mở Maps
                  </ButtonFilled>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Địa chỉ</p>
                      <p className="text-gray-600">{selectedStore.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-800">Điện thoại</p>
                      <p className="text-gray-600">{selectedStore.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600">{selectedStore.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Giờ mở cửa</p>
                      <div className="space-y-1">
                        {formatOpeningHours(selectedStore)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vị trí trên bản đồ</h3>
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={getGoogleMapsEmbedUrl(selectedStore)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${selectedStore.name}`}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Chọn cửa hàng để xem chi tiết
              </h3>
              <p className="text-gray-600">
                Nhấp vào một cửa hàng trong danh sách để xem thông tin chi tiết và vị trí trên bản đồ
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}