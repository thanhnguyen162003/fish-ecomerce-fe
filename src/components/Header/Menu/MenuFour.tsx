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

interface Props {
  background: string;
  text: string;
}

const MenuFour: React.FC<Props> = ({ background, text }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { openMenuMobile, handleMenuMobile } = useMenuMobile();
  const { openModalCart } = useModalCartContext();
  const { cartState } = useCart();
  const { openModalWishlist } = useModalWishlistContext();
  const { openModalSearch } = useModalSearchContext();

  const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwtToken"));
  const [fixedHeader, setFixedHeader] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const handleSearch = (value: string) => {
    router.push(`/search-result?query=${value}`);
    setSearchKeyword("");
  };

  const handleOpenSubNavMobile = (index: number) => {
    setOpenSubNavMobile(openSubNavMobile === index ? null : index);
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    setToken("");
    router.refresh();
  };

  useEffect(() => {
    setToken(localStorage.getItem("jwtToken"));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
      setLastScrollPosition(scrollPosition);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPosition]);

  const handleNavigation = (type: string, value: string) => {
    router.push(`/shop/breadcrumb1?${type}=${value}`);
  };

  return (
    <div className={`header-menu style-one ${fixedHeader ? "fixed" : "relative"} w-full md:h-[74px] h-[56px] ${background} ${text}`}>
      <div className="container mx-auto h-full">
        <div className="header-main flex items-center justify-between h-full">
          <div className="menu-mobile-icon lg:hidden flex items-center" onClick={handleMenuMobile}>
            <i className="icon-category text-2xl"></i>
          </div>
          <Link href="/" className="flex items-center lg:hidden">
            <div className="heading4">Aquamarine</div>
          </Link>
          <Icon.MagnifyingGlass size={24} onClick={openModalSearch} />
          <div className="menu-main h-full xl:w-full flex items-center justify-center max-lg:hidden xl:absolute xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2">
            <ul className="flex items-center gap-8 h-full">
              <li className="h-full">
                <Link href="/homepages" className={`text-secondary duration-300 ${pathname === "/homepages/fashion6" ? "active" : ""}`}>
                  Home
                </Link>
              </li>
              <li className="h-full">
                <Link href="/shop" className="text-button-uppercase duration-300 h-full flex items-center justify-center">
                  Shop
                </Link>
              </li>
              <li className="h-full">
                <Link href="pages/about" className="text-button-uppercase duration-300 h-full flex items-center justify-center">
                  About Us
                </Link>
              </li>
              <li className="h-full flex items-center justify-center logo">
                <Link href="/" className="heading4">
                  Aquamarine
                </Link>
              </li>
              <li className="h-full">
                <Link href="/blog" className="text-button-uppercase duration-300 h-full flex items-center justify-center">
                  Blog
                </Link>
              </li>
              <li className="h-full">
                <Link href="pages/contact" className="text-button-uppercase duration-300 h-full flex items-center justify-center">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="right flex gap-12 z-[1]">
            <div className="list-action flex items-center gap-4">
              <div className="user-icon flex items-center justify-center cursor-pointer">
                <Icon.User size={24} onClick={handleLoginPopup} />
                <div className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-small bg-pearlWhite ${openLoginPopup ? "open" : ""}`}>
                  {!token ? (
                    <div>
                      <Link href="/login" className={`button-main w-full text-center ${background} ${text}`}>
                        Login
                      </Link>
                      <div className="text-secondary text-center mt-3 pb-4">
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
              <div className="max-md:hidden wishlist-icon flex items-center cursor-pointer" onClick={openModalWishlist}>
                <Icon.Heart size={24} />
              </div>
              <div className="cart-icon flex items-center relative cursor-pointer" onClick={openModalCart}>
                <Icon.Handbag size={24} />
                <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                  {cartState.cartArray.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuFour;
