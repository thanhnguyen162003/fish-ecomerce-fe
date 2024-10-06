'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { usePathname } from 'next/navigation';
import Product from '@/components/Product/Product';
import productData from '@/data/Product.json'
import useLoginPopup from '@/store/useLoginPopup';
import useMenuMobile from '@/store/useMenuMobile';
import { useModalCartContext } from '@/context/ModalCartContext';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { useModalSearchContext } from '@/context/ModalSearchContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode';

interface Props {
    props: string
}

const MenuFour: React.FC<Props> = ({ props }) => {
    const pathname = usePathname()
    const { openLoginPopup, handleLoginPopup } = useLoginPopup()
    const { openMenuMobile, handleMenuMobile } = useMenuMobile()
    const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null)
    const { openModalCart } = useModalCartContext()
    const { cartState } = useCart()
    const { openModalWishlist } = useModalWishlistContext()
    const { openModalSearch } = useModalSearchContext()
    const [searchKeyword, setSearchKeyword] = useState('');
    const [email, setEmail] = useState('')
    const router = useRouter()

    const handleSearch = (value: string) => {
        router.push(`/search-result?query=${value}`)
        setSearchKeyword('')
    }

    const handleOpenSubNavMobile = (index: number) => {
        setOpenSubNavMobile(openSubNavMobile === index ? null : index)
    }

    const [fixedHeader, setFixedHeader] = useState(false)
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    const checkTokenAndDecode = () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.log('No token found in localStorage');
            return null;
        }

        try {
            const decodedToken: any = jwtDecode(token)
            const uniqueName = decodedToken.unique_name
            console.log('Unique Name:', uniqueName);
            setEmail(uniqueName)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSignOut = () => {
        localStorage.removeItem('jwtToken')
        router.refresh();
    }

    useEffect(() => {
        console.log("something");

        checkTokenAndDecode();
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
            setLastScrollPosition(scrollPosition);
        };

        // Gắn sự kiện cuộn khi component được mount
        window.addEventListener('scroll', handleScroll);

        // Hủy sự kiện khi component bị unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPosition]);

    const handleGenderClick = (gender: string) => {
        router.push(`/shop/breadcrumb1?gender=${gender}`);
    };

    const handleCategoryClick = (category: string) => {
        router.push(`/shop/breadcrumb1?category=${category}`);
    };

    const handleTypeClick = (type: string) => {
        router.push(`/shop/breadcrumb1?type=${type}`);
    };

    return (
        <>
            <div className={`header-menu style-one ${fixedHeader ? ' fixed' : 'relative'} w-full md:h-[74px] h-[56px] ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="header-main flex items-center justify-between h-full">
                        <div className="menu-mobile-icon lg:hidden flex items-center" onClick={handleMenuMobile}>
                            <i className="icon-category text-2xl"></i>
                        </div>
                        <Link href={'/'} className='flex items-center lg:hidden'>
                            <div className="heading4">Aquamarine</div>
                        </Link>
                        <div className="form-search relative max-lg:hidden z-[1]">
                            <Icon.MagnifyingGlass
                                size={16}
                                className='absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer'
                                onClick={() => {
                                    handleSearch(searchKeyword)
                                }}
                            />
                            <input
                                type="text"
                                placeholder='What are you looking for?'
                                className=' h-10 rounded-lg border border-line caption2 w-full pl-9 pr-4'
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                            />
                        </div>
                        <div className="menu-main h-full xl:w-full flex items-center justify-center max-lg:hidden xl:absolute xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2">
                            <ul className='flex items-center gap-8 h-full'>
                                <li className='h-full relative'>

                                    <div className="sub-menu absolute py-3 px-5 -left-10 w-max grid grid-cols-4 gap-5 bg-white rounded-b-xl">
                                        <ul>

                                            <li>
                                                <Link href="/homepages" className={`text-secondary duration-300 ${pathname === '/homepages/fashion6' ? 'active' : ''}`}>
                                                    Home
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>

                                <li className='h-full'>
                                    <Link href="/shop" className='text-button-uppercase duration-300 h-full flex items-center justify-center'>
                                        Shop
                                    </Link>
                                </li>

                                <li className='h-full'>
                                    <Link href="pages/about" className='text-button-uppercase duration-300 h-full flex items-center justify-center'>
                                        About Us
                                    </Link>
                                </li>

                                <li className='h-full flex items-center justify-center logo'>
                                    <Link href={'/'} className='heading4'>
                                        Aquamarine
                                    </Link>
                                </li>

                                <li className='h-full relative'>
                                    <Link href="/blog" className='text-button-uppercase duration-300 h-full flex items-center justify-center'>
                                        Blog
                                    </Link>
                                </li>

                                <li className='h-full relative'>
                                    <Link href="pages/contact" className='text-button-uppercase duration-300 h-full flex items-center justify-center'>
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="right flex gap-12 z-[1]">
                            <div className="list-action flex items-center gap-4">
                                <div className="user-icon flex items-center justify-center cursor-pointer">
                                    <Icon.User size={24} color='black' onClick={handleLoginPopup} />
                                    <div
                                        className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-small 
                                            ${openLoginPopup ? 'open' : ''}`}
                                    >
                                        {
                                            email === '' &&
                                            <div>
                                                <Link href={'/login'} className="button-main w-full text-center">Login</Link>
                                                <div className="text-secondary text-center mt-3 pb-4">Don’t have an account?
                                                    <Link href={'/register'} className='text-black pl-1 hover:underline'>Register</Link>
                                                </div>
                                            </div>
                                        }
                                        {
                                            email !== '' &&
                                            <div>
                                                <Link href={'/my-account'} className="button-main w-full text-center">My Account</Link>
                                                <button className="button-main w-full flex item-center mt-3 justify-center" onClick={handleSignOut}>
                                                    Sign out
                                                </button>
                                            </div>
                                        }
                                        <div className="bottom pt-4 border-t border-line"></div>
                                        <Link href={'#!'} className='body1 hover:underline'>Support</Link>
                                    </div>
                                </div>
                                <div className="max-md:hidden wishlist-icon flex items-center cursor-pointer" onClick={openModalWishlist}>
                                    <Icon.Heart size={24} color='black' />
                                </div>
                                <div className="cart-icon flex items-center relative cursor-pointer" onClick={openModalCart}>
                                    <Icon.Handbag size={24} color='black' />
                                    <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MenuFour