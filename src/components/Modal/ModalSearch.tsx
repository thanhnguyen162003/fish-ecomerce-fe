"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import productData from "@/data/Product.json";
import Product from "../Product/Product";
import { useModalSearchContext } from "@/context/ModalSearchContext";
import axios from "axios";
import { ProductType } from "@/type/ProductType";
import SearchProduct from "../Product/SearchProduct";

interface List {
  list: ProductType[];
  hasMore: boolean;
}

interface Data {
  fish: List;
  tank: List;
}

const ModalSearch = () => {
  const { isModalOpen, closeModalSearch } = useModalSearchContext();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Data>();

  useEffect(() => {
    handleSearchAPI();
  }, [search]);
  const apiUrl = "https://kingfish.azurewebsites.net/api/v1";
  const handleSearchAPI = async () => {
    try {
      const response = await axios.get(`${apiUrl}/search`, {
        params: {
          searchTerm: search,
        },
      });
      setData(response.data.data as Data);
      return response;
    } catch (error) {
      console.error("Error fetching tank products:", error);
    }
  };

  const router = useRouter();
  const handleHasMore = (value: string, type: string) => {
    router.push(`/shop?query=${value}&type=${type}`);
    router.refresh()
    closeModalSearch();
    setSearchKeyword("");
  };

  return (
    <>
      <div className={`modal-search-block`} onClick={closeModalSearch}>
        <div
          className={`modal-search-main md:p-10 p-6 rounded-[32px] ${
            isModalOpen ? "open" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="form-search relative">
            <Icon.MagnifyingGlass
              className="absolute heading5 right-6 top-1/2 -translate-y-1/2 cursor-pointer"
              // onClick={() => {
              //   handleSearch(searchKeyword);
              // }}
            />
            <input
              type="text"
              placeholder="Searching..."
              className="text-button-lg h-14 rounded-2xl border border-line w-full pl-6 pr-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {data?.fish?.list && data?.fish.list.length != 0 && (
            <div className="list-recent mt-8">
              <div className="heading6">Cá cảnh</div>
              <div className="list-product pb-5 hide-product-sold grid xl:grid-cols-4 sm:grid-cols-2 gap-7 mt-4">
                {data?.fish.list.slice(0, 4).map((product) => (
                  <SearchProduct key={product.id} data={product} type="grid" />
                ))}
              </div>
              {data.fish.hasMore && <button onClick={() => handleHasMore(search, "Cá Cảnh")}>Xem thêm</button>}
            </div>
          )}

          {data?.tank?.list && data?.tank.list.length != 0 && (
            <div className="list-recent mt-8">
              <div className="heading6">Hồ cá</div>
              <div className="list-product pb-5 hide-product-sold grid xl:grid-cols-4 sm:grid-cols-2 gap-7 mt-4">
                {data?.tank.list.slice(0, 4).map((product) => (
                  <SearchProduct key={product.id} data={product} type="grid" />
                ))}
              </div>
              {data.tank.hasMore && <button onClick={() => handleHasMore(search, "Hồ Cá")}>Xem thêm</button>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalSearch;
