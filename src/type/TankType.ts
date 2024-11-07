import { TankCategoryType } from "./CategoryType";

export interface TankType {
  id: string;
  product_id?: string;
  size?: string;
  size_information?: string;
  glass_type?: string;
  categories: TankCategoryType[];
}
