import { CartItem } from "./cartItem";
import { Product } from "./product";

export interface DetailsProductProps {
  product: Product;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
  addingToCart?: boolean;
}

export interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  isUpdating?: boolean;
}

export interface ItemProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  onPress: (id: string) => void;
}
