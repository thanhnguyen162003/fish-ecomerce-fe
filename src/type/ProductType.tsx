import { FishType } from "./FishType";

export interface FishProductType {
    name?: string,
    description?: string,
    descriptionDetail?: string,
    stockQuantity?: number,
    price?: number,
    originalPrice?: number,
    fishModel?: FishType
}