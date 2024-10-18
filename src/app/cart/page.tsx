"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { countdownTime } from "@/store/countdownTime";
import { CartItem } from "@/type/CartItem";
import { getCartFromLocalStorage, removeFromCart, updateCart } from "@/context/CartItemContext";

const Cart = () => {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[] | null>();

  const handleUpdateToCart = (productId: string, quantity: number) => {
    updateCart(productId, quantity);
    setCart(getCartFromLocalStorage());
  };

  const handleToRemoveCart = (productId: string) => {
    removeFromCart(productId);
    setCart(getCartFromLocalStorage());
  };

  let moneyForFreeship = 150;
  let [totalCart, setTotalCart] = useState<number>(0);
  let [shipCart, setShipCart] = useState<number>(30);

  cart && cart.map((item) => (totalCart += item.unitPrice * item.quantity));

  if (totalCart < moneyForFreeship) {
    shipCart = 30;
  }

  const redirectToCheckout = () => {
    router.push(`/checkout?ship=${shipCart}`);
  };

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb heading="Shopping cart" />
      </div>
      <div className="cart-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex justify-between max-xl:flex-col gap-y-8">
            <div className="xl:w-2/3 xl:pr-3 w-full">
              <div className="heading banner mt-5">
                <div className="text">
                  Buy
                  <span className="text-button">
                    {" "}
                    $
                    <span className="more-price">
                      {moneyForFreeship - totalCart > 0 ? (
                        <>{moneyForFreeship - totalCart}</>
                      ) : (
                        0
                      )}
                    </span>
                    .00{" "}
                  </span>
                  <span>more to get </span>
                  <span className="text-button">freeship</span>
                </div>
                <div className="tow-bar-block mt-4">
                  <div
                    className="progress-line"
                    style={{
                      width:
                        totalCart <= moneyForFreeship
                          ? `${(totalCart / moneyForFreeship) * 100}%`
                          : `100%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="list-product w-full sm:mt-7 mt-5">
                <div className="w-full">
                  <div className="heading bg-surface bora-4 pt-4 pb-4">
                    <div className="flex">
                      <div className="w-1/2">
                        <div className="text-button text-center">Products</div>
                      </div>
                      <div className="w-1/12">
                        <div className="text-button text-center">Price</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">Quantity</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">
                          Total Price
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="list-product-main w-full mt-3">
                    {cart && (
                      cart.map((product) => (
                        <div
                          className="item flex md:mt-7 md:pb-7 mt-5 pb-5 border-b border-line w-full"
                          key={product.productId}
                        >
                          <div className="w-1/2">
                            <div className="flex items-center gap-6">
                              <div className="bg-img md:w-[100px] w-20 aspect-[3/4]">
                                <Image
                                  src={product.imgUrl ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Yuyuan_Garden.jpg/800px-Yuyuan_Garden.jpg"}
                                  width={1000}
                                  height={1000}
                                  alt={product.name ?? "Product Image"}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                              <div>
                                <div className="text-title">{product.name}</div>
                                <div className="list-select mt-3"></div>
                              </div>
                            </div>
                          </div>
                          <div className="w-1/12 price flex items-center justify-center">
                            <div className="text-title text-center">
                              {product.unitPrice.toLocaleString("vi-VI")} VND
                            </div>
                          </div>
                          <div className="w-1/6 flex items-center justify-center">
                            <div className="quantity-block bg-surface md:p-3 p-2 flex items-center justify-between rounded-lg border border-line md:w-[100px] flex-shrink-0 w-20">
                            <Icon.PlusSquare
                              onClick={() =>
                                handleUpdateToCart(
                                  product.productId,
                                  product.quantity + 1
                                )
                              }
                              className="cursor-pointer"
                            />
                            <span className="mx-2">{product.quantity}</span>
                            <Icon.MinusSquare
                              onClick={() =>
                                handleUpdateToCart(
                                  product.productId,
                                  product.quantity - 1
                                )
                              }
                              className="cursor-pointer"
                            />
                            </div>
                          </div>
                          <div className="w-1/6 flex total-price items-center justify-center">
                            <div className="text-title text-center">
                              {(product.quantity * product.unitPrice).toLocaleString("vi-VI")}
                            </div>
                          </div>
                          <div className="w-1/12 flex items-center justify-center">
                            <Icon.XCircle
                              className="text-xl max-md:text-base text-red cursor-pointer hover:text-black duration-500"
                              onClick={() => {
                                removeFromCart(product.productId);
                              }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:w-1/3 xl:pl-12 w-full">
              <div className="checkout-block bg-surface p-6 rounded-2xl">
                <div className="heading5">Order Summary</div>
                <div className="total-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Subtotal</div>
                  <div className="text-title">
                    $<span className="total-product">{totalCart}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="ship-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Shipping</div>
                  <div className="choose-type flex gap-12">
                    <div className="left">
                      <div className="type">
                        {moneyForFreeship - totalCart > 0 ? (
                          <input
                            id="shipping"
                            type="radio"
                            name="ship"
                            disabled
                          />
                        ) : (
                          <input
                            id="shipping"
                            type="radio"
                            name="ship"
                            checked={shipCart === 0}
                            onChange={() => setShipCart(0)}
                          />
                        )}
                        <label className="pl-1" htmlFor="shipping">
                          Free Shipping:
                        </label>
                      </div>
                      <div className="type mt-1">
                        <input
                          id="local"
                          type="radio"
                          name="ship"
                          value={30}
                          checked={shipCart === 30}
                          onChange={() => setShipCart(30)}
                        />
                        <label
                          className="text-on-surface-variant1 pl-1"
                          htmlFor="local"
                        >
                          Local:
                        </label>
                      </div>
                      <div className="type mt-1">
                        <input
                          id="flat"
                          type="radio"
                          name="ship"
                          value={40}
                          checked={shipCart === 40}
                          onChange={() => setShipCart(40)}
                        />
                        <label
                          className="text-on-surface-variant1 pl-1"
                          htmlFor="flat"
                        >
                          Flat Rate:
                        </label>
                      </div>
                    </div>
                    <div className="right">
                      <div className="ship">$0.00</div>
                      <div className="local text-on-surface-variant1 mt-1">
                        $30.00
                      </div>
                      <div className="flat text-on-surface-variant1 mt-1">
                        $40.00
                      </div>
                    </div>
                  </div>
                </div>
                <div className="total-cart-block pt-4 pb-4 flex justify-between">
                  <div className="heading5">Total</div>
                  <div className="heading5">
                    $
                    <span className="total-cart heading5">
                      {totalCart - + shipCart}
                    </span>
                    <span className="heading5">.00</span>
                  </div>
                </div>
                <div className="block-button flex flex-col items-center gap-y-4 mt-5">
                  <div
                    className="checkout-btn button-main text-center w-full"
                    onClick={redirectToCheckout}
                  >
                    Process To Checkout
                  </div>
                  <Link
                    className="text-button hover-underline"
                    href={"/shop/breadcrumb1"}
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
