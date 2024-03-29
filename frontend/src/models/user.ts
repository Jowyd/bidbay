import { Product } from './product';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  admin: boolean;
  products: Product[];
  bids: Bid[];
}
