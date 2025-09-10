export const formatPrice = (price: number): string => {
  const formatted = new Intl.NumberFormat("vi-VN").format(price);
  return `${formatted} VND`;
};
