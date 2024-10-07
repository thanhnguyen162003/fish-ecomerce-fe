import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function register(email: string, password: string, name: string) {
    try {
        const response = await axios.post(`${apiUrl}/auth/register-customer`, { email, password, name });
        return response
    } catch (error) {
        console.log(error);
        throw error;
    }
}