import {Product} from "./productType";

export interface Category {
  id: number;
  name: string;
  is_active: boolean;
  parent_category_id?: number;
  parent_category?: Category;
  products?: Product[];
  created_at?: Date;
  updated_at?: Date;
}