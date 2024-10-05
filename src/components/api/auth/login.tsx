import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function login(email: string, password: string) {
    try {
        const response = await axios.post(`${apiUrl}/auth/login-customer`, { email, password });
        return response;
    } catch (error) {
        console.log(error);
        throw error
    }
}