export function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// ✅ Định dạng tiền Việt Nam từ giá trị VNĐ (integer)
function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' VND';
}

// ✅ Bao bọc kèm xử lý an toàn khi giá không hợp lệ
export const priceWithSign = (price?: number | null) => {
  if (typeof price !== 'number' || Number.isNaN(price)) return '';
  return `${formatPrice(price)}`;
};

export function getSumFromArr(numberArr: number[]): number {
  return numberArr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

export const fakeTimer = (milliseconds: number = 1000): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};
