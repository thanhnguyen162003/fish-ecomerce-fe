"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { jwtDecode } from "jwt-decode";
import { CartItem } from "@/type/CartItem";
import {
  getCartFromLocalStorage,
  removeFromCart,
  updateCart,
} from "@/context/CartItemContext";
import Image from "next/image";
import { createOrder } from "@/components/api/order/checkout";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Checkout = () => {
  let [totalCart, setTotalCart] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [cart, setCart] = useState<CartItem[] | null>();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    zipcode: "",
    paymentMethod: 1, // default value
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const route = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn việc reload trang
    console.log(formData); // Xử lý hoặc gửi API ở đây
    var jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken && cart) {
      var response = await createOrder(
        cart,
        formData.address + " " + formData.city,
        formData.paymentMethod,
        totalCart,
        jwtToken
      ); 
      if (typeof response === "string" && response.includes("payos")) {
        console.log(response);
        
        window.location.href = response
      }
      else{
        toast.error(response)
      }
    } else {
      route.push("/login");
    }
  };

  const checkTokenAndDecode = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.log("No token found in localStorage");
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const uniqueName = decodedToken.unique_name;
      console.log("Unique Name:", uniqueName);
      setEmail(uniqueName);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log("something");
    setCart(getCartFromLocalStorage());
    checkTokenAndDecode();
  }, []);

  const handleUpdateToCart = (productId: string, quantity: number) => {
    updateCart(productId, quantity);
    setCart(getCartFromLocalStorage());
  };

  const handleToRemoveCart = (productId: string) => {
    removeFromCart(productId);
    setCart(getCartFromLocalStorage());
  };

  cart && cart.map((item) => (totalCart += item.unitPrice * item.quantity));

  return (
    <>
      {/* <div id="header" className="relative w-full">
        <div
          className={`header-menu style-one fixed top-0 left-0 right-0 w-full md:h-[74px] h-[56px]`}
        >
          <div className="container mx-auto h-full">
            <div className="header-main flex items-center justify-between h-full">
              <Link href={"/"} className="flex items-center">
                <div className="heading4">Aquamarine</div>
              </Link>
              <button className="max-md:hidden cart-icon flex items-center relative h-fit cursor-pointer">
                <Icon.Handbag size={24} color="black" />
                {cart && (
                  <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div> */}
      <div className="checkout-block relative md:pt-[74px] pt-[56px]">
        <div className="content-main flex max-lg:flex-col-reverse justify-between">
          <div className="left flex lg:justify-end w-full">
            <div className="lg:max-w-[716px] flex-shrink-0 w-full lg:pt-20 pt-12 lg:pr-[70px] pl-[16px] max-lg:pr-[16px]">
              <form onSubmit={handleSubmit}>
                <div className="login flex justify-between gap-4">
                  <h4 className="heading4">Contact</h4>
                  <Link href={"/login"} className="text-button underline">
                    Login here
                  </Link>
                </div>
                <div>
                  <input
                    type="text"
                    name="emailOrPhone" // Added name attribute
                    className="border-line mt-5 px-4 py-3 w-full rounded-lg"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    placeholder="Email or mobile phone number"
                    required
                  />
                </div>
                <div className="information md:mt-10 mt-6">
                  <div className="heading5">Delivery</div>
                  <div className="deli_type mt-5">
                    <label htmlFor="paymentMethod" className="heading6">
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod" // Ensure this name matches the formData key
                      value={formData.paymentMethod} // This binds the value to formData
                      onChange={handleChange} // Triggers the handleChange to update state
                      className="border-line mt-2 px-4 py-3 w-full rounded-lg cursor-pointer"
                    >
                      <option value="1">Thanh toán trực tuyến</option>{" "}
                      {/* Online Payment */}
                      <option value="0">Thanh toán trực tiếp</option>{" "}
                      {/* In-store Payment */}
                    </select>
                  </div>

                  <div className="form-checkout mt-5">
                    <div className="grid sm:grid-cols-2 gap-4 gap-y-5 flex-wrap">
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="firstName"
                          name="firstName" // Added name attribute
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First Name (optional)"
                          required
                        />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="lastName"
                          name="lastName" // Added name attribute
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last Name"
                          required
                        />
                      </div>
                      <div className="col-span-full relative">
                        <input
                          className="border-line pl-4 pr-12 py-3 w-full rounded-lg"
                          id="address"
                          name="address" // Added name attribute
                          type="text"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Address"
                          required
                        />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="apartment"
                          name="apartment" // Added name attribute
                          type="text"
                          value={formData.apartment}
                          onChange={handleChange}
                          placeholder="Apartment, suite, etc. (optional)"
                        />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="city"
                          name="city" // Added name attribute
                          type="text"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="zipcode"
                          name="zipcode" // Added name attribute
                          type="text"
                          value={formData.zipcode}
                          onChange={handleChange}
                          placeholder="Zip Code"
                          required
                        />
                      </div>
                    </div>
                    <div className="block-button md:mt-10 mt-6">
                      <button
                        type="submit"
                        className="button-main w-full tracking-widest"
                      >
                        Pay now
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="right justify-start flex-shrink-0 lg:w-[47%] bg-surface lg:py-20 py-12">
            <div className="lg:sticky lg:top-24 h-fit lg:max-w-[606px] w-full flex-shrink-0 lg:pl-[80px] pr-[16px] max-lg:pl-[16px]">
              {cart && (
                <div className="list_prd flex flex-col gap-7">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="item flex items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-6">
                        <div className="bg_img relative flex-shrink-0 w-[100px] h-[100px]">
                          <Image
                            src={item.imgUrl || "/images/product/1000x1000.png"}
                            width={1000}
                            height={1000}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <span className="quantity flex items-center justify-center absolute -top-3 -right-3 w-7 h-7 rounded-full bg-black text-white">
                            {item.quantity}
                          </span>
                        </div>
                        <div>
                          <strong className="name text-title">
                            {item.name}
                          </strong>
                          {/* <div className="flex items-center gap-2 mt-2">
                          <Icon.Tag className="text-secondary" />
                          <span className="code text-secondary">
                            AN6810 <span className="discount">(-$14.20)</span>
                          </span>
                        </div> */}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {/* <del className="caption1 text-secondary text-end org_price">
                        $99.00
                      </del> */}
                        <strong className="text-title price">
                          {item.unitPrice * item.quantity} VND
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="subtotal flex items-center justify-between mt-8">
                <strong className="heading6">Total</strong>
                <strong className="heading6">
                  {totalCart.toLocaleString("vi-VI")} VND
                </strong>
              </div>
              {/* <div className="ship-block flex items-center justify-between mt-4">
                <strong className="heading6">Shipping</strong>
                <span className="body1 text-secondary">
                  Enter shipping address
                </span>
              </div>
              <div className="total-cart-block flex items-center justify-between mt-4">
                <strong className="heading4">Total</strong>
                <div className="flex items-end gap-2">
                  <span className="body1 text-secondary">USD</span>
                  <strong className="heading4">$186,99</strong>
                </div>
              </div> */}
              {/* <div className="total-saving-block flex items-center gap-2 mt-4">
                <Icon.Tag weight="bold" className="text-xl" />
                <strong className="heading5">TOTAL SAVINGS</strong>
                <strong className="heading5">$14.85</strong>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
