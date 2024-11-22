import React from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface Props {
  background: string;
  text: string;
}

const Footer: React.FC<Props> = ({ background, text }) => {
  return (
    <>
      <footer id="footer" className="footer pt-10">
        <div className={`footer-main ${background} ${text}`}>
          <div className="container">
            <div className="content-footer py-[30px] flex justify-between flex-wrap gap-y-8">
              <div className="company-infor basis-[45%] max-lg:basis-full pr-7">
                <Link href={"/"} className="logo">
                  <div className="heading4">Aquamarine</div>
                </Link>
                <div className="flex gap-3 mt-3">
                  <div className="flex flex-col ">
                    <span className="text-button">Gmail:</span>
                    <span className="text-button mt-3">Điện thoại/Zalo:</span>
                    <span className="text-button mt-3">Địa chỉ:</span>
                  </div>
                  <div className="flex flex-col ">
                    <span className="">khanhtrinhnguyencr@gmail.com</span>
                    <span className="mt-3">0816344409 (Trịnh)</span>
                    <span className="mt-3 pt-px">205 Nguyễn Văn Tăng, Long Thạnh Mỹ, Quận 9, TP.HCM</span>
                  </div>
                </div>
              </div>
              <div className="right-content flex flex-wrap gap-y-8 basis-[35%] max-lg:basis-full">
                <div className="list-nav flex justify-between max-md:basis-full gap-4">
                  <div className="item flex flex-col ">
                    <div className="heading4">Thông tin</div>
                    <Link
                      className="caption1 has-line-before duration-300 w-fit pt-2"
                      href={"/my-account"}
                    >
                      My Account
                    </Link>
                    <Link
                      className="caption1 has-line-before duration-300 w-fit pt-2"
                      href={"/pages/faqs"}
                    >
                      FAQs
                    </Link>
                    <div className="list-social flex items-center gap-6 mt-4">
                    <Link
                      href={
                        "https://www.facebook.com/profile.php?id=61566283592694"
                      }
                      target="_blank"
                    >
                      <div className="icon-facebook text-2xl text-black"></div>
                    </Link>
                    <Link href={"https://www.youtube.com/"} target="_blank">
                      <div className="icon-youtube text-2xl text-black"></div>
                    </Link>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
              <div className="left flex items-center gap-8">
                <div className="copyright caption1 text-white">
                  ©2024 Aquamarine. All Rights Reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
