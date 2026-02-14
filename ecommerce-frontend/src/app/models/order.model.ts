import { Client } from './client.model';
import { Driver } from './driver.model';
import { Product } from './product.model';

export interface Order {
  id?: number;
  ref: string;
  description: string;
  qteTotal: number;
  priceTotal: number;
  state: boolean;
  client?: Client;
  driver?: Driver;
  products?: Product[];
}
