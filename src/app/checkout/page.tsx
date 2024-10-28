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
import { Customer } from "@/type/customer";
import { getCustomer } from "@/components/api/customer/customer.api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const getWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);

  // If the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  // If the item has expired, remove it and return null
  if (now.getTime() > item.expiry) {
      toast.warning("Phiên đăng nhập đã hết hạn");
      localStorage.removeItem(key);
      return null;
  }
  return item.value;
};

const Checkout = () => {
  let [totalCart, setTotalCart] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [cart, setCart] = useState<CartItem[] | null>();
  const router = useRouter();
  const [user, setUser] = useState<Customer | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
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
    var token = getWithExpiry("jwtToken");

    if(!token){
      router.push('/login')
      return;
    }

    setIsPending(true);

    if (token && cart) {
      var response = await createOrder(
        cart,
        formData.address,
        formData.paymentMethod,
        formData.firstName,
        totalCart,
        token
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
    const token = getWithExpiry("jwtToken");

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
    const fetchCustomer = async () => {
      console.log("something");
    var token = getWithExpiry('jwtToken');

    if(!token){
      router.push('/login');
      return;
    }

    try {
      var response = await getCustomer(token);
      console.log(response.data)
      setUser(response.data ?? null)
      setCart(getCartFromLocalStorage());
      setFormData((prevData) => ({
        ...prevData,
        firstName: response.data?.name || "", // Giả sử name là trường chứa tên
        address: response.data?.address || "", // Giả sử address là trường chứa địa chỉ
      }));
      checkTokenAndDecode();
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
    };

    fetchCustomer();
  }, [router]);

  const handleUpdateToCart = (productId: string, quantity: number) => {
    updateCart(productId, quantity);
    setCart(getCartFromLocalStorage());
  };

  const handleToRemoveCart = (productId: string) => {
    removeFromCart(productId);
    setCart(getCartFromLocalStorage());
  };

  cart && cart.map((item) => (totalCart += item.unitPrice * item.quantity));

  if(isLoading){
    <div className="w-full flex justify-center my-5 h-[500px] items-center">
    <AiOutlineLoading3Quarters className="animate-spin h-[60px] w-[60px]" />
  </div>
  }

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
                {/* <div className="login flex justify-between gap-4">
                  <h4 className="heading4">Contact</h4>
                  <Link href={"/login"} className="text-button underline">
                    Login here
                  </Link>
                </div> */}
                {/* <div>
                  <input
                    type="text"
                    name="emailOrPhone" // Added name attribute
                    className="border-line mt-5 px-4 py-3 w-full rounded-lg"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    placeholder="Email or mobile phone number"
                    required
                  />
                </div> */}
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
                      className="border-2 border-gray-300 mt-2 px-4 py-3 w-full rounded-lg cursor-pointer bg-white text-black"
                    >
                      <option value="1">Banking</option>{" "}
                      {/* Online Payment */}
                      <option value="0">Ship COD</option>{" "}
                      {/* In-store Payment */}
                    </select>
                  </div>

                  <div className="form-checkout mt-5">
                    <div className="grid sm:grid-cols-2 gap-4 gap-y-5 flex-wrap">
                      <div className="col-span-full relative">
                        <input
                          className="border-line pl-4 pr-12 py-3 w-full rounded-lg"
                          id="firstName"
                          name="firstName" // Added name attribute
                          type="text"
                          value={user?.name ?? ""}
                          onChange={handleChange}
                          placeholder="Họ & Tên"
                          required
                        />
                      </div>
                      {/* <div className="">
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
                      </div> */}
                      <div className="col-span-full relative">
                        <input
                          className="border-line pl-4 pr-12 py-3 w-full rounded-lg"
                          id="address"
                          name="address" // Added name attribute
                          type="text"
                          value={user?.address}
                          onChange={handleChange}
                          placeholder="Địa chỉ"
                          required
                        />
                      </div>
                      {/* <div className="">
                        <input
                          className="border-line px-4 py-3 w-full rounded-lg"
                          id="apartment"
                          name="apartment" // Added name attribute
                          type="text"
                          value={formData.apartment}
                          onChange={handleChange}
                          placeholder="Số nhà, Hẻm, ... (optional)"
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
                          placeholder="Thành phố"
                          required
                        />
                      </div> */}
                      {/* <div className="">
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
                      </div> */}
                    </div>
                    {!isPending ? (
                      <div className="block-button md:mt-10 mt-6">
                        <button
                          type="submit"
                          className="button-main w-full tracking-widest"
                        >
                          Pay now
                        </button>
                    </div>
                    ) : (
                      <div className="w-full flex justify-center md:mt-10 mt-6 items-center">
                        <AiOutlineLoading3Quarters className="animate-spin h-[52px] w-[52px]" />
                      </div>
                    )}
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
