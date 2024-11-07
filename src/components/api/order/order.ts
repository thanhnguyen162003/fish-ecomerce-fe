import axios from "axios";

export interface Order{
    orderDate: string,
    shippedDate: string | null,
    totalPrice: number,
    status: string,
    orderCode: number,
    isPaid: false,
    paymentMethod: string,
    shipAddress: string | null,
    orderDetails: OrderDetail[]
  }
  export interface OrderDetail{
    productName: string,
    quantity: number,
    unitPrice: number,
    totalPrice: number,
    discount: number
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  axios.interceptors.response.use(response => {
    response.data = normalizeData(response.data);
    return response;
  });
  
  export const normalizeData = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map(normalizeData);
    } else if (data !== null && typeof data === 'object') {
      return Object.keys(data).reduce((acc: any, key) => {
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelCaseKey] = normalizeData(data[key]);
        return acc;
      }, {});
    }
    return data;
  };
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
        return response;
      } catch (error) {
        console.error("Error fetching customer:", error);
        throw error;
      }
  }
  
  export const GetOrdertAPI = async (token:string, order_code:string) => {
    try {
        const params = {
            orderCode: order_code
        }
        const response = await axios.get(`${apiUrl}/v1/order/${order_code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching customer:", error);
        throw error;
      }
  }