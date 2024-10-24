import { ChangePasswordSchema } from "@/schemas/account";
import axios from "axios";
import { z } from "zod";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const changePassword = async (token: string, password: z.infer<typeof ChangePasswordSchema>) => {
    try {
        const response = await axios.patch(`${apiUrl}/password`, {
            oldPassword: password.oldPassword, newPassword: password.newPassword
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;

    } catch (error) {
        console.error("Error update password:", error);
        throw error;
    }
}
