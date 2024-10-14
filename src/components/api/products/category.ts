import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handleGetCategory() {
    try {
        const response = await axios.get(`${apiUrl}/v1/category`,{
            params:{
                PageSize: 2000,
                PageNumber: 1
            }
        })
        return response
    } catch (error) {
        console.log(error);
    }
}