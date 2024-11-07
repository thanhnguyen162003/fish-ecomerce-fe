'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import FixedPrice from '@/components/Product/Detail/FixedPrice';
import Footer from '@/components/Footer/Footer'
import productData from '@/data/Product.json'
import { ProductType } from '@/type/ProductType';
import axios from 'axios';
import { log } from 'console';

const apiUrl = "https://kingfish.azurewebsites.net/api/v1";
const ProductFixedPrice = () => {
    const searchParams = useSearchParams()
    let productId = searchParams.get('id')
    let type = searchParams.get('type')
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<ProductType>();

    useEffect(() => {
      const getProducts = async () => {
        setLoading(true)
        try {
          const response = await axios.get(`${apiUrl}/product/${type}/${productId}`);
          console.log("response", response);
          console.log("data", response.data.data);
          setProduct(response.data.data as ProductType);
        } catch (error) {
          console.error("Error fetching fish products:", error);
        } finally{
          setLoading(false)
        }
      }
      getProducts()
      console.log("product", product?.description);
    }, [product?.description, productId, type])
    return (
        <>
            <div id="header" className='relative w-full'>
                <BreadcrumbProduct data={product} productPage='details' productId={productId} />
            </div>
            <FixedPrice data={product} productId={productId} />
        </>
    )
}

export default ProductFixedPrice