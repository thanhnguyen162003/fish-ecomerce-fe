import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function hanldeGetBreed() {
    try {
        const response = await axios.get(`${apiUrl}/v1/breed`,{
            params:{
                PageSize: 1999,
                PageNumber: 1
            }
        })
        return response
    } catch (error) {
        console.log(error);
        
    }
}