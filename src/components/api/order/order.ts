import axios from "axios";

export interface Order{
    order_date: string,
    shipped_date: string | null,
    total_price: number,
    status: string,
    order_code: number,
    is_paid: false,
    payment_method: string,
    ship_address: string | null,
    order_details: OrderDetail[]
  }
  export interface OrderDetail{
    product_name: string,
    quantity: number,
    unit_price: number,
    total_price: number,
    discount: number
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  export const GetOrderListAPI = async (token:string, pageSize: number, pageNumber: number) => {
    try {
        const params = {
            PageSize: pageSize,
            PageNumber: pageNumber
        }
        const response = await axios.get(`${apiUrl}/v1/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }, params
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching customer:", error);
        throw error;
      }
  }