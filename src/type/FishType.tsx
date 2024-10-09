import { AwardType } from "./AwardType";
import { BreedType } from "./BreedType";

export interface FishType {
    id:string;
    productId?: string;
    breed?: BreedType;
    size?: number;
    age?: number;
    origin?: string;
    sex: boolean;
    foodAmount?: number;
    weight?: number;
    health?: string;
    dateOfBirth?: string;
    awards?:AwardType[]
}