import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function login(email: string, password: string) {
    try {
        const user = {
            username: email,
            password: password
        }
        const response = await axios.post(`https://kingfish.azurewebsites.net/api/auth/login-customer`, user);
        console.log(response);
        
        return response;
    } catch (error) {
        console.log(error);
        throw error
    }
}