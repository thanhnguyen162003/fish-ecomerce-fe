import { CartItem } from "@/type/CartItem";
import axios from "axios";

interface orderDetail {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
}

const convertCartToOrderDetails = (cartItems: CartItem[]) => {
  return cartItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    discount: item.discount,
  }));
};

export const createOrder = async (
  cartItems: CartItem[] | null | undefined,
  shipAddress: string,
  paymentMethod: number,
  fullName: string,
  totalPrice: number,
  token: string
) => {
  if (cartItems) {
    const orderData = {
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      shipAddress: shipAddress,
      fullName: fullName,
      orderDetails: convertCartToOrderDetails(cartItems),
    };

    try {
      console.log("Begin call api", orderData);

      const response = await axios.post(
        "https://kingfish.azurewebsites.net/api/v1/order",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data.paymentLink;
    } catch (error) {
      console.log("checkout: ", error);
      return error;
    }
  }
};

export const repayOrder = async (orderCode: number, token:string) => {
  try {
    const response = await axios.post(
      "https://kingfish.azurewebsites.net/api/v1/order",
      orderCode,
      {
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data.data.paymentLink;
  } catch (error) {
    console.log("checkout: ", error);
    return error;
  }
};
