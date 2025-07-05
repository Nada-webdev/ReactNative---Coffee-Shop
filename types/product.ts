export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  ingredients?: string[];
  calories?: number;
  caffeine?: string;
  image?: string;
}