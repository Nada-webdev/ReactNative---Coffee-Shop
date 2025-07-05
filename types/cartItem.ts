export interface CartItem {
  id: string;
  orderID: string;
  productID: string;
  product_title: string;
  total_price: number;
  quantity: number;
  image?: string;
}

