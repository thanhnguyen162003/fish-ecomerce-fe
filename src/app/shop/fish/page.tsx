'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopBreadCrumbImg from '@/components/Shop/ShopBreadCrumbImg';
import productData from '@/data/Product.json'
import Footer from '@/components/Footer/Footer'
import ShopBreadCrumb2 from '@/components/Shop/ShopBreadCrumb2';
import handleGetFishProduct from '@/components/api/products';
import { ProductType } from '@/type/ProductType';

export default function BreadcrumbImg() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')

    const [fishProduct, setFishProduct] = useState<ProductType[]>([])
    const [totalCount, setTotalCount] = useState('')
    const [pageSize, setPageSize] = useState(12)
    const [pageNumber, setPageNumber] = useState(1)

    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });

    const offset = pageSize * pageNumber

    useEffect(() => {
        async function fetchData() {
            try {
                const products = await handleGetFishProduct(12, 1);
                console.log('handleGetFishProduct: ', products as ProductType[]);

                setFishProduct(products as ProductType[]);
            } catch (error) {
                console.error('Error fetching fish products:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <div id="header" className='relative w-full'>
            </div>
            <ShopBreadCrumb2 data={productData} productPerPage={12} dataType={type} />
        </>
    )
}
