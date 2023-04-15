import {Attribute} from "./attributeType";

export interface AttributeValue {
  id: number;
  value: string;
  attribute_id: number;
  attribute?: Attribute;
  created_at?: Date;
  updated_at?: Date;
}