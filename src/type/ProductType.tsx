import { FishType } from "./FishType";
import { TankType } from "./TankType";

export interface ProductType {
    id:string,
    name?: string,
    slug?: string,
    description?: string,
    descriptionDetail?: string,
    type?:string
    supplierId?:string|null,
    stockQuantity?: number,
    sold?:boolean|null,
    price?: number,
    originalPrice?: number,
    fish?: FishType,
    tank?: TankType
}