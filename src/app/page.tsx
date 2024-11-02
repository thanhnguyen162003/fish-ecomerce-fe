import React from "react";
import SliderSix from "@/components/Slider/SliderSix";
import PopularProduct from "@/components/Home6/PopularProduct";
import Benefit from "@/components/Home1/Benefit";
import { ProductListComponent } from "@/components/ProductList/ProductListComponent";

export default function Home() {
  return (
    <>
      <div id="header" className="relative w-full">
        {/* <BannerTop props="bg-black py-3" textColor='text-white' /> */}
        <SliderSix />
      </div>
      {/* <Collection /> */}
      {/* <TabFeatures data={productData} start={0} limit={8} /> */}
      {/* <OrderHistory />
      <OrderDetail /> */}
      <ProductListComponent />
      <PopularProduct />
      {/* <FlashSale /> */}
      {/* <Testimonial data={testimonialData} limit={5} /> */}
      {/* <BestSaleProduct data={productData} /> */}
      <Benefit props="md:pt-20 pt-10" />
      {/* <Brand /> */}
      {/* <ModalNewsletter /> */}
    </>
  );
}
