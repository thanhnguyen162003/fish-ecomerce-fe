import * as z from "zod";

export const EditCustomerSchema = z.object({
    // Validation cho Birthday, kiểm tra ngày phải sau ngày 1/1/1900
    birthday: z
        .preprocess(
            (val) => (typeof val === 'string' ? new Date(val) : val), // Preprocess string to Date
            z.date().refine(date => date > new Date(1900, 0, 1), {
                message: "BirthDate must be after January 1, 1900"
            })
        ),

    // Validation cho Phone, kiểm tra số điện thoại
    phone: z
        .string()
        .regex(/^0\d{9,10}$/, "Phone number must start with 0 and contain 10 or 11 digits."),

    // Validation cho Address, không được để null
    address: z
        .string()
        .min(1, { message: "Address cannot be empty" }), // Không được null hoặc chuỗi rỗng

    // Validation cho Name, không được để null
    name: z
        .string()
        .min(1, { message: "Name cannot be empty" }),
    });

export const ChangePasswordSchema = z.object({
    oldPassword: z
        .string()
        .min(1, "You just entered the old password"),
    
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters") // Đổi độ dài tối thiểu thành 8
        .regex(/[A-Z]+/, "Password must contain at least one uppercase letter") // Kiểm tra chữ cái hoa
        .regex(/[a-z]+/, "Password must contain at least one lowercase letter") // Kiểm tra chữ cái thường
        .regex(/[0-9]+/, "Password must contain at least one number") // Kiểm tra số
        .regex(/[#$%!@&^*]+/, "Password must contain at least one special character (#$%!@&^*)"), // Kiểm tra ký tự đặc biệt
});