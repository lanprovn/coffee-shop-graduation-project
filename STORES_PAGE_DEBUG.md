# Stores Page Debug - Test Component

## 🔍 **Kiểm tra Stores Page**

### **✅ Đã kiểm tra:**

#### **1. Router Configuration:**
- ✅ Route `/stores` đã được định nghĩa trong `Router.tsx`
- ✅ `StoresPage` đã được lazy import
- ✅ Route được wrap trong `AppLayout`

#### **2. Navbar Link:**
- ✅ Link `/stores` đã có trong Navbar
- ✅ Text "Cửa hàng" hiển thị đúng
- ✅ Active state với `isActive('/stores')`

#### **3. StoresPage Component:**
- ✅ Import `stores` từ `@/data/stores` 
- ✅ Import `Store` type từ `@/types`
- ✅ Import các components cần thiết
- ✅ Dark mode classes đã được thêm
- ✅ Mock Google Maps URL

#### **4. Mock Data:**
- ✅ 12 cửa hàng trong `src/data/stores.ts`
- ✅ Store interface đầy đủ
- ✅ LatLng interface đúng

### **🔧 Có thể có vấn đề:**

#### **1. Lazy Loading Issue:**
- StoresPage được lazy load, có thể có lỗi khi load
- Suspense fallback có thể không hiển thị đúng

#### **2. Import Path Issues:**
- Có thể có vấn đề với `@/` alias
- TypeScript path mapping

#### **3. Component Dependencies:**
- Các shared components có thể có lỗi
- ButtonFilled, ButtonOutline, Title1, Title3

### **🚀 Giải pháp:**

#### **1. Tạo Test Component đơn giản:**
```typescript
// TestStoresPage.tsx
export default function TestStoresPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Stores Page</h1>
      <p>Nếu bạn thấy trang này, routing hoạt động!</p>
    </div>
  );
}
```

#### **2. Kiểm tra Console Errors:**
- Mở Developer Tools
- Xem Console tab
- Tìm lỗi JavaScript/TypeScript

#### **3. Kiểm tra Network Tab:**
- Xem có file nào fail to load không
- Kiểm tra import paths

### **📋 Checklist Debug:**

- [ ] Router có route `/stores`?
- [ ] Navbar có link `/stores`?
- [ ] StoresPage component có lỗi syntax?
- [ ] Mock data có đúng format?
- [ ] Shared components có lỗi?
- [ ] Console có error?
- [ ] Network có failed requests?

### **🎯 Next Steps:**

1. **Tạo test component** để isolate vấn đề
2. **Kiểm tra console** để tìm lỗi cụ thể
3. **Test từng component** một cách riêng biệt
4. **Sửa lỗi** từng bước một

**Stores Page có vẻ đã được cấu hình đúng, vấn đề có thể là lỗi runtime!** 🔍
