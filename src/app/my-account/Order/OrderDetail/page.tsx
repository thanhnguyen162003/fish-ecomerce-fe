"use client"
import { Order } from "@/components/api/order/order";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OrderDetail = () => {  
    
    const [orderDetailList, setOrderDetailList] = useState<Order>();
    const router = useRouter();
    useEffect(() => {
        if (router.query.order) {
          const order = JSON.parse(decodeURIComponent(router.query.order as string));
          setOrderDetailList(order);
        }
      }, [router.query]);

    return (
    //   <div className="container mx-auto space-y-4">
    //     <h1 className="text-2xl font-bold">Order details</h1>
    //     <div className="order_detail_list">
    //       {orderDetailList.map((od) => (
    //         <div
    //           key={od.id}
    //           className="order_detail flex justify-between p-4 hover:bg-[#f2f3f4] border-t border-[#b3b6b7]"
    //         >
    //           <div className="flex gap-4 items-center">
    //             {/*Thay the div co ten img lai thanh the img xong xoa bg-black di, them src cho the img. config h voi w lai theo nhu cau */}
    //             <div className=" img bg-black h-[75px] w-[75px]"></div>
    //             <h1>{od.name}</h1>
    //           </div>
    //           <div className="flex flex-col gap-4">
    //             <h1>
    //               {od.quantity} x {od.productPrice}
    //             </h1>
    //             <h1 className="font-semibold">{od.totalPrice}VND</h1>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //     <div className="Delivery flex flex-col space-y-4 p-4 border-t border-[#b3b6b7]">
    //       <h1 className="text-2xl font-bold">Delivery</h1>
    //       <h1>Country city disrict street number 8386</h1>
    //     </div>
    //     <div className="Order_summary space-y-4 p-4 border-t border-[#b3b6b7]">
    //       <h1 className="text-2xl font-bold">Order information</h1>
    //       <div className="flex justify-between">
    //         <h1>Order code:</h1>
    //         <h1>{order.id}</h1>
    //       </div>
    //       <div className="flex justify-between">
    //         <h1>Status:</h1>
    //         <h1>{order.status}</h1>
    //       </div>
    //       <div className="flex justify-between">
    //         <h1>Total:</h1>
    //         <h1>{order.total}VND</h1>
    //       </div>
    //     </div>
    //   </div>
    <></>
    );
  };
  export default OrderDetail