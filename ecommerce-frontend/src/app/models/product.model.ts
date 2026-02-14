import { SubCategory } from './subcategory.model';
import { Gallery } from './gallery.model';
import { Provider } from './provider.model';

export interface Product {
  id?: number;
  price: number;
  ref: string;
  qte: number;
  description: string;
  subCategory?: SubCategory;
  gallery?: Gallery;
  provider?: Provider;
}
