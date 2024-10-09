import { FishProductType } from "@/type/ProductType";
import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handleGetFishProduct(pageSize: number, pageNumber: number) {
    try {
        const response = await axios.get(`${apiUrl}/v1/product/fishsproduct`, {
            params: {
                PageSize: pageSize,
                PageNumber: pageNumber
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}