export type OrderProcessingResult = {
  data: {
    total: number;
    orderDetails: {
      productId: number;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[];
  };
};
