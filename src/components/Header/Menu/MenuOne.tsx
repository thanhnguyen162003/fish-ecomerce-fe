"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { usePathname, useRouter } from "next/navigation";
import useLoginPopup from "@/store/useLoginPopup";
import useMenuMobile from "@/store/useMenuMobile";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useModalSearchContext } from "@/context/ModalSearchContext";
import { useCart } from "@/context/CartContext";
import axios from "axios";
import { ProductType } from "@/type/ProductType";

interface Props {
  background: string;
  text: string;
}

const MenuOne: React.FC<Props> = ({ background, text }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { openMenuMobile, handleMenuMobile } = useMenuMobile();
  const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);
  const { openModalCart } = useModalCartContext();
  const { cartState } = useCart();
  const { openModalWishlist } = useModalWishlistContext();
  const { openModalSearch } = useModalSearchContext();
  const [jwt, setJwt] = useState<string | null>(localStorage.getItem("jwtToken"));
  const [fixedHeader, setFixedHeader] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const apiUrl = "https://kingfish.azurewebsites.net/api/v1";

  const getFishProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/product/fishs`, {
        params: { PageSize: 4, PageNumber: 1 },
      });
      localStorage.setItem("myProduct", JSON.stringify(response.data as ProductType[]));
    } catch (error) {
      console.error("Error fetching fish products:", error);
    }
  };

  const getWithExpiry = (key: string) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  useEffect(() => {
    setJwt(localStorage.getItem("jwtToken"));
    getWithExpiry("jwtToken");
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    setJwt("");
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
      setLastScrollPosition(scrollPosition);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPosition]);

  const handleOpenSubNavMobile = (index: number) => {
    setOpenSubNavMobile(openSubNavMobile === index ? null : index);
  };

  return (
    <div
      className={`header-menu item-center style-one ${fixedHeader ? "fixed" : "absolute"} top-0 left-0 right-0 w-full md:h-[74px] h-[56px] ${background} ${text}`}
    >
      <div className={`mx-auto bg-full h-full ${background}`}>
        <div className="max-w-screen-xl mx-auto header-main flex justify-between h-full">
          <div className="left flex items-center gap-16">
            <Link href="/" className="flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2">
              <div className="heading4">Aquamarine</div>
            </Link>
            <div className="menu-main h-full max-lg:hidden">
              <ul className="flex items-center gap-8 h-full">
                <li className="h-full">
                  <Link href="/shop" className={`text-button-uppercase duration-300 h-full flex items-center justify-center}`}>
                    Shop
                  </Link>
                </li>
                <li className="h-full relative">
                  <Link href="/blog" className={`text-button-uppercase duration-300 h-full flex items-center justify-center}`}>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="right flex gap-12">
            <div className="max-md:hidden search-icon flex items-center cursor-pointer relative">
              <Icon.MagnifyingGlass size={24} onClick={openModalSearch} />
              <div className="line absolute bg-line w-px h-6 -right-6"></div>
            </div>
            <div className="list-action flex items-center gap-4">
              <div className="user-icon flex items-center justify-center cursor-pointer">
                <Icon.User size={24} onClick={handleLoginPopup} />
                <div className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-pearlWhite box-shadow-small ${openLoginPopup ? "open" : ""}`}>
                  {!jwt ? (
                    <div>
                      <Link href="/login" className={`button-main w-full text-center ${background} ${text}`}>
                        Login
                      </Link>
                      <div className="text-secondary text-center mt-5 pb-4">
                        Don’t have an account?
                        <Link href="/register" className={`text-black pl-1 hover:underline ${text}`}>
                          Register
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Link href="/my-account" className={`button-main w-full text-center ${background} ${text}`}>
                        My Account
                      </Link>
                      <button className={`button-main w-full text-center ${background} ${text} mt-3`} onClick={handleSignOut}>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="cart-icon flex items-center relative cursor-pointer" onClick={openModalCart}>
                <Icon.Handbag size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuOne;
