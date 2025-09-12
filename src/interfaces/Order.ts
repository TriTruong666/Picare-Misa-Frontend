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
    totalPrice: number;
    cancelledStatus: string;
    source: string;
    status: boolean;
    note: string;
  };
  