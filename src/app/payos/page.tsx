'use client'
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Payos = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null | undefined>(null);
  const router = useRouter();

  useEffect(() => {
    const statusParam = searchParams.get("status");
    setStatus(statusParam); // Lấy giá trị `status` từ URL
  }, [searchParams]);

  useEffect(() => {
    if (status !== null) { // Chỉ chạy sau khi `status` đã được cập nhật
      let message = "";
      switch (status) {
        case "PAID":
          message = "Thanh toán thành công! Đơn hàng của bạn đã được tạo, hãy tiếp tục mua hàng 😘";
          toast.info(message);
          setTimeout(() => {
            router.push("/"); // Điều hướng sau 2 giây để người dùng có thể thấy thông báo
          }, 2000);
          break;
        case "CANCELLED":
          message = "Thanh toán đã bị hủy.";
          toast.info(message);
          setTimeout(() => {
            router.push("/checkout");
          }, 2000);
          break;
        default:
          message = "Có lỗi xảy ra trong quá trình thanh toán.";
          toast.info(message);
          setTimeout(() => {
            router.push("/checkout");
          }, 2000);
          break;
      }
      console.log(message);
    }
  }, [status, router]);

  return (
    <>
      <p>Đang xử lý kết quả thanh toán...</p>
    </>
  );
};

export default Payos;