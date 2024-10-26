"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import productData from "@/data/Product.json";
import { ProductType } from "@/type/ProductType";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useCart } from "@/context/CartContext";
import { countdownTime } from "@/store/countdownTime";
import CountdownTimeType from "@/type/CountdownType";
import axios from "axios";
import { CartItem } from "@/type/CartItem";
import {
  addToCart,
  getCartFromLocalStorage,
  removeFromCart,
  updateCart,
} from "@/context/CartItemContext";
import { toast } from "react-toastify";
const ModalCart = () => {
  const [activeTab, setActiveTab] = useState<string | undefined>("");
  const { isModalOpen, closeModalCart } = useModalCartContext();
  //   const { cartState, addToCart, removeFromCart, updateCart } = useCart();
  const [products, setProducts] = useState<ProductType[] | undefined>();
  const [cart, setCart] = useState<CartItem[] | null>();

  useEffect(() => {
    setCart(getCartFromLocalStorage());
  }, [isModalOpen]);

  const handleAddToCart = (product: ProductType) => {
    const item: CartItem = {
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
      totalPrice: product.price,
      stock: product.stock_quantity,
      discount: 0,
      name: product.name || "",
      imgUrl: product.images[0]?.link || "/images/product/1000x1000.png",
    };
    addToCart(item);
    setCart(getCartFromLocalStorage());
  };

  const handleUpdateToCart = (productId: string, quantity: number) => {
    updateCart(productId, quantity);
    setCart(getCartFromLocalStorage());
  };

  const handleToRemoveCart = (productId: string) => {
    removeFromCart(productId);
    setCart(getCartFromLocalStorage());
  };

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  let moneyForFreeship = 150;
  let [totalCart, setTotalCart] = useState<number>(0);
  let [discountCart, setDiscountCart] = useState<number>(0);

  cart && cart.map((item) => (totalCart += item.unitPrice * item.quantity));

  useEffect(() => {
    const getProducFromLocalStorage = () => {
      const stringProduct = localStorage.getItem("myProduct");
      if (stringProduct) {
        const mapProduct = JSON.parse(stringProduct) as ProductType[];
        setProducts(mapProduct);
        console.log("modalcart", products);
      }
    };
    getProducFromLocalStorage();
  }, []);

  return (
    <>
      <div className={`modal-cart-block`} onClick={closeModalCart}>
        <div
          className={`modal-cart-main flex ${isModalOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >

          {/*new div tag of "shopping card" */}
          <div className=" cart-block  w-full py-6 relative overflow-hidden">
            <div className="heading px-6 pb-3 flex items-center justify-between relative">
              <div className="heading5">Shopping Cart</div>
              <div
                className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                onClick={closeModalCart}
              >
                <Icon.X size={14} />
              </div>
            </div>
            
            <div className="flex-col flex h-[400px] overflow-y-scroll px-6">
              {cart &&
                cart.map((product) => (
                  <div
                    key={product.productId}
                    className="item py-5 flex items-center justify-between gap-3 border-b border-gray-300"
                  >
                    <div className="infor flex items-center gap-3 w-full">
                      <div className="bg-img w-[100px] aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={product.imgUrl}
                          width={300}
                          height={300}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between w-full">
                          <div className="name text-lg font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div
                            className="remove-cart-btn text-sm font-semibold text-red-600 underline cursor-pointer"
                            onClick={() =>
                              handleToRemoveCart(product.productId)
                            }
                          >
                            Remove
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-3 w-full">
                          <div className="flex items-center text-gray-600 capitalize">
                            <Icon.PlusSquare
                              onClick={() =>{
                                  if (product.quantity < product.stock) {
                                    handleUpdateToCart(product.productId, product.quantity + 1);
                                  } else {
                                    toast.warning("Số lượng sản phẩm vượt quá hàng kho!");
                                  }
                                }  
                              }
                              className="cursor-pointer"
                            />
                            <span className="mx-2">{product.quantity}</span>
                            <Icon.MinusSquare
                              onClick={() => {
                                if (product.quantity > 1) {
                                  handleUpdateToCart(product.productId, product.quantity - 1);
                                }
                              }
                                
                              }
                              className="cursor-pointer"
                            />
                          </div>
                          <div className="product-price text-xl font-bold text-gray-800">
                            {product.unitPrice.toLocaleString("vi-VN")} VND
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="footer-modal bg-white absolute bottom-0 left-0 w-full">
              
              <div className="flex items-center justify-between pt-6 px-6">
                <div className="heading5">Subtotal</div>
                <div className="heading5">
                  {totalCart.toLocaleString("vi-VI")} VND
                </div>
              </div>
              <div className="block-button text-center p-6">
                <div className="flex items-center gap-4">
                  <Link
                    href={"/cart"}
                    className="button-main basis-1/2 bg-white border border-black text-black text-center uppercase"
                    onClick={(e) => {
                      if (cart && cart.length === 0) {
                        e.preventDefault(); // Ngăn chuyển hướng nếu giỏ hàng trống
                        toast.info("Giỏ hàng đang trống, xin hãy thêm sản phẩm.")

                      } else {
                        closeModalCart(); // Đóng modal nếu giỏ hàng có item
                      }
                    }}
                  >
                    View cart
                  </Link>
                  <Link
                    href={"/checkout"}
                    className="button-main basis-1/2 text-center uppercase"
                    onClick={(e) => {
                      if (cart && cart.length === 0) {
                        e.preventDefault(); // Ngăn chuyển hướng nếu giỏ hàng trống
                        toast.info("Giỏ hàng đang trống, xin hãy thêm sản phẩm.")
                      } else {
                        closeModalCart(); // Đóng modal nếu giỏ hàng có item
                      }
                    }}
                  >
                    Check Out
                  </Link>
                </div>
                <div
                  onClick={closeModalCart}
                  className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block"
                >
                  Or continue shopping
                </div>
              </div>
              {/* <div
                className={`tab-item note-block ${
                  activeTab === "note" ? "active" : ""
                }`}
              >
                <div className="px-6 py-4 border-b border-line">
                  <div className="item flex items-center gap-3 cursor-pointer">
                    <Icon.NotePencil className="text-xl" />
                    <div className="caption1">Note</div>
                  </div>
                </div>
                <div className="form pt-4 px-6">
                  <textarea
                    name="form-note"
                    id="form-note"
                    rows={4}
                    placeholder="Add special instructions for your order..."
                    className="caption1 py-3 px-4 bg-surface border-line rounded-md w-full"
                  ></textarea>
                </div>
                <div className="block-button text-center pt-4 px-6 pb-6">
                  <div
                    className="button-main w-full text-center"
                    onClick={() => setActiveTab("")}
                  >
                    Save
                  </div>
                  <div
                    onClick={() => setActiveTab("")}
                    className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block"
                  >
                    Cancel
                  </div>
                </div>
              </div> */}
              {/* <div
                className={`tab-item note-block ${
                  activeTab === "shipping" ? "active" : ""
                }`}
              >
                <div className="px-6 py-4 border-b border-line">
                  <div className="item flex items-center gap-3 cursor-pointer">
                    <Icon.Truck className="text-xl" />
                    <div className="caption1">Estimate shipping rates</div>
                  </div>
                </div>
                <div className="form pt-4 px-6">
                  <div className="">
                    <label
                      htmlFor="select-country"
                      className="caption1 text-secondary"
                    >
                      Country/region
                    </label>
                    <div className="select-block relative mt-2">
                      <select
                        id="select-country"
                        name="select-country"
                        className="w-full py-3 pl-5 rounded-xl bg-white border border-line"
                        defaultValue={"Country/region"}
                      >
                        <option value="Country/region" disabled>
                          Country/region
                        </option>
                        <option value="France">France</option>
                        <option value="Spain">Spain</option>
                        <option value="UK">UK</option>
                        <option value="USA">USA</option>
                      </select>
                      <Icon.CaretDown
                        size={12}
                        className="absolute top-1/2 -translate-y-1/2 md:right-5 right-2"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="select-state"
                      className="caption1 text-secondary"
                    >
                      State
                    </label>
                    <div className="select-block relative mt-2">
                      <select
                        id="select-state"
                        name="select-state"
                        className="w-full py-3 pl-5 rounded-xl bg-white border border-line"
                        defaultValue={"State"}
                      >
                        <option value="State" disabled>
                          State
                        </option>
                        <option value="Paris">Paris</option>
                        <option value="Madrid">Madrid</option>
                        <option value="London">London</option>
                        <option value="New York">New York</option>
                      </select>
                      <Icon.CaretDown
                        size={12}
                        className="absolute top-1/2 -translate-y-1/2 md:right-5 right-2"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="select-code"
                      className="caption1 text-secondary"
                    >
                      Postal/Zip Code
                    </label>
                    <input
                      className="border-line px-5 py-3 w-full rounded-xl mt-3"
                      id="select-code"
                      type="text"
                      placeholder="Postal/Zip Code"
                    />
                  </div>
                </div>
                <div className="block-button text-center pt-4 px-6 pb-6">
                  <div
                    className="button-main w-full text-center"
                    onClick={() => setActiveTab("")}
                  >
                    Calculator
                  </div>
                  <div
                    onClick={() => setActiveTab("")}
                    className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block"
                  >
                    Cancel
                  </div>
                </div>
              </div> */}
              {/* <div
                className={`tab-item note-block ${
                  activeTab === "coupon" ? "active" : ""
                }`}
              >
                <div className="px-6 py-4 border-b border-line">
                  <div className="item flex items-center gap-3 cursor-pointer">
                    <Icon.Tag className="text-xl" />
                    <div className="caption1">Add A Coupon Code</div>
                  </div>
                </div>
                <div className="form pt-4 px-6">
                  <div className="">
                    <label
                      htmlFor="select-discount"
                      className="caption1 text-secondary"
                    >
                      Enter Code
                    </label>
                    <input
                      className="border-line px-5 py-3 w-full rounded-xl mt-3"
                      id="select-discount"
                      type="text"
                      placeholder="Discount code"
                    />
                  </div>
                </div>
                <div className="block-button text-center pt-4 px-6 pb-6">
                  <div
                    className="button-main w-full text-center"
                    onClick={() => setActiveTab("")}
                  >
                    Apply
                  </div>
                  <div
                    onClick={() => setActiveTab("")}
                    className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block"
                  >
                    Cancel
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          {/*xoa cai "you also may like" thi phai vao styles/layout/model.css - line 305 de fix width*/}
        </div>
      </div>
    </>
  );
};

export default ModalCart;
