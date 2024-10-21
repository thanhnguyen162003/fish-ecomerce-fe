import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "@/styles/styles.scss";
import GlobalProvider from "./GlobalProvider";
import ModalCart from "@/components/Modal/ModalCart";
import ModalWishlist from "@/components/Modal/ModalWishlist";
import ModalSearch from "@/components/Modal/ModalSearch";
import ModalQuickview from "@/components/Modal/ModalQuickview";
import ModalCompare from "@/components/Modal/ModalCompare";
import CountdownTimeType from "@/type/CountdownType";
import { countdownTime } from "@/store/countdownTime";
import Footer from "@/components/Footer/Footer";
import MenuFour from "@/components/Header/Menu/MenuFour";
import MenuOne from "@/components/Header/Menu/MenuOne";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const pacifico = Noto_Sans_JP({
  subsets: ["latin", "vietnamese"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Aquamarine",
  description: "Multipurpose eCommerce Template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalProvider>
      <html lang="en">
        <body
          className={`${pacifico.className} text-black min-h-screen flex flex-col`}
        >
          <MenuOne background="bg-[#4d7fff]" text="text-pearlWhite" />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            className="bg-blue-500 text-white"
          />
          <div className="flex-grow">{children}</div>
          <ModalCart/>
          <ModalWishlist />
          <ModalSearch />
          <ModalQuickview />
          <ModalCompare />
          <Footer background="bg-[#4d7fff]" text="text-pearlWhite" />
        </body>
      </html>
    </GlobalProvider>
  );
}
