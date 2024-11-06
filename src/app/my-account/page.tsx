'use client'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Customer } from '@/type/customer'
import { useRouter } from 'next/navigation'
import { getCustomer, updateCustomer } from '@/components/api/customer/customer.api'
import { ChangePasswordSchema , EditCustomerSchema } from '@/schemas/account'
import { z } from 'zod';
import { changePassword } from '@/components/api/auth/password';
import { AxiosError } from 'axios';

const MyAccount = () => {
    const router = useRouter();
    const [customer, setCustomer] = useState<Customer | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false); // New loading state for updates
    const [customerFormChanged, setCustomerFormChanged] = useState(false);
    const [passwordFormChanged, setPasswordFormChanged] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
            toast.info("Phiên đăng nhập đã hết hạn");
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    };

    useEffect(() => {
        const fetchCustomer = async () => {
            const token = getWithExpiry('jwtToken');

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                setIsLoading(true);
                const data = await getCustomer(token);
                setCustomer(data.data);
            } catch (error) {
                console.error('Error fetching customer data:', error);
            } finally {
                setIsLoading(false);
                setCustomerFormChanged(false);
            }
        };

        fetchCustomer();
    }, [router]);

    const handleLogout = async () => {
        localStorage.removeItem('jwtToken');
        router.push('/login');
    };

    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomer(prevState => prevState ? { ...prevState, [name]: value } : undefined);
        setCustomerFormChanged(true);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'newPassword' || name === 'confirmPassword') {
            setPasswordFormChanged(true);
        }
        if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        } else if (name === 'currentPassword') {
            setOldPassword(value);
        }
    };

    const handleUpdateInformation = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getWithExpiry('jwtToken');

        if (!token) {
            router.push('/login');
            return;
        }

        if (token && customer) {
            setIsUpdating(true); // Set loading state for updates
            try {
                // Validate customer data
                EditCustomerSchema.parse(customer);
                
                // Update customer information
                const response = await updateCustomer(token, customer);
                if (response && response.status === 200) {
                    toast.success("Cập nhật thông tin thành công");
                    setCustomerFormChanged(false);
                }
            } catch (error) {
                if (error instanceof z.ZodError) {
                    console.error(error.errors.map(e => e.message).join(', '));
                    toast.warning(error.errors.map(e => e.message).join(', '), {
                        autoClose: 5000
                    });
                } else {
                    if (error instanceof AxiosError)
                        console.error('Error updating customer information:', error.response?.data.message);
                }
            } finally {
                setIsUpdating(false); // Reset loading state
            }
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordData = {
            oldPassword: oldPassword,
            newPassword: newPassword,
        };

        const token = getWithExpiry('jwtToken');

        if (!token) {
            router.push('/login');
            return;
        }

        if (token) {
            setIsUpdating(true); // Set loading state for updates
            try {
                if (newPassword !== confirmPassword) {
                    toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp", {
                        autoClose: 500
                    });
                    return;
                }

                ChangePasswordSchema.parse(passwordData);

                const response = await changePassword(token, passwordData);
                if (response && response.data.status === 200) {
                    toast.success("Cập nhật mật khẩu thành công");
                    setOldPassword('');
                    setNewPassword('');
                    setPasswordFormChanged(false);
                }
            } catch (error) {
                if (error instanceof z.ZodError) {
                    error.errors.forEach(e => {
                        toast.warning(e.message, {
                            autoClose: 500
                        });
                    });
                }
                if (error instanceof AxiosError) {
                    toast.warning(error.response?.data.message, {
                        autoClose: 500
                    });
                }
            } finally {
                setIsUpdating(false); // Reset loading state
            }
        }
    };

    if (isLoading == true) {
        return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
    </div>;
    }

    if (!customer) {
        return <div>No customer data available</div>;
    }
      return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading='My Account' />
            </div>
            <div className="cart-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main lg:px-[60px] md:px-4 flex gap-y-8 max-md:flex-col w-full">
                        <div className="left xl:w-1/3 md:w-5/12 w-full xl:pr-[40px] lg:pr-[28px] md:pr-[16px]">
                            <div className="user-infor bg-surface md:px-8 px-5 md:py-10 py-6 md:rounded-[20px] rounded-xl">
                                <div className="heading flex flex-col items-center justify-center">
                                    <div className="avatar">
                                        <Image
                                            src={'/images/avatar/1.png'}
                                            width={300}
                                            height={300}
                                            alt='avatar'
                                            className='md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full'
                                        />
                                    </div>
                                    {/* <div className="name heading6 mt-4 text-center">{`${customer.username}`}</div> */}
                                </div>
                                <div className="menu-tab lg:mt-10 mt-6">
                                    <div className="item px-5 py-4 flex items-center gap-3 cursor-pointer">
                                        <Icon.User size={20} weight='bold' />
                                        <div className="heading6">Account Details</div>
                                    </div>
                                    <div className="item px-5 py-4 flex items-center gap-3 cursor-pointer mt-2">
                                        <Icon.Bag size={20} weight='bold' />
                                        <div className="heading6">Your Orders</div>
                                    </div>
                                    {/* <div className="item px-5 py-4 flex items-center gap-3 cursor-pointer mt-2">
                                        <Icon.MapPin size={20} weight='bold' />
                                        <div className="heading6">My Address</div>
                                    </div> */}
                                    <div className="item px-5 py-4 flex items-center gap-3 cursor-pointer mt-2" onClick={handleLogout}>
                                        <Icon.SignOut size={20} weight='bold' />
                                        <div className="heading6">Logout</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right xl:w-2/3 md:w-7/12 w-full xl:pl-[40px] lg:pl-[28px] md:pl-[16px] flex items-center">
                            <div className="text-content w-full">
                                <form onSubmit={handleUpdateInformation}>
                                    <div className="heading5 pb-4">Thông tin</div>
                                    <div className='grid sm:grid-cols-2 gap-4 gap-y-5'>
                                        <div className="first-name sm:col-span-2">
                                            <input 
                                                className="border-line px-4 pt-3 pb-3 w-full rounded-lg" 
                                                name="name" 
                                                type="text" 
                                                value={customer.name} 
                                                placeholder='Full name' 
                                                required 
                                                onChange={handleCustomerChange}
                                            />
                                        </div>
                                        <div className="address sm:col-span-2">
                                            <input 
                                                className="border-line px-4 pt-3 pb-3 w-full rounded-lg" 
                                                name="address" 
                                                type="text" 
                                                value={customer.address} 
                                                placeholder='Address' 
                                                required 
                                                onChange={handleCustomerChange}
                                            />
                                        </div>
                                        <div className="phone">
                                            <input 
                                                className="border-line px-4 pt-3 pb-3 w-full rounded-lg" 
                                                name="phone" 
                                                type="text" 
                                                value={customer.phone} 
                                                placeholder='Phone number' 
                                                required 
                                                onChange={handleCustomerChange}
                                            />
                                        </div>
                                        <div className="birthday">
                                            <input 
                                                className="border-line px-4 pt-3 pb-3 w-full rounded-lg" 
                                                name="birthday" 
                                                type="date" 
                                                value={customer.birthday} 
                                                required 
                                                onChange={handleCustomerChange}
                                            />
                                        </div>
                                        <div className="col-span-full select-block">
                                            <select 
                                                className="border border-line px-4 py-3 w-full rounded-lg" 
                                                name="gender" 
                                                value={customer.gender || ''} 
                                                onChange={handleCustomerChange}
                                            >
                                                <option value="" disabled>Giới tính</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                            </select>
                                            <Icon.CaretDown className='arrow-down' />
                                        </div>
                                    </div>
                                    <div className="block-button lg:mt-10 mt-6">
                                        <button 
                                            type="submit" 
                                            className={`button-main ${!customerFormChanged ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={!customerFormChanged || isUpdating} // Disable if updating
                                        >
                                            {isUpdating ? 'Updating...' : 'Lưu'}
                                        </button>
                                    </div>
                                </form>

                                <form onSubmit={handleUpdatePassword} className="mt-10">
                                    <div className="heading5 pb-4">Mật khẩu</div>
                                    <div className="pass">
                                        <input 
                                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg" 
                                            name="currentPassword" 
                                            type="password" 
                                            placeholder="Current Password *" 
                                            required 
                                            onChange={handlePasswordChange}
                                            value={oldPassword}
                                        />
                                    </div>
                                    <div className="new-pass mt-5">
                                        <input 
                                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg" 
                                            name="newPassword" 
                                            type="password" 
                                            placeholder="New Password *" 
                                            required 
                                            onChange={handlePasswordChange} 
                                            value={newPassword}
                                        />
                                    </div>
                                    <div className="confirm-pass mt-5">
                                        <input 
                                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg" 
                                            name="confirmPassword" 
                                            type="password" 
                                            placeholder="Confirm Password *" 
                                            required 
                                            onChange={handlePasswordChange} 
                                            value={confirmPassword}
                                        />
                                    </div>
                                    <div className="block-button lg:mt-10 mt-6">
                                        <button 
                                            type="submit" 
                                            className={`button-main ${!passwordFormChanged ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                            disabled={!passwordFormChanged || isUpdating} // Disable if updating
                                        >
                                            {isUpdating ? 'Updating...' : 'Đổi mật khẩu'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyAccount