export const getProductTotalPrice = (
  basePrice: number,
  selectedSize: string,
  selectedToppings: string[],
  sizeOptions: { name: string; price: number }[],
  toppingOptions: { name: string; price: number }[]
) => {
  const sizePrice = sizeOptions.find(s => s.name === selectedSize)?.price || 0;
  const toppingPrice = selectedToppings.reduce((sum, t) => {
    const topping = toppingOptions.find(opt => opt.name === t);
    return sum + (topping?.price || 0);
  }, 0);
  return basePrice + sizePrice + toppingPrice;
};
