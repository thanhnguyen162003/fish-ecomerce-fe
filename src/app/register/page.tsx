'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import axios from 'axios'
import { register } from '@/components/api/auth/register'
import { useRouter } from 'next/navigation'

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const Register = () => {

    const [name, setName] = useState('');
    const [username, setUserame] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password != confirmPassword) {
            setError("Password and confirm password is not match")
            return;
        }
        try {
            setIsPending(true)
            const response = await register(email, password, name, phone, username);
            var statusCode = response.request.status;
            if (statusCode != null && statusCode >= 200 && statusCode <= 299) {
                setShowSuccessMessage(true)
                setTimeout(() => {
                    router.push('/login');
                }, 1000);
            }
        } catch (error) {
            console.log(error);
            setError('Something was wrong ok');
        }
    }

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading='Create An Account' />
            </div>
            <div className="register-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col">
                        <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                            {showSuccessMessage && (
                                <div>Register successful! Please login...</div>
                            )}
                            <div className="heading4">Register</div>
                            <form className="md:mt-7 mt-4" onSubmit={handleRegister}>
                                <div className="username mt-5">
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="username" type="text" placeholder="Your Name *"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required />
                                </div>
                                <div className="username mt-5">
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="username" type="text" placeholder="Username *"
                                        value={username}
                                        onChange={e => setUserame(e.target.value)}
                                        required />
                                </div>
                                <div className="username mt-5">
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="username" type="text" placeholder="Phone *"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        required />
                                </div>
                                <div className="email mt-5">
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="email" type="email" placeholder="Email address *"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required />
                                </div>
                                <div className="pass mt-5">
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="password" type="password" placeholder="Password *"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required />
                                </div>
                                <div className="confirm-pass mt-5">
                                    <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="confirmPassword" type="password" placeholder="Confirm Password *" required
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                {error && <div className="error mt-4 text-red-600">{error}</div>}
                                <div className='flex items-center mt-5'>
                                    <div className="block-input">
                                        <input
                                            type="checkbox"
                                            name='remember'
                                            id='remember'
                                        />
                                        <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                    </div>
                                    <label htmlFor='remember' className="pl-2 cursor-pointer text-secondary2">I agree to the
                                        <Link href={'#!'} className='text-black hover:underline pl-1'>Terms of User</Link>
                                    </label>
                                </div>
                                <div className="block-button md:mt-7 mt-4">
                                    <button className="button-main" disabled={isPending}>Register</button>
                                </div>
                            </form>
                        </div>
                        <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                            <div className="text-content">
                                <div className="heading4">Already have an account?</div>
                                <div className="mt-2 text-secondary">Welcome back. Sign in to access your personalized experience, saved preferences, and more. We{String.raw`'re`} thrilled to have you with us again!</div>
                                <div className="block-button md:mt-7 mt-4">
                                    <Link href={'/login'} className="button-main">Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register