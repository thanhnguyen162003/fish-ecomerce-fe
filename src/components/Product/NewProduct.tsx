"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/type/ProductType";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useModalCompareContext } from "@/context/ModalCompareContext";
import { useModalQuickviewContext } from "@/context/ModalQuickviewContext";
import { useRouter } from "next/navigation";
import Marquee from "react-fast-marquee";
import Rate from "../Other/Rate";

interface ProductProps {
  data: ProductType;
  type: string;
}

const Product: React.FC<ProductProps> = ({ data, type }) => {
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<string>("");
  const [openQuickShop, setOpenQuickShop] = useState<boolean>(false);
  const { addToCart, updateCart, cartState } = useCart();
  const { openModalCart } = useModalCartContext();
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();
  const { openQuickview } = useModalQuickviewContext();
  const router = useRouter();

  const handleActiveColor = (item: string) => {
    setActiveColor(item);
  };

  const handleActiveSize = (item: string) => {
    setActiveSize(item);
  };

  const handleAddToCart = () => {
    if (!cartState.cartArray.find((item) => item.id === data.id)) {
      // addToCart({ ...data });
      updateCart(data.id, 1, activeSize, activeColor);
    } else {
      updateCart(data.id, 1, activeSize, activeColor);
    }
    openModalCart();
  };

  const handleAddToWishlist = () => {
    // if product existed in wishlit, remove from wishlist and set state to false
    if (wishlistState.wishlistArray.some((item) => item.id === data.id)) {
      removeFromWishlist(data.id);
    } else {
      // else, add to wishlist and set state to true
      // addToWishlist(data);
    }
    openModalWishlist();
  };

  const handleAddToCompare = () => {
    // if product existed in wishlit, remove from wishlist and set state to false
    if (compareState.compareArray.length < 3) {
      if (compareState.compareArray.some((item) => item.id === data.id)) {
        removeFromCompare(data.id);
      } else {
        // else, add to wishlist and set state to true
        // addToCompare(data);
      }
    } else {
      alert("Compare up to 3 products");
    }

    openModalCompare();
  };

  const handleQuickviewOpen = () => {
    // openQuickview(data);
  };

  const handleDetailProduct = (productId: string, type?: string) => {
    // redirect to shop with category selected
    router.push(`/product?id=${productId}&type=${type}`);
  };

  let percentSale = Math.floor(100 - (data.price / data.original_price) * 100);

  return (
    <>
      {type === "grid" && (
        <div className="product-item grid-type">
          <div
            onClick={() => handleDetailProduct(data.id, data.type)}
            className="product-main cursor-pointer block"
          >
            <div className="product-thumb bg-white relative overflow-hidden rounded-2xl">
              {/* <div classN`ame="list-action-right absolute top-3 right-3 max-lg:hidden">
                <div
                  className={`compare-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative mt-2 ${
                    compareState.compareArray.some(
                      (item) => item.id === data.id
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCompare();
                  }}
                >
                  <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                    Compare Product
                  </div>
                  <Icon.Repeat size={18} className="compare-icon" />
                  <Icon.CheckCircle size={20} className="checked-icon" />
                </div>
              </div>` */}
              <div className="product-img w-full h-full aspect-[3/4]">
                <Image
                  src={
                    data.images[0]
                      ? data.images[0].link!
                      : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Yuyuan_Garden.jpg/800px-Yuyuan_Garden.jpg"
                  }
                  width={500}
                  height={500}
                  alt={data.name!}
                  priority={true}
                  className="w-full h-full object-cover duration-700"
                />
              </div>
              <div className="list-action grid grid-cols-2 gap-3 px-5 absolute w-full bottom-5 max-lg:hidden">
                <div
                  className="add-cart-btn w-full text-button-uppercase py-2 text-center rounded-full duration-500 bg-white hover:bg-black hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                >
                  Add To Cart
                </div>
                <div
                  className="quick-shop-btn text-button-uppercase py-2 text-center rounded-full duration-500 bg-white hover:bg-black hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Link href={"/product?id={1}"}>Detail</Link>
                </div>
                <div className="list-action-icon flex items-center justify-center gap-2 absolute w-full bottom-3 z-[1] lg:hidden">
                  <div
                    className="quick-view-btn w-9 h-9 flex items-center justify-center rounded-lg duration-300 bg-white hover:bg-black hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickviewOpen();
                    }}
                  >
                    <Icon.Eye className="text-lg" />
                  </div>
                  <div
                    className="add-cart-btn w-9 h-9 flex items-center justify-center rounded-lg duration-300 bg-white hover:bg-black hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart();
                    }}
                  >
                    <Icon.ShoppingBagOpen className="text-lg" />
                  </div>
                </div>
              </div>
              <div className="product-infor mt-4 lg:mb-7">
                <div className="product-sold sm:pb-4 pb-2">
                  <div className="flex items-center justify-between gap-3 gap-y-1 flex-wrap mt-2">
                    <div className="text-button-uppercase">
                      <span className="text-secondary2 max-sm:text-xs">
                        Sold:{" "}
                      </span>
                      <span className="max-sm:text-xs">{data.sold}</span>
                    </div>
                    <div className="text-button-uppercase">
                      <span className="text-secondary2 max-sm:text-xs">
                        Available:{" "}
                      </span>
                      <span className="max-sm:text-xs">
                        {data.stockQuantity}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="product-name text-title duration-300">
                  {data.name}
                </div>
                <div className="product-price-block flex items-center gap-2 flex-wrap mt-1 duration-300 relative z-[1]">
                  <div className="product-price text-title">
                    {data.price.toLocaleString("vi-VN")} VND
                  </div>
                  {percentSale > 0 && (
                    <>
                      <div className="product-origin-price caption1 text-secondary2">
                        <del>
                          {data.original_price.toLocaleString("vi-VN")} VND
                        </del>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === "marketplace" && (
        <div
          className="product-item style-marketplace p-4 border border-line rounded-2xl"
          onClick={() => handleDetailProduct(data.id)}
        >
          <div className="bg-img relative w-full">
            <Image
              className="w-full aspect-square"
              width={5000}
              height={5000}
              src={
                data.images[0]!
                  ? data.images[0]!.link!
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Yuyuan_Garden.jpg/800px-Yuyuan_Garden.jpg"
              }
              alt="img"
            />
            <div className="list-action flex flex-col gap-1 absolute top-0 right-0">
              <span
                className={`add-wishlist-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300 ${
                  wishlistState.wishlistArray.some(
                    (item) => item.id === data.id
                  )
                    ? "active"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist();
                }}
              >
                {wishlistState.wishlistArray.some(
                  (item) => item.id === data.id
                ) ? (
                  <>
                    <Icon.Heart
                      size={18}
                      weight="fill"
                      className="text-white"
                    />
                  </>
                ) : (
                  <>
                    <Icon.Heart size={18} />
                  </>
                )}
              </span>
              <span
                className={`compare-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300 ${
                  compareState.compareArray.some((item) => item.id === data.id)
                    ? "active"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCompare();
                }}
              >
                <Icon.Repeat size={18} className="compare-icon" />
                <Icon.CheckCircle size={20} className="checked-icon" />
              </span>
              <span
                className="quick-view-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickviewOpen();
                }}
              >
                <Icon.Eye />
              </span>
              <span
                className="add-cart-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
              >
                <Icon.ShoppingBagOpen />
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
