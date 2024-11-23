"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/type/ProductType";
import Product from "../Product";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import SwiperCore from "swiper/core";
import { useCart } from "@/context/CartContext";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useModalCompareContext } from "@/context/ModalCompareContext";
import ModalSizeguide from "@/components/Modal/ModalSizeguide";
import { FeedbackType } from "@/type/FeedbackType";
import {
  addToCart,
  getCartFromLocalStorage,
  updateCart,
} from "@/context/CartItemContext";
import { CartItem } from "@/type/CartItem";
import Rate from "@/components/Other/Rate";
import { postFeedback } from "@/components/api/feedback/post";
import { useRouter } from "next/navigation";
import { Placeholder } from "@phosphor-icons/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";


SwiperCore.use([Navigation, Thumbs]);

interface Props {
  data: ProductType | undefined;
  productId: string | number | null;
}

const FixedPrice: React.FC<Props> = ({ data, productId }) => {
  const swiperRef: any = useRef();
  const router = useRouter();
  const [openPopupImg, setOpenPopupImg] = useState(false);
  const [activeTab, setActiveTab] = useState<string | undefined>();
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const [content, setContent] = useState<string>();
  const [star, setStar] = useState<string>("4");

  let productMain = data;

  if (!productMain) {
    return <div className="w-full flex justify-center my-5 h-[500px] items-center">
    <AiOutlineLoading3Quarters className="animate-spin h-[60px] w-[60px]" />
  </div>
  }

  let averageStart = data?.feedbacks.reduce(
    (total: number, feedback) => total + (feedback.rate || 0),
    0
  );

  if (averageStart && data?.feedbacks.length) {
    averageStart = averageStart / data.feedbacks.length;
  }

  const feedbacks = productMain.feedbacks;
  const groupedByRate = feedbacks.reduce(
    (acc: Record<number, any[]>, feedback: FeedbackType) => {
      const rate = feedback.rate;
      if (!acc[rate]) {
        acc[rate] = [];
      }
      acc[rate].push(feedback);
      return acc;
    },
    {}
  );

  const totalFeedbacks = feedbacks.length;

  const result = Object.keys(groupedByRate).map((rate: any) => {
    const count = groupedByRate[rate].length;
    const percentage = ((count / totalFeedbacks) * 100).toFixed(2);

    return {
      rate,
      count,
      percentage,
    };
  });

  const handleAddToCart = (product: ProductType) => {
    const item: CartItem = {
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
      totalPrice: product.price,
      stock: product.stock_quantity,
      discount: 0,
      name: product.name || "",
      imgUrl: product.images[0]?.link || "/images/product/1000x1000.png",
    };
    const message = addToCart(item);
    toast.info(message)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(productMain.id, content, star);
    if (productMain.id && content && star) {
      console.log(productMain.id, content, star);
      await postFeedback(productMain.id, content, star);
      console.log("post feedback done");
      window.location.reload();
    }
  };
  const handleActiveTab = (tab: string) => {
    setActiveTab((prevTab) => (prevTab === tab ? undefined : tab));
  };

  return (
    <>
      <div className="product-detail grouped">
        <div className="featured-product underwear">
          <div className="container md:pt-20 pt-10">
            <div className="list-img grid md:grid-rows-2 md:grid-cols-3 grid-cols-2 lg:gap-[30px] gap-4 w-full">
              {productMain.images &&
                productMain.images.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-img md:row-span-2 row-span-1 col-span-1 max-md:aspect-[3/4] lg:rounded-[20px] rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => {
                        swiperRef.current?.slideTo(index);
                        setOpenPopupImg(true);
                      }}
                    >
                      <Image
                        src={
                          img.link ?? "public\\images\\product\\1000x1000.png"
                        }
                        width={1000}
                        height={1000}
                        alt="Hình ảnh sản phẩm"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              <div className={`popup-img ${openPopupImg ? "open" : ""}`}>
                <span
                  className="close-popup-btn absolute top-4 right-4 z-[2] cursor-pointer"
                  onClick={() => {
                    setOpenPopupImg(false);
                  }}
                >
                  <Icon.X className="text-3xl text-white" />
                </span>
                <Swiper
                  spaceBetween={0}
                  slidesPerView={1}
                  modules={[Navigation, Thumbs]}
                  navigation={true}
                  loop={true}
                  className="popupSwiper"
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                >
                  {productMain.images &&
                    productMain.images.map((item, index) => (
                      <SwiperSlide
                        key={index}
                        onClick={() => {
                          setOpenPopupImg(false);
                        }}
                      >
                        <Image
                          src={item.link!}
                          width={1000}
                          height={1000}
                          alt={item.publicId!}
                          className="w-full object-cover rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent
                          }}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </div>
          </div>
          <div className="container flex justify-between gap-y-6 flex-wrap md:py-20 py-10">
            <div className="desc-tab md:w-1/2 w-full lg:pr-[30px] md:pr-4">
              {/* <div className="get-it pb-6 border-b border-line">
                <div className="heading5">Mua ngay trong hôm nay</div>
                <div className="item flex items-center gap-3 mt-4">
                  <div className="icon-delivery-truck text-4xl"></div>
                  <div>
                    <div className="text-title">Miễn phí ship</div>
                    <div className="caption1 text-secondary mt-1">
                      Miễn phí ship cho đơn hàng trên 100 ngàn
                    </div>
                  </div>
                </div>
                <div className="item flex items-center gap-3 mt-4">
                  <div className="icon-phone-call text-4xl"></div>
                  <div>
                    <div className="text-title">Hỗ trợ miễn phí</div>
                    <div className="caption1 text-secondary mt-1">
                      Hỗ trợ từ 8h sáng đến 7h tối
                    </div>
                  </div>
                </div>
                <div className="item flex items-center gap-3 mt-4">
                  <div className="icon-return text-4xl"></div>
                  <div>
                    <div className="text-title">Trả hàng</div>
                    <div className="caption1 text-secondary mt-1">
                      Trả hàng nếu không đúng mô tả
                    </div>
                  </div>
                </div>
              </div> */}
              {productMain.type === "fish" ? (
                <div className="desc-block pb-6 border-b border-line mt-6">
                  <div
                    className={`tab-item heading5 flex items-center justify-between cursor-pointer ${
                      activeTab === "description" ? "active" : ""
                    }`}
                    onClick={() => handleActiveTab("description")}
                  >
                    <span className="heading5">Mô tả</span>
                    <Icon.CaretDown />
                  </div>
                  <div
                    className={`desc-item md:pt-8 pt-5 description ${
                      activeTab === "description" ? "open" : ""
                    }`}
                  >
                    <div className="right">
                      {productMain.fish?.date_of_birth && (
                        <div>
                          <div className="heading6">Giải thưởng</div>
                            <div className="list-feature space-y-4 bg-gray-50 p-4 rounded-lg shadow-md">
                            {productMain.fish?.awards && productMain.fish.awards.length > 0 ? (
                              productMain.fish.awards.map((award, index) => (
                                <div
                                  key={index}
                                  className="award-item flex gap-3 items-start p-2 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                                >
                                  <div className="icon text-primary flex-shrink-0">
                                    <Icon.Trophy size={24} className="text-yellow-500" />
                                  </div>
                                  <div className="award-content">
                                    <h4 className="font-semibold text-lg text-gray-800">
                                      {award.name}
                                      <span className="text-sm text-gray-500 ml-2">
                                        ({new Date(award.award_date).toLocaleDateString()})
                                      </span>
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">{award.description}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="font-semibold text-lg text-gray-800">Chưa có giải thưởng</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="left md:mt-8 mt-5">
                      <div className="heading6">Giống cá</div>
                      <div className="text-secondary mt-2">
                        {productMain.fish?.breed
                          ? productMain.fish.breed.description
                          : "Koi Kohaku Là dòng Koi được yêu thích nhất. Là dòng Koi được lai tạo đầu tiên tại Nhật. Có lịch sử lâu đời (từ TK 19). Koi nổi bật với nước da trắng hơn tuyết, các điểm đỏ Hi lớn, phân bố đều, hài hòa trên thân. Kohaku nghĩa là đỏ và trắng. Kohaku gồm 7 phiên bản: menkaburi Kohaku; Kuchibeni Kohaku; Inazuma Kohalku; Maruten Kohaku; Straight Hi-kohaku; Tancho Kohaku; Doitsu Kohaku; Nidan Kohaku; Ginrin kohaku"}
                      </div>
                    </div>
                    <div className="left md:mt-8 mt-5">
                      <div className="heading6">Thông tin</div>
                      <div className="text-secondary mt-2">
                        {productMain.description && productMain.description.trim() !== ""
                          ? productMain.description
                          : "Không có mô tả"}
                      </div>
                    </div>
                    <div className="left md:mt-8 mt-5">
                      <div className="heading6">Thông tin chi tiết</div>
                      <div className="text-secondary mt-2">
                        {productMain.description_detail && productMain.description_detail.trim() !== ""
                        ? productMain.description_detail.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))
                        : "Không có mô tả"}
                      </div>
                    </div>
                
                  </div>
                </div>
              ) : productMain.type === "tank" ? (
                <div className="desc-block pb-6 border-b border-line mt-6">
                  <div
                    className={`tab-item heading5 flex items-center justify-between cursor-pointer ${
                      activeTab === "description" ? "active" : ""
                    }`}
                    onClick={() => handleActiveTab("description")}
                  >
                    <span className="heading5">Mô tả</span>
                    <Icon.CaretDown />
                  </div>
                  <div
                    className={`desc-item md:pt-8 pt-5 description ${
                      activeTab === "description" ? "open" : ""
                    }`}
                  >
                    <div className="right">
                    <div className="heading6">Phân loại</div>
                      <div className="list-feature space-y-4 bg-gray-50 p-4 rounded-lg shadow-md">
                      {productMain.categories && productMain.categories.length > 0 ? (
                        productMain.categories.map((category, index) => (
                          <div
                            key={index}
                            className="category-item flex gap-3 items-start p-2 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="icon text-primary flex-shrink-0">
                              <Icon.Tag size={24} className="text-yellow-500" />
                            </div>
                            <div className="category-content">
                              <h4 className="font-semibold text-lg text-gray-800">
                                {category.name}
                              </h4>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-600">Không có phân loại</div>
                      )}
                      </div>
                    </div>
                    <div className="left md:mt-8 mt-5">
                      <div className="heading6">Thông tin</div>
                      <div className="text-secondary mt-2">
                        {productMain.description && productMain.description.trim() !== ""
                          ? productMain.description
                          : "Không có mô tả"}
                      </div>
                    </div>
                    <div className="left md:mt-8 mt-5">
                      <div className="heading6">Thông tin chi tiết</div>
                      <div className="text-secondary mt-2">
                        {productMain.description_detail && productMain.description_detail.trim() !== ""
                        ? productMain.description_detail.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))
                        : "Không có mô tả"}
                      </div>
                    </div>
                  
                  </div>
                </div>
              ) : (
                <div className="desc-block pb-6 border-b border-line mt-6">
                  <div
                    className={`tab-item heading5 flex items-center justify-between cursor-pointer ${
                      activeTab === "description" ? "active" : ""
                    }`}
                    onClick={() => handleActiveTab("description")}
                  >
                    <span className="heading5">Mô tả</span>
                    <Icon.CaretDown />
                  </div>
                  <div
                    className={`desc-item md:pt-8 pt-5 description ${
                      activeTab === "description" ? "open" : ""
                    }`}
                  >
                    <div className="right">
                    <div className="heading6">Phân loại</div>
                      <div className="list-feature space-y-4 bg-gray-50 p-4 rounded-lg shadow-md">
                      {productMain.categories && productMain.categories.length > 0 ? (
                        productMain.categories.map((category, index) => (
                          <div
                            key={index}
                            className="category-item flex gap-3 items-start p-2 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="icon text-primary flex-shrink-0">
                              <Icon.Tag size={24} className="text-yellow-500" />
                            </div>
                            <div className="category-content">
                              <h4 className="font-semibold text-lg text-gray-800">
                                {category.name}
                              </h4>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-600">Không có phân loại</div>
                      )}
                      </div>
                    </div>
                    <div className="left md:mt-8 mt-5">
                      <div className="heading6">Thông tin</div>
                      <div className="text-secondary mt-2">
                        {productMain.description && productMain.description.trim() !== ""
                          ? productMain.description.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))
                          : "Không có mô tả"}
                      </div>
                    </div>
                    <div className="left md:mt-8 mt-5">
                      <div className="heading6">Thông tin chi tiết</div>
                      <div className="text-secondary mt-2">
                        {productMain.description_detail && productMain.description_detail.trim() !== ""
                        ? productMain.description_detail.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))
                        : "Không có mô tả"}
                      </div>
                    </div>
                  
                  </div>
                </div>
              )}
              <div className="desc-block mt-6">
                <div
                  className={`tab-item heading5 flex items-center justify-between cursor-pointer ${
                    activeTab === "review" ? "active" : ""
                  }`}
                  onClick={() => handleActiveTab("review")}
                >
                  <span className="heading5">Review</span>
                  <Icon.CaretDown />
                </div>
                <div
                  className={`desc-item md:pt-8 pt-5 review-block ${
                    activeTab === "review" ? "open" : ""
                  }`}
                >
                  <div className="top-overview">
                    <div className="left flex items-center justify-between w-full">
                      <div className="rating black-start flex flex-col items-center">
                        <div className="text-display">
                          {averageStart?.toFixed(1)}
                        </div>
                        <Rate currentRate={averageStart} size={18} />
                      </div>
                      <div className="list-rating w-2/3 pl-6">
                        {result.map((group) => (
                          <div
                            key={group.rate}
                            className="item flex items-center justify-end gap-1.5"
                          >
                            <div className="flex items-center gap-1">
                              <div className="caption1">{group.rate}</div>
                              <Icon.Star size={14} weight="fill" />
                            </div>
                            <div className="progress bg-line relative w-3/4 h-2">
                              <div
                                className={`progress-percent absolute bg-black h-full left-0 top-0`}
                                style={{ width: `${group.percentage}%` }}
                              ></div>
                            </div>
                            <div className="caption1">{group.percentage}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="heading flex items-center justify-between flex-wrap gap-4">
                      <div className="heading6">
                        {productMain.feedbacks.length} Comment
                        {productMain.feedbacks.length != 1 && "s"}
                      </div>
                      <div className="right flex items-center gap-3">
                        <label htmlFor="select-filter" className="uppercase">
                          Sort by:
                        </label>
                        <div className="select-block relative">
                          <select
                            id="select-filter"
                            name="select-filter"
                            className="text-button py-2 pl-3 md:pr-14 pr-10 rounded-lg bg-white border border-line"
                            defaultValue={"Sorting"}
                          >
                            <option value="Sorting" disabled>
                              Sorting
                            </option>
                            <option value="newest">Newest</option>
                            <option value="5star">5 Star</option>
                            <option value="4star">4 Star</option>
                            <option value="3star">3 Star</option>
                            <option value="2star">2 Star</option>
                            <option value="1star">1 Star</option>
                          </select>
                          <Icon.CaretDown
                            size={12}
                            className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="list-review mt-6">
                      {productMain.feedbacks &&
                        productMain.feedbacks.map((feedback, index) => (
                          <div key={index} className="item mt-8">
                            <div className="heading flex items-center justify-between">
                              <div className="user-infor flex gap-4">
                                <div className="avatar">
                                  <Image
                                    src={"/images/avatar/3.png"}
                                    width={200}
                                    height={200}
                                    alt="Hình ảnh sản phẩm"
                                    className="w-[52px] aspect-square rounded-full"
                                  />
                                </div>
                                <div className="user">
                                  <div className="flex items-center gap-2">
                                    <div className="text-title">
                                      {feedback.user_id}
                                    </div>
                                    <div className="span text-line">-</div>
                                    <Rate
                                      currentRate={feedback.rate}
                                      size={12}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="more-action cursor-pointer">
                                <Icon.DotsThree size={24} weight="bold" />
                              </div>
                            </div>
                            <div className="mt-3">{feedback.content}</div>
                            <div className="action mt-3">
                              <div className="flex items-center gap-4">
                              
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div id="form-review" className="form-review pt-6">
                      <div className="heading4">Leave A comment</div>
                      <form
                        className="grid sm:grid-cols-2 gap-4 gap-y-5 md:mt-6 mt-3"
                        onSubmit={handleSubmit}
                      >
                        <div className="col-span-full message w-full">
                          <input
                            className="border border-line px-4 py-3 rounded-lg"
                            type="text"
                            onChange={(c) => setContent(c.target.value)}
                            placeholder="Your message *"
                          />
                          <select
                            className="border border-gray-300 px-4 py-3 rounded-lg mt-3 bg-white"
                            onChange={(c) => setStar(c.target.value)}
                            defaultValue="5"
                          >
                            {[5, 4, 3, 2, 1].map((c) => (
                              <option key={c} value={c}>
                                {"★".repeat(c)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-full sm:pt-3">
                          <button className="button-main bg-white text-black border border-black">
                            Submit Reviews
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="product-infor md:w-1/2 w-full lg:pl-[30px] md:pl-4">
              <div className="content bg-white lg:p-10 p-6 lg:rounded-3xl rounded-2xl box-shadow-small">
                <div className="list-action mt-6">
                  <div className="choose-quantity flex items-center lg:justify-between md:flex-wrap gap-5 gap-y-3 mt-3">
                    <div
                      onClick={(c) => handleAddToCart(productMain)}
                      className="button-main w-full text-center bg-white text-black border border-black"
                    >
                      Add To Cart
                    </div>
                  </div>
                </div>
              
                <div className="flex flex-col gap-3 mt-5 pb-6 border-b border-gray-300">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="product-price text-xl font-semibold text-gray-800">
                      {productMain.price.toLocaleString("vi-VN")} VND
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="desc text-secondary text-gray-600">
                      {productMain.name}
                    </div>
                  </div>
                  {/* {productMain.type === "fish" ? (
                    <div className="mt-3 space-y-2">
                      {productMain.fish?.size && (
                        <p className="text-gray-700">Kích thước: {productMain.fish.size}</p>
                      )}
                      {productMain.fish?.age && (
                        <p className="text-gray-700">Tuổi: {productMain.fish.age}</p>
                      )}
                      {productMain.fish?.origin && (
                        <p className="text-gray-700">Nguồn gốc: {productMain.fish.origin}</p>
                      )}
                      {productMain.fish?.sex && (
                        <p className="text-gray-700">Giới tính: {productMain.fish.sex}</p>
                      )}
                      {productMain.fish?.food_amount && (
                        <p className="text-gray-700">Lượng đồ ăn: {productMain.fish.food_amount}</p>
                      )}
                      {productMain.fish?.weight && (
                        <p className="text-gray-700">Cân nặng: {productMain.fish.weight}</p>
                      )}
                      {productMain.fish?.health && (
                        <p className="text-gray-700">Sức khỏe: {productMain.fish.health}</p>
                      )}
                      {productMain.fish?.date_of_birth && (
                        <p className="text-gray-700">Ngày sinh: {productMain.fish.date_of_birth}</p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {productMain.tank?.size && (
                        <p className="text-gray-700">
                          Kích cỡ: {productMain.tank?.size}
                        </p>
                      )}
                      {productMain.tank?.size_information ? (
                        <p className="text-gray-700">
                          Thông số: {productMain.tank.size_information}
                        </p>
                        ) : (
                        <></>
                      )}
                      {productMain.tank?.glass_type && (
                        <p className="text-gray-700">
                          Loại kính: {productMain.tank?.glass_type}
                        </p>
                      )}
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FixedPrice;
