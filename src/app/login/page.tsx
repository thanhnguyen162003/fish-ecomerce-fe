'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import login from '@/components/api/auth/login';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false)

    function setItemWithExpiry(key:string, value:any) {
        const now = new Date();
        
        // Create an object to store the value and the expiration time (15 minutes from now)
        const item = {
            value: value,
            expiry: now.getTime() + 2 * 60 * 60 * 1000, // 15 minutes in milliseconds
        };
        
        // Save the item to localStorage as a string
        localStorage.setItem(key, JSON.stringify(item));
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsPending(true)
            const response = await login(email, password);
            var statusCode = response.status;
            if (statusCode != null && statusCode >= 200 && statusCode <= 299) {
                setItemWithExpiry('jwtToken', response.data.token)
                window.location.href = '/';
            }
            else if (statusCode === 400) {
                let res = response.request.response.toLocaleString()
                toast.warning(res.substring(1, res.length-1))
            }
        } catch (err) {
            console.log(err);
            toast.warning('Invalid username or password');
        } finally {
            setIsPending(false)
        }
    };

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading='Đăng nhập' />
            </div>
            <div className="login-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col">
                        <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                            <div className="heading4">Đăng nhập</div>
                            <form className="md:mt-7 mt-4" onSubmit={handleLogin}>
                                <div className="email ">
                                    <input
                                        className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                        id="username"
                                        type="text"
                                        placeholder="Tên đăng nhập ..."
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="pass mt-5">
                                    <input
                                        className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                        id="password"
                                        type="password"
                                        placeholder="Mật khẩu ..."
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {/* {error && <div className="error mt-4 text-red-600">{error}</div>} */}
                                {/* <div className="flex items-center justify-between mt-5">
                                    <div className='flex items-center'>
                                        <div className="block-input">
                                            <input
                                                type="checkbox"
                                                name='remember'
                                                id='remember'
                                            />
                                            <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                        </div>
                                        <label htmlFor='remember' className="pl-2 cursor-pointer">Remember me</label>
                                    </div>
                                    <Link href={'/forgot-password'} className='font-semibold hover:underline'>Forgot Your Password?</Link>
                                </div> */}
                                {!isPending ? (
                                    <div className="block-button md:mt-7 mt-4">
                                        <button className="button-main" disabled={isPending}>Đăng nhập</button>
                                    </div>
                                ) : (
                                    <div className="w-full flex justify-center md:mt-7 mt-4 items-center">
                                        <AiOutlineLoading3Quarters className="animate-spin h-[52px] w-[52px]" />
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                            <div className="text-content">
                                <div className="heading4">Khách Hàng Mới</div>
                                <div className="mt-2 text-secondary">Hãy trở thành một phần của gia đình khách hàng mới đang phát triển của chúng tôi! Tham gia ngay hôm nay và mở khóa một thế giới lợi ích độc quyền, ưu đãi và trải nghiệm cá nhân hóa.</div>
                                <div className="block-button md:mt-7 mt-4">
                                    <Link href={'/register'} className="button-main">Đăng kí</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;