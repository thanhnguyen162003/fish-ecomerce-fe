import { List } from "postcss/lib/list";
import { CategoryType } from "./CategoryType";

export interface TankType {
    id: string;
    productId?: string;
    size?: string;
    sizeInformation?: string;
    glassType?: string;
    category: CategoryType[]
}