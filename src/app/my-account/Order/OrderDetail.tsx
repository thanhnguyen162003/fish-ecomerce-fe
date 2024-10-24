"use client";

import { useState } from "react";

interface OrderDetail {
  id: string;
  name: string;
  img: string;
  quantity: number;
  productPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  status: string;
  total: string;
}

const orderDetail1: OrderDetail = {
  id: "ORD001",
  name: "product1",
  img: "https://example.com/product1.jpg",
  quantity: 2,
  productPrice: 25,
  totalPrice: 50,
};

const orderDetail2: OrderDetail = {
  id: "ORD002",
  name: "product2",
  img: "https://example.com/product2.jpg",
  quantity: 1,
  productPrice: 100,
  totalPrice: 100,
};

const orderDetail3: OrderDetail = {
  id: "ORD003",
  name: "product3",
  img: "https://example.com/product3.jpg",
  quantity: 3,
  productPrice: 25,
  totalPrice: 75,
};

const orderDetail4: OrderDetail = {
  id: "ORD004",
  name: "product4",
  img: "https://example.com/product4.jpg",
  quantity: 4,
  productPrice: 50,
  totalPrice: 200,
};

const orderDetail5: OrderDetail = {
  id: "ORD005",
  name: "product5",
  img: "https://example.com/product5.jpg",
  quantity: 5,
  productPrice: 50,
  totalPrice: 250,
};

export const OrderDetail = () => {
  const order: Order = {
    id: "OR001",
    status: "PAID",
    total: "1000",
  };

  const [orderDetailList, setOrderDetailList] = useState<OrderDetail[]>([
    orderDetail1,
    orderDetail2,
    orderDetail3,
    orderDetail4,
    orderDetail5,
  ]);

  return (
    <div className="container mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Order details</h1>
      <div className="order_detail_list">
        {orderDetailList.map((od) => (
          <div
            key={od.id}
            className="order_detail flex justify-between p-4 hover:bg-[#f2f3f4] border-t border-[#b3b6b7]"
          >
            <div className="flex gap-4 items-center">
              {/*Thay the div co ten img lai thanh the img xong xoa bg-black di, them src cho the img. config h voi w lai theo nhu cau */}
              <div className=" img bg-black h-[75px] w-[75px]"></div>
              <h1>{od.name}</h1>
            </div>
            <div className="flex flex-col gap-4">
              <h1>
                {od.quantity} x {od.productPrice}
              </h1>
              <h1 className="font-semibold">{od.totalPrice}VND</h1>
            </div>
          </div>
        ))}
      </div>
      <div className="Delivery flex flex-col space-y-4 p-4 border-t border-[#b3b6b7]">
        <h1 className="text-2xl font-bold">Delivery</h1>
        <h1>Country city disrict street number 8386</h1>
      </div>
      <div className="Order_summary space-y-4 p-4 border-t border-[#b3b6b7]">
        <h1 className="text-2xl font-bold">Order information</h1>
        <div className="flex justify-between">
          <h1>Order code:</h1>
          <h1>{order.id}</h1>
        </div>
        <div className="flex justify-between">
          <h1>Status:</h1>
          <h1>{order.status}</h1>
        </div>
        <div className="flex justify-between">
          <h1>Total:</h1>
          <h1>{order.total}VND</h1>
        </div>
      </div>
    </div>
  );
};
