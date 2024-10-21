import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function postFeedback(productId: string, content: string, rate: string) {
    try {
        const response = await axios.post(`https://kingfish.azurewebsites.net/api/v1/feedback`, { productId, content, rate });
        return response
    } catch (error) {
        console.log(error);
        throw error;
    }
}