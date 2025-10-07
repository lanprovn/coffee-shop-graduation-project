# Cart Navigation Update - Chuyển thẳng đến trang checkout

## Tóm tắt thay đổi
Đã cập nhật logic navigation để khi người dùng thêm sản phẩm vào giỏ hàng và bấm vào icon cart, hệ thống sẽ chuyển thẳng đến trang checkout thay vì hiển thị popup cart.

## Các thay đổi đã thực hiện

### 1. Cập nhật Navbar Cart Icon
**File**: `src/components/layout/Navbar/index.tsx`

**Thay đổi**:
- Thêm import `useNavigate` từ `react-router-dom`
- Cập nhật logic `handleCartClick()`:
  - Nếu có sản phẩm trong giỏ (`itemCount > 0`): chuyển thẳng đến `/checkout`
  - Nếu giỏ trống (`itemCount === 0`): hiển thị popup cart như cũ

```typescript
const handleCartClick = () => {
  if (itemCount > 0) {
    // Nếu có sản phẩm trong giỏ, chuyển thẳng đến trang checkout
    navigate('/checkout');
  } else {
    // Nếu giỏ trống, hiển thị popup cart
    showCartModal();
  }
};
```

### 2. Cập nhật Product Detail Modal Footer
**File**: `src/hooks/provider/ModalProvider/ProductDetailModal/Footer.tsx`

**Thay đổi**:
- Thêm import `useNavigate` từ `react-router-dom`
- Cập nhật logic `handelAddToCart()`:
  - Sau khi thêm sản phẩm vào giỏ hàng
  - Đóng modal
  - Chuyển thẳng đến trang checkout

```typescript
const handelAddToCart = () => {
  addToCart(product, quantity);
  onClose();
  // Chuyển thẳng đến trang checkout sau khi thêm vào giỏ
  navigate('/checkout');
};
```

## Luồng hoạt động mới

### Khi người dùng thêm sản phẩm vào giỏ:
1. Click vào sản phẩm → Mở ProductDetailModal
2. Chọn số lượng và bấm "Add to Cart"
3. Sản phẩm được thêm vào giỏ hàng
4. Modal đóng
5. **Tự động chuyển đến trang checkout** ✅

### Khi người dùng bấm vào icon cart:
1. **Nếu giỏ có sản phẩm**: Chuyển thẳng đến trang checkout ✅
2. **Nếu giỏ trống**: Hiển thị popup cart (giữ nguyên logic cũ)

## Lợi ích

1. **UX tốt hơn**: Người dùng không cần thêm bước trung gian
2. **Quy trình mượt mà**: Từ thêm sản phẩm → checkout ngay lập tức
3. **Giữ nguyên logic cũ**: Popup cart vẫn hoạt động khi giỏ trống
4. **Tương thích**: Không ảnh hưởng đến các tính năng khác

## Kiểm tra

Để test các thay đổi:

1. **Thêm sản phẩm vào giỏ**:
   - Click vào sản phẩm → Chọn số lượng → "Add to Cart"
   - Kiểm tra: Tự động chuyển đến trang checkout

2. **Bấm icon cart khi có sản phẩm**:
   - Thêm sản phẩm vào giỏ trước
   - Bấm icon cart trong navbar
   - Kiểm tra: Chuyển đến trang checkout

3. **Bấm icon cart khi giỏ trống**:
   - Xóa hết sản phẩm khỏi giỏ
   - Bấm icon cart trong navbar
   - Kiểm tra: Hiển thị popup cart (giữ nguyên logic cũ)

## Lưu ý

- Tất cả thay đổi đều backward compatible
- Không ảnh hưởng đến logic checkout hiện có
- Popup cart vẫn hoạt động bình thường khi cần thiết
- Code đã được kiểm tra linting và không có lỗi
