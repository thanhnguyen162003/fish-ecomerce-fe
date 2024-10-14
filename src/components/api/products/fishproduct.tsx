import { ProductType } from "@/type/ProductType";
import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handleGetFishProduct(
    search: string | null | undefined, 
    breed: string | null | undefined, 
    sort: string | null | undefined, 
    direction: string | null | undefined, 
    pageSize: number, 
    pageNumber: number) {
    try {
        const response = await axios.get(`${apiUrl}/v1/product/fishs`, {
            params: {
                PageSize: pageSize,
                PageNumber: pageNumber,
                ...(search && {Search: search}),
                ...(breed && {Breed: breed}),
                ...(sort && {Sort: sort}),
                ...(direction && {Direction: direction})
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}