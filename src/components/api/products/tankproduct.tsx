import { ProductType } from "@/type/ProductType";
import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handleGetTankProduct(
    search: string | null | undefined, 
    category: string | null | undefined, 
    sort: string | null | undefined, 
    direction: string | null | undefined, 
    pageSize: number, 
    pageNumber: number) {
    try {
        const response = await axios.get(`${apiUrl}/v1/product/tanks`, {
            params: {
                ...(search && {Search: search}),
                ...(category && {Category: category}),
                ...(sort && {Sort: sort}),
                ...(direction && {Direction: direction}),
                PageSize: pageSize,
                PageNumber: pageNumber
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}