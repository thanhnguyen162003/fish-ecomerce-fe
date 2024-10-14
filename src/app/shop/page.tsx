"use client";

import React, { useEffect, useState } from "react";
import handleGetFishProduct from "@/components/api/products/fishproduct";
import { ProductType } from "@/type/ProductType";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Product from "@/components/Product/NewProduct";
import HandlePagination from "@/components/Other/HandlePagination";
import Slider from "rc-slider";
import hanldeGetBreed from "@/components/api/products/breed";
import { CategoryType } from "@/type/CategoryType";
import { BreedType } from "@/type/BreedType";
import handleGetCategory from "@/components/api/products/category";
import handleGetTankProduct from "@/components/api/products/tankproduct";
import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Category from "@/components/Organic/Category";

export default function BreadcrumbImg() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [category, setCategory] = useState<CategoryType | null>();
  const [breeds, setBreeds] = useState<BreedType[]>([]);
  const [breed, setBreed] = useState<BreedType | null>();
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(12);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [search, setSearch] = useState<string | null>();
  const [sort, setSort] = useState<string | null>();
  const [direction, setDirection] = useState<string | null>();
  const [pageCount, setPageCount] = useState(1);
  const [type, setType] = useState<string | null>("fish");
  const [loading, setLoading] = useState<boolean>(true);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100_000_000,
  });
  const apiUrl = "https://kingfish.azurewebsites.net/api/v1";
  const router = useRouter()
  useEffect(() => {
    async function getCategories() {
      try {
        const response = await handleGetCategory();
        var categoriesRes = response?.data as CategoryType[];
        console.log("categories: ", categoriesRes);
        setCategories(categoriesRes);
      } catch (error) {
        console.log(error);
      }
    }
    async function getBreedes() {
      try {
        const response = await hanldeGetBreed();
        var breedsRes = response?.data as BreedType[];
        console.log("breeds: ", breedsRes);
        setBreeds(breedsRes);
      } catch (error) {
        console.log(error);
      }
    }
    if (type === "tank") {
      getCategories();
    } else {
      getBreedes();
    }
  }, [type]);

  async function getFishProducts() {
    try {
      const response = await axios.get(`${apiUrl}/product/fishs`, {
        params: {
          PageSize: pageSize,
          PageNumber: pageNumber,
          ...(search && { Search: search }),
          ...(breed && { Breed: breed }),
          ...(sort && { Sort: sort }),
          ...(direction && { Direction: direction }),
        },
      });
      console.log("response", response);
      console.log("data", response.data);
      console.log("fishes response", response.data as ProductType[]);
      setProducts(response.data as ProductType[]);
      getTotalCount(response);
    } catch (error) {
      console.error("Error fetching fish products:", error);
    }
  }

  async function getTankProducts() {
    try {
      const response = await axios.get(`${apiUrl}/product/tanks`, {
        params: {
          PageSize: pageSize,
          PageNumber: pageNumber,
          ...(search && { Search: search }),
          ...(category && { Category: category }),
          ...(sort && { Sort: sort }),
          ...(direction && { Direction: direction }),
        },
      });
      console.log("response", response);
      console.log("data", response.data);
      console.log("tanks response", response.data as ProductType[]);
      setProducts(response.data as ProductType[]);
      getTotalCount(response);
      return response;
    } catch (error) {
      console.error("Error fetching tank products:", error);
    }
  }

  const getTotalCount = (response: any) => {
    const paginationHeader = response?.headers["x-pagination"];
    if (paginationHeader) {
      const paginationData = JSON.parse(paginationHeader);
      const totalCount = paginationData.TotalCount;
      setTotalProducts(totalCount);
      console.log("TotalCount:", totalCount);
      console.log("totalProducts", totalProducts);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        if (type === "tank") {
          console.log("work here");

          await getTankProducts();
        }
        if (type === "fish") {
          console.log("work here too");
          await getFishProducts();
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchData();
  }, [category, breed, pageNumber, pageSize, sort, direction, search, type]);

  const handleSortChange = (option: string) => {
    console.log(option);

    setSort(option);
    setPageNumber(0);
  };

  const handleSearch = (key: string) => {
    setSearch(key);
    setPageNumber(0);
  };

  const handleChangePage = (opt: number) => {
    setPageNumber(opt);
  };

  const handleChangeType = (opt: string) => {
    setPageNumber(0);
    setType(opt);
  };

  const handleDirection = (opt: string) => {
    setDirection(opt);
    setPageNumber(0);
  };

  const handlePageSize = (op: string) => {
    const pageSizeNumber = parseInt(op, 10);
    setPageSize(pageSizeNumber);
    setPageNumber(0);
  };

  const handleChangeCategory = (opt: CategoryType) => {
    setCategory(opt);
    setPageNumber(0);
  };

  const handleChangeBreed = (opt: BreedType) => {
    setBreed(opt);
    setPageNumber(0);
  };

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setPriceRange({ min: values[0], max: values[1] });
      setPageNumber(0);
    }
  };

  const handleClearAll = () => {
    setBreed(null);
    setDirection(null);
    setPageNumber(0);
    setPageSize(12);
    setSearch(null);
    setSort(null);
  };

  const handleDetailProduct = (productId: string) => {
    // redirect to shop with category selected
    router.push(`/product/default?id=${productId}`);
  };

  return (
    <>
      {loading && (
        <div className="breadcrumb-block style-img">
          <div className="breadcrumb-main overflow-hidden">
            <div className="container lg:pt-[100px] relative">
              <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                <div className="text-content">
                  <div className="heading2 text-center">Đang tải...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          <div className="breadcrumb-block style-img">
            <div className="breadcrumb-main overflow-hidden">
              <div className="container lg:pt-[100px] relative">
                <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                  <div className="text-content">
                    <div className="heading2 text-center">
                      {type == null ? "Shop" : type}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shop-product breadcrumb2 lg:py-20 md:py-14 py-10">
            <div className="container">
              <div className="flex max-md:flex-wrap gap-y-8">
                <div className="list-product-block lg:w-3/4 md:w-2/3 w-full md:pr-3">
                  <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
                    <div className="left flex has-line items-center flex-wrap gap-5">
                      <label
                        htmlFor="select-filter"
                        className="caption1 capitalize"
                      >
                        Số sản phẩm trong một trang
                      </label>
                      <div className="select-block relative">
                        <select
                          id="select-filter"
                          name="select-filter"
                          className="caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-gray-300"
                          onChange={(e) => {
                            handlePageSize(e.target.value);
                          }}
                          defaultValue={"9"}
                        >
                          {[3, 6, 9, 12, 24, 48].map((i, index) => (
                            <option key={index} value={i}>{i}</option>
                          ))}
                        </select>
                        <Icon.CaretDown
                          size={12}
                          className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                        />
                      </div>
                    </div>

                    <div className="right flex items-center gap-3">
                      <label
                        htmlFor="select-filter"
                        className="caption1 capitalize"
                      >
                        Sắp xếp theo
                      </label>
                      <div className="select-block relative">
                        <select
                          id="select-filter"
                          name="select-filter"
                          className="caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-gray-300"
                          onChange={(e) => {
                            handleSortChange(e.target.value);
                          }}
                          defaultValue={"Sorting"}
                        >
                          <option value="0" disabled>
                            Theo
                          </option>
                          <option value="price">Giá</option>
                          <option value="original_price">Giá gốc</option>
                        </select>
                        <Icon.CaretDown
                          size={12}
                          className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                        />
                      </div>
                      <div className="select-block relative">
                        <select
                          id="select-filter"
                          name="select-filter"
                          className="caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-gray-300"
                          onChange={(e) => {
                            handleDirection(e.target.value);
                          }}
                          defaultValue={"Sorting"}
                        >
                          <option value="" disabled>
                            Chiều
                          </option>
                          <option value="asc">Tăng dần</option>
                          <option value="desc">Giảm dần</option>
                        </select>
                        <Icon.CaretDown
                          size={12}
                          className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="list-filtered flex items-center flex-wrap gap-3 mt-4">
                    <div className="total-product">
                      {totalProducts}
                      <span className="text-secondary pl-1">
                        Products Found
                      </span>
                    </div>

                    {(breed || category) && (
                      <>
                        <div className="list flex items-center gap-3">
                          <div className="w-px h-4 bg-line"></div>
                          {type === "fish" && breed && (
                            <div
                              className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize"
                              onClick={() => {
                                setBreed(null);
                              }}
                            >
                              <Icon.X className="cursor-pointer" />
                              <span>{breed.name}</span>
                            </div>
                          )}
                          {type === "tank" && category && (
                            <div
                              className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize"
                              onClick={() => {
                                setBreed(null);
                              }}
                            >
                              <Icon.X className="cursor-pointer" />
                              <span>{category.tank_type}</span>
                            </div>
                          )}
                        </div>
                        <div
                          className="clear-btn flex items-center px-2 py-1 gap-1 rounded-full border border-red cursor-pointer"
                          onClick={handleClearAll}
                        >
                          <Icon.X
                            color="rgb(219, 68, 68)"
                            className="cursor-pointer"
                          />
                          <span className="text-button-uppercase text-red">
                            Clear All
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {breed && <div>{breed.description}</div>}

                  <div className="list-product hide-product-sold grid lg:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7">
                {products.map((item) =>
                  item.id === "no-data" ? (
                    <div key={item.id} className="no-data-product">
                      No products match the selected criteria.
                    </div>
                  ) : (
                    <Product key={item.id} data={item} type="grid" />
                  )
                )}
              </div>

                  {pageCount > 1 && (
                    <div className="list-pagination flex items-center md:mt-10 mt-7">
                      <HandlePagination
                        pageCount={pageCount}
                        onPageChange={handleChangePage}
                      />
                    </div>
                  )}
                </div>

                <div className="sidebar lg:w-1/4 md:w-1/3 w-full md:pl-12">
                  <div className="filter-type pb-8 border-b border-line">
                    <div className="heading6">Products Type</div>
                    <div className="list-type mt-4">
                      <div
                        className={`item flex items-center justify-between cursor-pointer active}`}
                        onClick={() => handleChangeType("fish")}
                      >
                        <div className="text-secondary has-line-before hover:text-black capitalize">
                          Cá koi
                        </div>
                      </div>
                    </div>
                    <div className="list-type mt-4">
                      <div
                        className={`item flex items-center justify-between cursor-pointer active}`}
                        onClick={() => handleChangeType("tank")}
                      >
                        <div className="text-secondary has-line-before hover:text-black capitalize">
                          Hồ cá
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="filter-price pb-8 border-b border-line mt-8">
                    <div className="heading6">Price Range</div>
                    <Slider
                      range
                      defaultValue={[0, 100_000_000]}
                      step={500_000}
                      min={0}
                      max={100_000_000}
                      onChange={handlePriceChange}
                      className="mt-5"
                    />
                    <div className="price-block flex items-center justify-between flex-wrap mt-4">
                      <div className="min flex items-center gap-1">
                        <div>Min price:</div>
                        <div className="price-min">
                          <span>{priceRange.min.toLocaleString("vi-VN")}</span>{" "}
                          VND
                        </div>
                      </div>
                      <div className="min flex items-center gap-1">
                        <div>Max price:</div>
                        <div className="price-max">
                          <span>{priceRange.max.toLocaleString("vi-VN")}</span>{" "}
                          VND
                        </div>
                      </div>
                    </div>
                  </div>

                  {type === "tank" && (
                    <div className="filter-color pb-8 border-b border-line mt-8">
                      <div className="heading6">Category</div>
                      <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                        {categories !== null &&
                          categories.map((item, index) => (
                            <div
                              key={index}
                              className="brand-item flex items-center justify-between"
                            >
                              <div className="left flex items-center cursor-pointer">
                                <div className="block-input">
                                  <input
                                    type="checkbox"
                                    name={item.tank_type}
                                    id={item.id}
                                    checked={category === item}
                                    onChange={() => handleChangeCategory(item)}
                                  />
                                  <Icon.CheckSquare
                                    size={20}
                                    weight="fill"
                                    className="icon-checkbox"
                                  />
                                </div>
                                <label
                                  htmlFor={item.id}
                                  className="brand-name capitalize pl-2 cursor-pointer"
                                >
                                  {item.tank_type} - {item.level}
                                </label>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {type === "fish" && (
                    <div className="filter-color pb-8 border-b border-gray-300 mt-8">
                      <div className="heading6">Breed</div>
                      <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                        {breeds &&
                          breeds.map((item, index) => (
                            <div
                              key={index}
                              className="brand-item flex items-center justify-between"
                            >
                              <div className="left flex items-center cursor-pointer">
                                <div className="block-input">
                                  <input
                                    type="checkbox"
                                    name={item.name}
                                    id={item.id}
                                    checked={breed === item}
                                    onChange={() => handleChangeBreed(item)}
                                  />
                                  <Icon.CheckSquare
                                    size={20}
                                    weight="fill"
                                    className="icon-checkbox"
                                  />
                                </div>
                                <label
                                  htmlFor={item.id}
                                  className="brand-name capitalize pl-2 cursor-pointer"
                                >
                                  {item.name}
                                </label>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
