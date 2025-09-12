export type Order = {
    orderId: string;
    saleDate: string;
    financialStatus:
      | "pending"
      | "paid"
      | "partially_paid"
      | "refunded"
      | "voided"
      | "partially_refunded";
    carrierStatus: string;
    realCarrierStatus: string;
    totalPrice: number;
    totalLineItemPrice: number;
    totalDiscountPrice: number;
    cancelledStatus: string;
    source: string;
    status: boolean;
    note: string;
    line_items: LineItem[]
  };
  
type LineItem = {
  sku: string,
  price: number,
  qty: number,
  productName: string
}