"use client";

import React, { useEffect, useState } from "react";
import handleGetFishProduct from "@/components/api/products/fishproduct";
import { ProductType } from "@/type/ProductType";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Product from "@/components/Product/NewProduct";
import HandlePagination from "@/components/Other/HandlePagination";
import Slider from "rc-slider";
import hanldeGetBreed from "@/components/api/products/breed";
import { CategoryType, TankCategoryType } from "@/type/CategoryType";
import { BreedType } from "@/type/BreedType";
import handleGetTankProduct from "@/components/api/products/tankproduct";
import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Category from "@/components/Organic/Category";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {handleGetTankCategory, handleGetCategory} from "@/components/api/products/category";
import { string } from "zod";

export default function BreadcrumbImg() {
  enum ProductTypeList {
    HoCa = "Hồ Cá",
    CaCanh = "Cá Cảnh",
    CayThuySinh = "Cây Thủy Sinh",
    PhuKien = "Phụ Kiện",
  }
  const productTypes = Object.values(ProductTypeList);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [tankCategories, setTankCategories] = useState<TankCategoryType[]>([]);
  const [tankCategory, setTankCategory] = useState<TankCategoryType | null>();
  const [breeds, setBreeds] = useState<BreedType[]>([]);
  const [breed, setBreed] = useState<BreedType | null>();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [category, setCategory] = useState<CategoryType | null>();
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const pageSize = 9;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [search, setSearch] = useState<string | null>();
  const [sort, setSort] = useState<string | null>();
  const [direction, setDirection] = useState<string | null>();
  const [pageCount, setPageCount] = useState(1);
  const [type, setType] = useState<string | null>(ProductTypeList.CaCanh);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100_000_000,
  });
  const apiUrl = "https://kingfish.azurewebsites.net/api/v1";
  const router = useRouter();

  useEffect(() => {
    async function getTankCategories() {
      try {
        const response = await handleGetTankCategory();
        var categoriesRes = response?.data as TankCategoryType[];
        setTankCategories(categoriesRes);
      } catch (error) {
        console.log(error);
      }
    }
    async function getBreedes() {
      try {
        const response = await hanldeGetBreed();
        var breedsRes = response?.data as BreedType[];
        setBreeds(breedsRes);
      } catch (error) {
        console.log(error);
      }
    }
    async function getCategories(type : number) {
      try {
        const response = await handleGetCategory(type);
        var catesRes = response?.data as CategoryType[];
        setCategories(catesRes);
      } catch (error) {
        console.log(error);
      }
    }
    if (type === ProductTypeList.HoCa) {
      getTankCategories();
    } else if(type === ProductTypeList.CaCanh) {
      getBreedes();
    } else {
      getCategories(type === ProductTypeList.CayThuySinh ? 0 : 1)
    }
  }, [type]);

  async function getFishProducts() {
    try {
      console.log("breed", breed);
      const response = await axios.get(`${apiUrl}/product/fishs`, {
        params: {
          PageSize: pageSize,
          PageNumber: pageNumber,
          ...(search && { Search: search }),
          ...(breed && { Breed: breed.name }),
          ...(sort && { Sort: sort }),
          ...(direction && { Direction: direction }),
          ...(priceRange && { PriceFrom: priceRange.min }),
          ...(priceRange && { PriceTo: priceRange.max }),
        },
      });
      setProducts(response.data as ProductType[]);
      getTotalCount(response);
    } catch (error) {
      console.error("Error fetching fish products:", error);
    }
  }
  useEffect(() => {
    setPageCount(Math.ceil(totalProducts / pageSize));
  }, [totalProducts, pageSize]);

  async function getTankProducts() {
    try {
      const response = await axios.get(`${apiUrl}/product/tanks`, {
        params: {
          PageSize: pageSize,
          PageNumber: pageNumber,
          ...(search && { Search: search }),
          ...(tankCategory && { Category: tankCategory.tank_type }),
          ...(sort && { Sort: sort }),
          ...(direction && { Direction: direction }),
          ...(priceRange && { PriceFrom: priceRange.min }),
          ...(priceRange && { PriceTo: priceRange.max }),
        },
      });
      setProducts(response.data as ProductType[]);
      getTotalCount(response);
      return response;
    } catch (error) {
      console.error("Error fetching tank products:", error);
    }
  }

  async function getPlantProducts() {
    try {
      const response = await axios.get(`${apiUrl}/product/plant`, {
        params: {
          PageSize: pageSize,
          PageNumber: pageNumber,
          ...(search && { Search: search }),
          ...(category && { Category: category.name }),
          ...(sort && { Sort: sort }),
          ...(direction && { Direction: direction }),
          ...(priceRange && { PriceFrom: priceRange.min }),
          ...(priceRange && { PriceTo: priceRange.max }),
        },
      });
      setProducts(response.data as ProductType[]);
      getTotalCount(response);
      return response;
    } catch (error) {
      console.error("Error fetching tank products:", error);
    }
  }

  async function getToolProducts() {
    try {
      const response = await axios.get(`${apiUrl}/product/tool`, {
        params: {
          PageSize: pageSize,
          PageNumber: pageNumber,
          ...(search && { Search: search }),
          ...(category && { Category: category.name }),
          ...(sort && { Sort: sort }),
          ...(direction && { Direction: direction }),
          ...(priceRange && { PriceFrom: priceRange.min }),
          ...(priceRange && { PriceTo: priceRange.max }),
        },
      });
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
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        if (type === ProductTypeList.HoCa) {
          await getTankProducts();
        }
        if (type === ProductTypeList.CaCanh) {
          await getFishProducts();
        }
        if (type === ProductTypeList.CayThuySinh){
          await getPlantProducts();
        }
        if(type === ProductTypeList.PhuKien){
          await getToolProducts();
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchData();
  }, [
    category,
    tankCategory,
    breed,
    pageNumber,
    pageSize,
    sort,
    direction,
    search,
    type,
    priceRange,
  ]);

  const handleSortChange = (option: string) => {
    setSort(option);
    setPageNumber(1);
  };

  const handleSearch = (key: string) => {
    setSearch(key);
    setPageNumber(1);
  };

  const handleChangePage = (opt: number) => {
    setPageNumber(opt + 1);
  };

  const handleChangeType = (opt: string) => {
    setPageNumber(1);
    setType(opt);
    handleClearAll();
  };

  const handleDirection = (opt: string) => {
    setDirection(opt);
    setPageNumber(1);
  };

  const handleChangeTankCategory = (opt: TankCategoryType) => {
    setTankCategory(opt);
    setPageNumber(1);
  };

  const handleChangeCategory = (opt: CategoryType) => {
    setCategory(opt);
    setPageNumber(1);
  };

  const handleChangeBreed = (opt: BreedType) => {
    setBreed(opt);
    setPageNumber(1);
  };

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setPriceRange({ min: values[0], max: values[1] });
      setPageNumber(1);
    }
  };

  const handleClearAll = () => {
    setBreed(null);
    setCategory(null);
    setTankCategory(null);
    setDirection(null);
    setPageNumber(1);
    setSearch(null);
    setSort(null);
  };

  const handleDetailProduct = (productId: string) => {
    // redirect to shop with category selected
    router.push(`/product/default?id=${productId}`);
  };

  return (
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
                {/* <div className="left flex has-line items-center flex-wrap gap-5">
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
                        <option key={index} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                    <Icon.CaretDown
                      size={12}
                      className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                    />
                  </div>
                </div> */}

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
                      <option value="date">Ngày</option>
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
                {!loading && (
                  <div className="total-product">
                    {totalProducts}
                    <span className="text-secondary pl-1">Kết quả</span>
                  </div>
                )}

                {(breed || tankCategory || category) && (
                  <>
                    <div className="list flex items-center gap-3">
                      <div className="w-px h-4 bg-line"></div>
                      {type === "Cá Cảnh" && breed && (
                        <div
                          className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize"
                          onClick={() => {
                            setBreed(null);
                          }}
                        >
                          {/* <Icon.X className="cursor-pointer" /> */}
                          <span>{breed.name}</span>
                        </div>
                      )}
                      {type === "Hồ Cá" && tankCategory && (
                        <div
                          className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize"
                          onClick={() => {
                            setBreed(null);
                          }}
                        >
                          {/* <Icon.X className="cursor-pointer" /> */}
                          <span>{tankCategory.tank_type}</span>
                        </div>
                      )}
                      {type === ProductTypeList.CayThuySinh && category && (
                        <div
                          className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize"
                          onClick={() => {
                            setCategory(null);
                          }}
                        >
                          {/* <Icon.X className="cursor-pointer" /> */}
                          <span>{category.name}</span>
                        </div>
                      )}
                      {type === ProductTypeList.PhuKien && category && (
                        <div
                          className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize"
                          onClick={() => {
                            setCategory(null);
                          }}
                        >
                          {/* <Icon.X className="cursor-pointer" /> */}
                          <span>{category.name}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {breed && <div className="mt-4">{breed.description}</div>}

              {loading ? (
                <div className="w-full flex justify-center my-5 h-[500px] items-center">
                  <AiOutlineLoading3Quarters className="animate-spin h-[60px] w-[60px]" />
                </div>
              ) : (
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
              )}

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
              <div className="filter-type pb-8 border-line">
                <div className="heading6">Tìm kiếm sản phẩm</div>
                <div className="form-search relative mt-4">
                  <Icon.MagnifyingGlass
                    className="absolute heading5 right-6 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      handleSearch(search as string);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm ..."
                    className="text-button-lg h-14 rounded-2xl border border-line w-full pl-6 pr-12"
                    value={search as string}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSearch(search as string)
                    }
                  />
                </div>
              </div>
              <div className="filter-type pb-8 border-b border-line">
                <div className="heading6">Phân loại sản phẩm</div>
                {/* <div className="list-type mt-4">
                  <div
                    className={`item flex items-center justify-between cursor-pointer active}`}
                    onClick={() => handleChangeType("Cá Cảnh")}
                  >
                    <div className="text-secondary has-line-before hover:text-black capitalize">
                      Cá cảnh
                    </div>
                  </div>
                </div>
                <div className="list-type mt-4">
                  <div
                    className={`item flex items-center justify-between cursor-pointer active}`}
                    onClick={() => handleChangeType("Hồ Cá")}
                  >
                    <div className="text-secondary has-line-before hover:text-black capitalize">
                      Hồ cá
                    </div>
                  </div>
                </div>
                <div className="list-type mt-4">
                  <div
                    className={`item flex items-center justify-between cursor-pointer active}`}
                    onClick={() => handleChangeType("Cây Thủy Sinh")}
                  >
                    <div className="text-secondary has-line-before hover:text-black capitalize">
                      Cây Thủy Sinh
                    </div>
                  </div>
                </div> */}
                {productTypes.map((type, index) => (
                  <div key={index} className="list-type mt-4">
                    <div
                      className="item flex items-center justify-between cursor-pointer"
                      onClick={() => handleChangeType(type)}
                    >
                      <div className="text-secondary has-line-before hover:text-black capitalize">
                        {type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="filter-price pb-8 border-b border-line mt-8">
                <div className="heading6">Khoảng giá</div>
                <Slider
                  range
                  defaultValue={[0, 100_000_000]}
                  step={50}
                  min={0}
                  max={100_000_000}
                  onChange={handlePriceChange}
                  className="mt-5"
                />
                <div className="price-block flex items-center justify-between flex-wrap mt-4">
                  <div className="min flex items-center gap-1">
                    <div>Tối thiểu:</div>
                    <div className="price-min">
                      <span>{priceRange.min.toLocaleString("vi-VN")}</span> VND
                    </div>
                  </div>
                  <div className="min flex items-center gap-1">
                    <div>Tối đa:</div>
                    <div className="price-max">
                      <span>{priceRange.max.toLocaleString("vi-VN")}</span> VND
                    </div>
                  </div>
                </div>
              </div>

              {type === "Hồ Cá" && (
                <div className="filter-color pb-8 border-b border-line mt-8">
                  <div className="heading6">Phân Loại</div>
                  <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                    {tankCategories !== null &&
                      tankCategories.map((item, index) => (
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
                                checked={tankCategory === item}
                                onChange={() => handleChangeTankCategory(item)}
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

              {type === "Cá Cảnh" && (
                <div className="filter-color pb-8 border-b border-gray-300 mt-8">
                  <div className="heading6">Giống cá</div>
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

              {type === ProductTypeList.CayThuySinh && (
                <div className="filter-color pb-8 border-b border-gray-300 mt-8">
                  <div className="heading6">Phân loại</div>
                  <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                    {categories &&
                      categories.map((item, index) => (
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
                              {item.name}
                            </label>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {type === ProductTypeList.PhuKien && (
                <div className="filter-color pb-8 border-b border-gray-300 mt-8">
                  <div className="heading6">Phân loại</div>
                  <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                    {categories &&
                      categories.map((item, index) => (
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
  );
}
