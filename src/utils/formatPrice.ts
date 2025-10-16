/**
 * Format price to Vietnamese currency format
 * @param price - Price in VND
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

/**
 * Format price without currency symbol
 * @param price - Price in VND
 * @returns Formatted price string without currency symbol
 */
export const formatPriceNumber = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
};
