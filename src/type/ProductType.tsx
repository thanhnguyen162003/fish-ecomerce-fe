import { FishType } from "./FishType";
import { ImageType } from "./ImageType";
import { TankType } from "./TankType";

export interface ProductType {
    id:string,
    name?: string,
    slug?: string,
    description?: string,
    descriptionDetail?: string,
    type?:string
    supplierId?:string|null,
    stockQuantity: number,
    sold?:boolean|null,
    price: number,
    original_price: number,
    images: ImageType[]
    fish?: FishType,
    tank?: TankType,
    quantityPurchase?: number|0|undefined|null
}