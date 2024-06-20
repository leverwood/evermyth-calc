import { ShopCategory } from "../../shops/types/shop-types";

export interface Service {
  id: string;
  name: string;
  description: string;
  notes: string;
  price: number;
  shopCategories?: ShopCategory["slug"][];
}
