'use client'

import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/effect-fade';


const SliderSix = () => {
    return (
        <>
            <div className="slider-block style-one bg-[#e6edff] xl:h-[860px] lg:h-[800px] md:h-[580px] sm:h-[500px] h-[350px] max-[420px]:h-[320px] w-full">
                <div className="slider-main h-full w-full">
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Autoplay]}
                        className='h-full relative'
                        autoplay={{
                            delay: 4000,
                        }}
                    >
                        <SwiperSlide>
                            <div className="slider-item h-full w-full relative overflow-hidden">
                                <div className="container w-full h-full flex items-center relative">
                                    <div className="text-content basis-1/2">
                                        <div className="text-sub-display">Các loại bể cá</div>
                                        <div className="text-display md:mt-5 mt-2">Bể cá</div>
                                        <Link href='/shop' className="button-main md:mt-8 mt-3">Khám phá ngay</Link>
                                    </div>
                                    <div className="sub-img absolute sm:w-[55%] w-3/5 2xl:-right-[60px] -right-[16px] bottom-0">
                                        <Image
                                            src={'/images/slider/bg6-1.png'}
                                            width={2000}
                                            height={1936}
                                            alt='bg6-1'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="slider-item h-full w-full relative overflow-hidden">
                                <div className="container w-full h-full flex items-center relative">
                                    <div className="text-content basis-1/2">
                                        <div className="text-sub-display">Các loại cá</div>
                                        <div className="text-display md:mt-5 mt-2">Cá koi</div>
                                        <Link href='/shop' className="button-main md:mt-8 mt-3">Khám phá ngay</Link>
                                    </div>
                                    <div className="sub-img absolute w-1/2 right-[0] sm:-bottom-7 bottom-0">
                                        <Image
                                            src={'/images/slider/bg6-2.png'}
                                            width={2000}
                                            height={1936}
                                            alt='bg6-2'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="slider-item h-full w-full relative overflow-hidden">
                                <div className="container w-full h-full flex items-center relative">
                                    <div className="text-content basis-1/2">
                                        <div className="text-sub-display">Các loại phụ kiện cho cá</div>
                                        <div className="text-display md:mt-5 mt-2">Phụ kiện</div>
                                        <Link href='/shop' className="button-main md:mt-8 mt-3">Khám phá ngay</Link>
                                    </div>
                                    <div className="sub-img absolute sm:w-3/5 w-2/3 2xl:-right-[60px] -right-[36px] bottom-0 sm:-bottom-[30px]">
                                        <Image
                                            src={'/images/slider/bg6-2.png'}
                                            width={2000}
                                            height={2000}
                                            alt='bg6-3'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default SliderSix