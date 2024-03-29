import { Bid } from './bid';
import { User } from './user';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  originalPrice: number;
  pictureUrl: string;
  endDate: Date;
  sellerId: string;
  seller: User;
  bids: Bid[];
}
