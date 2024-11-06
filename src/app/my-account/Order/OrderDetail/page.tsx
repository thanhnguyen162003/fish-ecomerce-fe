"use client"
import { GetOrdertAPI, Order } from "@/components/api/order/order";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import BreadcrumbProduct from "@/components/Breadcrumb/BreadcrumbProduct";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface responseOrder {
    status: number,
    message: string | undefined,
    data: Order
}

const OrderDetail = () => {  
    
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    
  const [orderDetailList, setOrderDetailList] = useState<Order | null>(null);
const router = useRouter()
  useEffect(() => {
    const orderParam = searchParams.get("orderCode") as string;    
    const fetchData = async () => {
        const token = getWithExpiry('jwtToken');
  
        if (!token) {
            router.push('/login');
            return;
        }
        try {
            setIsLoading(true);
            if (orderParam) {
                const data = await GetOrdertAPI(token, orderParam);                            
            setOrderDetailList(data.data as Order);
            }
            
        } catch (error) {
            console.error('Error fetching customer data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData()    
  }, [searchParams]);

  const getWithExpiry = (key: string) => {
    const itemStr = localStorage.getItem(key);

    // If the item doesn't exist, return null
    if (!itemStr) {
        return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // If the item has expired, remove it and return null
    if (now.getTime() > item.expiry) {
        toast.info("Phiên đăng nhập đã hết hạn");
        localStorage.removeItem(key);
        return null;
    }

    return item.value;
};
if (isLoading == true) {
    return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
</div>;
}
    return (
        <>
        <div id="header" className='relative w-full'>
                <Breadcrumb heading="Order Detail" />
            </div>
      <div className="container mx-auto space-y-4">
        <h1 className="text-2xl font-bold">{orderDetailList?.orderDate}</h1>
        <div className="order_detail_list">
          {orderDetailList?.orderDetails && orderDetailList?.orderDetails.map((od, index) => (
            <div
              key={index}
              className="order_detail flex justify-between p-4 hover:bg-[#f2f3f4] border-t border-[#b3b6b7]"
            >
              <div className="flex gap-4 items-center">
                {/*Thay the div co ten img lai thanh the img xong xoa bg-black di, them src cho the img. config h voi w lai theo nhu cau */}
                <div className=" img bg-black h-[75px] w-[75px]"></div>
                <h1>{od.productName}</h1>
              </div>
              <div className="flex flex-col gap-4">
                <h1>
                  {od.quantity} x {od.unitPrice.toLocaleString("vi-VI")} VND
                </h1>
                <h1 className="font-semibold">{od.totalPrice.toLocaleString("vi-VI")} VND</h1>
              </div>
            </div>
          ))}
        </div>
        <div className="Delivery flex flex-col space-y-4 p-4 border-t border-[#b3b6b7]">
          <h1 className="text-2xl font-bold">Delivery</h1>
          {/* <h1>Country city disrict street number 8386</h1> */}
          <h1>{orderDetailList?.shipAddress}</h1>
        </div>
        <div className="Order_summary space-y-4 p-4 border-t border-[#b3b6b7]">
          <h1 className="text-2xl font-bold">Order information</h1>
          <div className="flex justify-between">
            <h1>Order code:</h1>
            <h1>{orderDetailList?.orderCode}</h1>
          </div>
          <div className="flex justify-between">
            <h1>Status:</h1>
            <h1>{orderDetailList?.status}</h1>
          </div>
          <div className="flex justify-between">
            <h1>Total:</h1>
            <h1>{orderDetailList?.totalPrice.toLocaleString("vi-VI")} VND</h1>
          </div>
        </div>
      </div>
      </>
    );
  };
  export default OrderDetail