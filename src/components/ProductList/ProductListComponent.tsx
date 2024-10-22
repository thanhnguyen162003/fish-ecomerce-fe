"use client";
import { ProductType } from "@/type/ProductType";
import { useEffect, useState } from "react";
import handleGetFishProduct from "../api/products/fishproduct";
import { motion } from "framer-motion";
import Product from "@/components/Product/NewProduct";
import Image from "next/image";
import handleGetTankProduct from "../api/products/tankproduct";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const ProductListComponent = () => {
  const [activeTab, setActiveTab] = useState<string>("Cá Cảnh");
  const [fishList, setFishList] = useState<ProductType[]>([]);
  const [tankList, setTankList] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const handleTabClick = (item: string) => {
    setActiveTab(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fishResponse = await handleGetFishProduct("", "", "", "", 8, 1);
        setFishList(fishResponse?.data);
        const tankResponse = await handleGetTankProduct("", "", "", "", 8, 1);
        setTankList(tankResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const productList = activeTab === "Cá Cảnh" ? fishList : tankList;

  return (
    <>
      <div className="tab-features-block md:pt-20 pt-10">
        <div className="container">
          <div className="heading flex flex-col items-center text-center">
            <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl">
              {["Cá Cảnh", "Hồ Cá"].map((item, index) => (
                <div
                  key={index}
                  className={`tab-item relative text-secondary text-4xl font-semibold py-2 px-5 cursor-pointer duration-500 hover:text-black ${
                    activeTab === item ? "active" : ""
                  }`}
                  onClick={() => handleTabClick(item)}
                >
                  {activeTab === item && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-2xl bg-white"
                    ></motion.div>
                  )}
                  <span className="relative text-4xl font-semibold z-[1]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="w-full flex justify-center my-5 h-[500px] items-center">
              <AiOutlineLoading3Quarters className="animate-spin h-[60px] w-[60px]" />
            </div>
          ) : !productList || productList.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Image
                alt="empty"
                height={500}
                width={500}
                src={
                  "https://component.gallery/static/8d36eaa25b6dcb026685101ebc379022/Empty%20state%20icon..svg"
                }
              />
              <h2 className="mt-4 text-center text-4xl opacity-50">
                Upcoming product ...
              </h2>
            </div>
          ) : (
            <div className="list-product hide-product-sold grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
              {productList.map((item) =>
                item.id === "no-data" ? (
                  <div key={item.id} className="no-data-product">
                    No products match the selected criteria.
                  </div>
                ) : (
                  <Product key={item.id} data={item} type="grid" />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
