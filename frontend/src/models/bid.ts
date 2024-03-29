import { Product } from "./product";
import { User } from "./user";

export interface Bid {
  id: string;
  productId: string;
  bidderId: string;
  price: number;
  date: Date;
  product: Product;
  bidder: User;
}
