"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/type/ProductType";
import Product from "../Product";
import Rate from "@/components/Other/Rate";
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

SwiperCore.use([Navigation, Thumbs]);

interface Props {
  data: ProductType | undefined;
  productId: string | number | null;
}

const FixedPrice: React.FC<Props> = ({ data, productId }) => {
  const swiperRef: any = useRef();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [openPopupImg, setOpenPopupImg] = useState(false);
  const [openSizeGuide, setOpenSizeGuide] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string | undefined>("description");
  const { openModalCart } = useModalCartContext();
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();
  let productMain = data;
  if (!productMain) {
    return <div>...Đang tải sản phẩm</div>;
  }

  console.log(productMain);

  let averageStart = data?.feedbacks.reduce(
    (total: number, feedback) => total + (feedback.rate || 0), 
    0
  );
  
  if (averageStart && data?.feedbacks.length) {
    averageStart = averageStart / data.feedbacks.length;
  }
  
  const percentSale = Math.floor(
    100 - (productMain.price / productMain.original_price) * 100
  );

  const feedbacks = productMain.feedbacks;
  const groupedByRate = feedbacks.reduce((acc: Record<number, any[]>, feedback: FeedbackType) => {
    const rate = feedback.rate
    if (!acc[rate]) {
      acc[rate]=[]
    }
    acc[rate].push(feedback)
    return acc
  }, {})

  const totalFeedbacks = feedbacks.length;

  const result = Object.keys(groupedByRate).map((rate: any) => {
    const count = groupedByRate[rate].length;
    const percentage = ((count / totalFeedbacks) * 100).toFixed(2);
    
    return {
      rate,
      count,
      percentage
    };
  });

  const handleOpenSizeGuide = () => {
    setOpenSizeGuide(true);
  };

  const handleCloseSizeGuide = () => {
    setOpenSizeGuide(false);
  };

  const handleActiveColor = (item: string) => {
    setActiveColor(item);
  };

  const handleActiveSize = (item: string) => {
    setActiveSize(item);
  };

  //   const handleIncreaseQuantity = () => {
  //     if (!productMain.quantityPurchase) {
  //       productMain.quantityPurchase = 0;
  //     }
  //     productMain.quantityPurchase += 1;
  //     updateCart(
  //       productMain.id,
  //       productMain.quantityPurchase + 1,
  //       activeSize,
  //       activeColor
  //     );
  //   };

  //   const handleDecreaseQuantity = () => {
  //     if (!productMain.quantityPurchase) {
  //       productMain.quantityPurchase = 0;
  //     }
  //     if (productMain.quantityPurchase > 1) {
  //       productMain.quantityPurchase -= 1;
  //       updateCart(
  //         productMain.id,
  //         productMain.quantityPurchase - 1,
  //         activeSize,
  //         activeColor
  //       );
  //     }
  //   };

  //   const handleAddToCart = () => {
  //     if (!productMain.quantityPurchase) {
  //       productMain.quantityPurchase = 0;
  //     }
  //     if (!cartState.cartArray.find((item) => item.id === productMain.id)) {
  //       addToCart({ ...productMain });
  //       updateCart(
  //         productMain.id,
  //         productMain.quantityPurchase,
  //         activeSize,
  //         activeColor
  //       );
  //     } else {
  //       updateCart(
  //         productMain.id,
  //         productMain.quantityPurchase,
  //         activeSize,
  //         activeColor
  //       );
  //     }
  //     openModalCart();
  //   };

  const handleAddToWishlist = () => {
    // if product existed in wishlit, remove from wishlist and set state to false
    if (
      wishlistState.wishlistArray.some((item) => item.id == productMain?.id)
    ) {
      productMain?.id && removeFromWishlist(productMain?.id);
    } else {
      // else, add to wishlist and set state to true
      productMain && addToWishlist(productMain);
    }
    openModalWishlist();
  };

  // //   const handleAddToCompare = () => {
  // //     // if product existed in wishlit, remove from wishlist and set state to false
  // //     if (compareState.compareArray.length < 3) {
  // //       if (
  // //         compareState.compareArray.some((item) => item.id === productMain.id)
  // //       ) {
  // //         removeFromCompare(productMain.id);
  // //       } else {
  // //         // else, add to wishlist and set state to true
  // //         addToCompare(productMain);
  // //       }
  // //     } else {
  // //       alert("Compare up to 3 products");
  // //     }

  //     openModalCompare();
  //   };

  const handleActiveTab = (tab: string) => {
    setActiveTab((prevTab) => (prevTab === tab ? undefined : tab));
  };
  console.log(productMain.original_price);

  if (productMain.type == "fish") {
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
                          alt="prd-img"
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
                            className="w-full aspect-[3/4] object-cover rounded-xl"
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
                <div className="get-it pb-6 border-b border-line">
                  <div className="heading5">Get it today</div>
                  <div className="item flex items-center gap-3 mt-4">
                    <div className="icon-delivery-truck text-4xl"></div>
                    <div>
                      <div className="text-title">Free shipping</div>
                      <div className="caption1 text-secondary mt-1">
                        Free shipping on orders over $75.
                      </div>
                    </div>
                  </div>
                  <div className="item flex items-center gap-3 mt-4">
                    <div className="icon-phone-call text-4xl"></div>
                    <div>
                      <div className="text-title">Support everyday</div>
                      <div className="caption1 text-secondary mt-1">
                        Support from 8:30 AM to 10:00 PM everyday
                      </div>
                    </div>
                  </div>
                  <div className="item flex items-center gap-3 mt-4">
                    <div className="icon-return text-4xl"></div>
                    <div>
                      <div className="text-title">100 Day Returns</div>
                      <div className="caption1 text-secondary mt-1">
                        Not impressed? Get a refund. You have 100 days to break
                        our hearts.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="desc-block pb-6 border-b border-line mt-6">
                  <div
                    className={`tab-item heading5 flex items-center justify-between cursor-pointer ${
                      activeTab === "description" ? "active" : ""
                    }`}
                    onClick={() => handleActiveTab("description")}
                  >
                    <span className="heading5">Description</span>
                    <Icon.CaretDown />
                  </div>
                  <div
                    className={`desc-item md:pt-8 pt-5 description ${
                      activeTab === "description" ? "open" : ""
                    }`}
                  >
                    <div className="right">
                      <div className="heading6">Award</div>
                      <div className="list-feature space-y-4 bg-gray-50 p-4 rounded-lg shadow-md">
                        {productMain.fish?.awards?.map((award, index) => (
                          <div
                            key={index}
                            className="award-item flex gap-3 items-start p-2 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="icon text-primary flex-shrink-0">
                              <Icon.Trophy
                                size={24}
                                className="text-yellow-500"
                              />
                            </div>
                            <div className="award-content">
                              <h4 className="font-semibold text-lg text-gray-800">
                                {award.name}
                                <span className="text-sm text-gray-500 ml-2">
                                  (
                                  {new Date(
                                    award.award_date
                                  ).toLocaleDateString()}
                                  )
                                </span>
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {award.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="left md:mt-8 mt-5">
                      <div className="heading6">Description</div>
                      <div className="text-secondary mt-2">
                        {productMain.fish
                          ? productMain.fish.breed.description
                          : "Koi Kohaku Là dòng Koi được yêu thích nhất. Là dòng Koi được lai tạo đầu tiên tại Nhật. Có lịch sử lâu đời (từ TK 19). Koi nổi bật với nước da trắng hơn tuyết, các điểm đỏ Hi lớn, phân bố đều, hài hòa trên thân. Kohaku nghĩa là đỏ và trắng. Kohaku gồm 7 phiên bản: menkaburi Kohaku; Kuchibeni Kohaku; Inazuma Kohalku; Maruten Kohaku; Straight Hi-kohaku; Tancho Kohaku; Doitsu Kohaku; Nidan Kohaku; Ginrin kohaku"}
                      </div>
                    </div>
                    {/* <div className="grid grid-cols-2 gap-[30px] md:mt-8 mt-5">
                    <div className="item">
                      <div className="icon-delivery-truck text-4xl"></div>
                      <div className="heading6 mt-4">Shipping Faster</div>
                      <div className="text-secondary mt-2">
                        Use on walls, furniture, doors and many more surfaces.
                        The possibilities are endless.
                      </div>
                    </div>
                    <div className="item">
                      <div className="icon-cotton text-4xl"></div>
                      <div className="heading6 mt-4">Cotton Material</div>
                      <div className="text-secondary mt-2">
                        Use on walls, furniture, doors and many more surfaces.
                        The possibilities are endless.
                      </div>
                    </div>
                    <div className="item">
                      <div className="icon-guarantee text-4xl"></div>
                      <div className="heading6 mt-4">High Quality</div>
                      <div className="text-secondary mt-2">
                        Use on walls, furniture, doors and many more surfaces.
                        The possibilities are endless.
                      </div>
                    </div>
                    <div className="item">
                      <div className="icon-leaves-compatible text-4xl"></div>
                      <div className="heading6 mt-4">highly compatible</div>
                      <div className="text-secondary mt-2">
                        Use on walls, furniture, doors and many more surfaces.
                        The possibilities are endless.
                      </div>
                    </div>
                  </div> */}
                  </div>
                </div>
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
                          <div className="text-display">{averageStart}</div>
                          <Rate currentRate={averageStart} size={18} />
                          <div className="text-center whitespace-nowrap mt-1">
                            ({productMain.feedbacks.length} Ratings)
                          </div>
                        </div>
                        <div className="list-rating w-2/3 pl-6">
                          {result.map((group) => (
                            <div key={group.rate} className="item flex items-center justify-end gap-1.5">
                            <div className="flex items-center gap-1">
                              <div className="caption1">{group.rate}</div>
                              <Icon.Star size={14} weight="fill" />
                            </div>
                            <div className="progress bg-line relative w-3/4 h-2">
                              <div className="progress-percent absolute bg-black w-[50%] h-full left-0 top-0"></div>
                            </div>
                            <div className="caption1">{group.percentage}</div>
                          </div>
                          ))}
                        </div>
                      </div>
                      <div className="right mt-5">
                        <Link
                          href={"#form-review"}
                          className="button-main bg-white text-black border border-black whitespace-nowrap"
                        >
                          Write Reviews
                        </Link>
                      </div>
                    </div>
                    <div className="mt-8">
                      <div className="heading flex items-center justify-between flex-wrap gap-4">
                        <div className="heading6">03 Comments</div>
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
                        {productMain.feedbacks && productMain.feedbacks.map((feedback, index) => (
                          <div key={index} className="item mt-8">
                          <div className="heading flex items-center justify-between">
                            <div className="user-infor flex gap-4">
                              <div className="avatar">
                                <Image
                                  src={"/images/avatar/3.png"}
                                  width={200}
                                  height={200}
                                  alt="img"
                                  className="w-[52px] aspect-square rounded-full"
                                />
                              </div>
                              <div className="user">
                                <div className="flex items-center gap-2">
                                  <div className="text-title">{feedback.user_id}</div>
                                  <div className="span text-line">-</div>
                                  <Rate currentRate={feedback.rate} size={12} />
                                </div>
                              </div>
                            </div>
                            <div className="more-action cursor-pointer">
                              <Icon.DotsThree size={24} weight="bold" />
                            </div>
                          </div>
                          <div className="mt-3">
                            {feedback.content}
                          </div>
                          <div className="action mt-3">
                            <div className="flex items-center gap-4">
                              <div className="like-btn flex items-center gap-1 cursor-pointer">
                                <Icon.HandsClapping size={18} />
                                <div className="text-button">20</div>
                              </div>
                              <Link
                                href={"#form-review"}
                                className="reply-btn text-button text-secondary cursor-pointer hover:text-black"
                              >
                                Reply
                              </Link>
                            </div>
                          </div>
                        </div>
                        ))}
                      </div>
                      <div id="form-review" className="form-review pt-6">
                        <div className="heading4">Leave A comment</div>
                        <form className="grid sm:grid-cols-2 gap-4 gap-y-5 md:mt-6 mt-3">
                          <div className="name ">
                            <input
                              className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                              id="username"
                              type="text"
                              placeholder="Your Name *"
                              required
                            />
                          </div>
                          <div className="mail ">
                            <input
                              className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                              id="email"
                              type="email"
                              placeholder="Your Email *"
                              required
                            />
                          </div>
                          <div className="col-span-full message">
                            <textarea
                              className="border border-line px-4 py-3 w-full rounded-lg"
                              id="message"
                              name="message"
                              placeholder="Your message *"
                              required
                            ></textarea>
                          </div>
                          <div className="col-span-full flex items-start -mt-2 gap-2">
                            <input
                              type="checkbox"
                              id="saveAccount"
                              name="saveAccount"
                              className="mt-1.5"
                            />
                            <label className="" htmlFor="saveAccount">
                              Save my name, email, and website in this browser
                              for the next time I comment.
                            </label>
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
                  {/* <div className="flex justify-between">
                  <div>
                    <div className="caption2 text-secondary font-semibold uppercase">
                      {productMain.type}
                    </div>
                    <div className="heading4 mt-1">{productMain.name}</div>
                  </div>
                  {productMain && <div
                    className={`add-wishlist-btn w-12 h-12 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white ${
                      wishlistState.wishlistArray.some(
                        (item) => item.id == productMain.id
                      )
                        ? "active"
                        : ""
                    }`}
                    onClick={handleAddToWishlist}
                  >
                    {wishlistState.wishlistArray.some(
                      (item) => item.id == productMain.id
                    ) ? (
                      <>
                        <Icon.Heart
                          size={24}
                          weight="fill"
                          className="text-white"
                        />
                      </>
                    ) : (
                      <>
                        <Icon.Heart size={24} />
                      </>
                    )}
                  </div>}
                </div> */}
                  {/* <div className="flex items-center mt-3">
                  <Rate currentRate={productMain.rate} size={14} />
                  <span className="caption1 text-secondary">
                    (1.234 reviews)
                  </span>
                </div> */}
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
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-700">
                        Size: {productMain.fish?.size}
                      </p>
                      <p className="text-gray-700">
                        Age: {productMain.fish?.age}
                      </p>
                      <p className="text-gray-700">
                        Origin: {productMain.fish?.origin}
                      </p>
                      <p className="text-gray-700">
                        Sex: {productMain.fish?.sex}
                      </p>
                      <p className="text-gray-700">
                        Food amount: {productMain.fish?.food_amount}
                      </p>
                      <p className="text-gray-700">
                        Weight: {productMain.fish?.weight}
                      </p>
                      <p className="text-gray-700">
                        Health: {productMain.fish?.health}
                      </p>
                      <p className="text-gray-700">
                        Date of birth: {productMain.fish?.date_of_birth}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="related-product md:pb-20 pb-10">
            <div className="container">
              <div className="heading3 text-center">Related Products</div>
              <div className="list-product hide-product-sold  grid lg:grid-cols-4 grid-cols-2 md:gap-[30px] gap-5 md:mt-10 mt-6">
                {data
                  .slice(Number(productId), Number(productId) + 4)
                  .map((item, index) => (
                    <Product key={index} data={item} type="grid" />
                  ))}
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </>
    );
  } else {
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
                          alt="prd-img"
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
                            className="w-full aspect-[3/4] object-cover rounded-xl"
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
                <div className="get-it pb-6 border-b border-line">
                  <div className="heading5">Get it today</div>
                  <div className="item flex items-center gap-3 mt-4">
                    <div className="icon-delivery-truck text-4xl"></div>
                    <div>
                      <div className="text-title">Free shipping</div>
                      <div className="caption1 text-secondary mt-1">
                        Free shipping on orders over $75.
                      </div>
                    </div>
                  </div>
                  <div className="item flex items-center gap-3 mt-4">
                    <div className="icon-phone-call text-4xl"></div>
                    <div>
                      <div className="text-title">Support everyday</div>
                      <div className="caption1 text-secondary mt-1">
                        Support from 8:30 AM to 10:00 PM everyday
                      </div>
                    </div>
                  </div>
                  <div className="item flex items-center gap-3 mt-4">
                    <div className="icon-return text-4xl"></div>
                    <div>
                      <div className="text-title">100 Day Returns</div>
                      <div className="caption1 text-secondary mt-1">
                        Not impressed? Get a refund. You have 100 days to break
                        our hearts.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="desc-block pb-6 border-b border-line mt-6">
                  <div
                    className={`tab-item heading5 flex items-center justify-between cursor-pointer ${
                      activeTab === "description" ? "active" : ""
                    }`}
                    onClick={() => handleActiveTab("description")}
                  >
                    <span className="heading5">Category</span>
                    <Icon.CaretDown />
                  </div>
                  <div
                    className={`desc-item md:pt-8 pt-5 description ${
                      activeTab === "description" ? "open" : ""
                    }`}
                  >
                    <div className="right">
                      <div className="list-feature space-y-4 bg-gray-50 p-4 rounded-lg shadow-md">
                        {productMain.tank?.categories?.map((category, index) => (
                          <div
                            key={index}
                            className="award-item flex gap-3 items-start p-2 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="icon text-primary flex-shrink-0">
                              <Icon.Tag
                                size={24}
                                className="text-yellow-500"
                              />
                            </div>
                            <div className="award-content">
                              <h4 className="font-semibold text-lg text-gray-800">
                                {category.level}
                                <span className="text-sm text-gray-500 ml-2">
                                  (
                                  {new Date(category.created_at).toLocaleDateString()}
                                  )
                                </span>
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {category.tank_type}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* <div className="grid grid-cols-2 gap-[30px] md:mt-8 mt-5">
                    <div className="item">
                      <div className="icon-delivery-truck text-4xl"></div>
                      <div className="heading6 mt-4">Shipping Faster</div>
                      <div className="text-secondary mt-2">
                        Use on walls, furniture, doors and many more surfaces.
                        The possibilities are endless.
                      </div>
                    </div>
                    <div className="item">
                      <div className="icon-cotton text-4xl"></div>
                      <div className="heading6 mt-4">Cotton Material</div>
                      <div className="text-secondary mt-2">
                        Use on walls, furniture, doors and many more surfaces.
                        The possibilities are endless.
                      </div>
                    </div>
                    <div className="item">
                      <div className="icon-guarantee text-4xl"></div>
                      <div className="heading6 mt-4">High Quality</div>
                      <div className="text-secondary mt-2">
                        Use on walls, furniture, doors and many more surfaces.
                        The possibilities are endless.
                      </div>
                    </div>
                    <div className="item">
                      <div className="icon-leaves-compatible text-4xl"></div>
                      <div className="heading6 mt-4">highly compatible</div>
                      <div className="text-secondary mt-2">
                        Use on walls, furniture, doors and many more surfaces.
                        The possibilities are endless.
                      </div>
                    </div>
                  </div> */}
                  </div>
                </div>
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
                          <div className="text-display">{averageStart}</div>
                          <Rate currentRate={averageStart} size={18} />
                          <div className="text-center whitespace-nowrap mt-1">
                            ({productMain.feedbacks.length} Ratings)
                          </div>
                        </div>
                        <div className="list-rating w-2/3 pl-6">
                          {result.map((group) => (
                            <div key={group.rate} className="item flex items-center justify-end gap-1.5">
                            <div className="flex items-center gap-1">
                              <div className="caption1">{group.rate}</div>
                              <Icon.Star size={14} weight="fill" />
                            </div>
                            <div className="progress bg-line relative w-3/4 h-2">
                              <div className={`progress-percent absolute bg-black h-full left-0 top-0`} style={{ width: `${group.percentage}%` }}></div>
                            </div>
                            <div className="caption1">{group.percentage}</div>
                          </div>
                          ))}
                        </div>
                      </div>
                      <div className="right mt-5">
                        <Link
                          href={"#form-review"}
                          className="button-main bg-white text-black border border-black whitespace-nowrap"
                        >
                          Write Reviews
                        </Link>
                      </div>
                    </div>
                    <div className="mt-8">
                      <div className="heading flex items-center justify-between flex-wrap gap-4">
                        <div className="heading6">03 Comments</div>
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
                        {productMain.feedbacks && productMain.feedbacks.map((feedback, index) => (
                          <div key={index} className="item mt-8">
                          <div className="heading flex items-center justify-between">
                            <div className="user-infor flex gap-4">
                              <div className="avatar">
                                <Image
                                  src={"/images/avatar/3.png"}
                                  width={200}
                                  height={200}
                                  alt="img"
                                  className="w-[52px] aspect-square rounded-full"
                                />
                              </div>
                              <div className="user">
                                <div className="flex items-center gap-2">
                                  <div className="text-title">{feedback.user_id}</div>
                                  <div className="span text-line">-</div>
                                  <Rate currentRate={feedback.rate} size={12} />
                                </div>
                              </div>
                            </div>
                            <div className="more-action cursor-pointer">
                              <Icon.DotsThree size={24} weight="bold" />
                            </div>
                          </div>
                          <div className="mt-3">
                            {feedback.content}
                          </div>
                          <div className="action mt-3">
                            <div className="flex items-center gap-4">
                              <div className="like-btn flex items-center gap-1 cursor-pointer">
                                <Icon.HandsClapping size={18} />
                                <div className="text-button">20</div>
                              </div>
                              <Link
                                href={"#form-review"}
                                className="reply-btn text-button text-secondary cursor-pointer hover:text-black"
                              >
                                Reply
                              </Link>
                            </div>
                          </div>
                        </div>
                        ))}
                      </div>
                      <div id="form-review" className="form-review pt-6">
                        <div className="heading4">Leave A comment</div>
                        <form className="grid sm:grid-cols-2 gap-4 gap-y-5 md:mt-6 mt-3">
                          <div className="name ">
                            <input
                              className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                              id="username"
                              type="text"
                              placeholder="Your Name *"
                              required
                            />
                          </div>
                          <div className="mail ">
                            <input
                              className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                              id="email"
                              type="email"
                              placeholder="Your Email *"
                              required
                            />
                          </div>
                          <div className="col-span-full message">
                            <textarea
                              className="border border-line px-4 py-3 w-full rounded-lg"
                              id="message"
                              name="message"
                              placeholder="Your message *"
                              required
                            ></textarea>
                          </div>
                          <div className="col-span-full flex items-start -mt-2 gap-2">
                            <input
                              type="checkbox"
                              id="saveAccount"
                              name="saveAccount"
                              className="mt-1.5"
                            />
                            <label className="" htmlFor="saveAccount">
                              Save my name, email, and website in this browser
                              for the next time I comment.
                            </label>
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
                  {/* <div className="flex justify-between">
                  <div>
                    <div className="caption2 text-secondary font-semibold uppercase">
                      {productMain.type}
                    </div>
                    <div className="heading4 mt-1">{productMain.name}</div>
                  </div>
                  {productMain && <div
                    className={`add-wishlist-btn w-12 h-12 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white ${
                      wishlistState.wishlistArray.some(
                        (item) => item.id == productMain.id
                      )
                        ? "active"
                        : ""
                    }`}
                    onClick={handleAddToWishlist}
                  >
                    {wishlistState.wishlistArray.some(
                      (item) => item.id == productMain.id
                    ) ? (
                      <>
                        <Icon.Heart
                          size={24}
                          weight="fill"
                          className="text-white"
                        />
                      </>
                    ) : (
                      <>
                        <Icon.Heart size={24} />
                      </>
                    )}
                  </div>}
                </div> */}
                  {/* <div className="flex items-center mt-3">
                  <Rate currentRate={productMain.rate} size={14} />
                  <span className="caption1 text-secondary">
                    (1.234 reviews)
                  </span>
                </div> */}
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
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-700">
                        Size: {productMain.tank?.size}
                      </p>
                      <p className="text-gray-700">
                        Size information: {productMain.tank?.size_information}
                      </p>
                      <p className="text-gray-700">
                        Glass type: {productMain.tank?.glass_type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="related-product md:pb-20 pb-10">
            <div className="container">
              <div className="heading3 text-center">Related Products</div>
              <div className="list-product hide-product-sold  grid lg:grid-cols-4 grid-cols-2 md:gap-[30px] gap-5 md:mt-10 mt-6">
                {data
                  .slice(Number(productId), Number(productId) + 4)
                  .map((item, index) => (
                    <Product key={index} data={item} type="grid" />
                  ))}
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </>
    );
  }
};

export default FixedPrice;
