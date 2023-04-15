import {Category} from "./categoryType";
import {AttributeValue} from "./attributeValueType";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  is_active: boolean;
  categories?: Category[];
  attributes?: AttributeValue[];
  created_at?: Date;
  updated_at?: Date;
}