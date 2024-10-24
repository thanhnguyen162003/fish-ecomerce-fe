import {Customer} from "@/type/customer"
import axios from "axios"
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getCustomer = async (token: string) => {
    try {
      const response = await axios.get(`${apiUrl}/v1/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  };

  export const updateCustomer = async (token: string, customer: Customer) => {
    try {
      const response = await axios.patch(`${apiUrl}/v1/customers`, 
        {name: customer.name, phone: customer.phone, address: customer.address, birthday: customer.birthday ,gender:customer.gender}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  };