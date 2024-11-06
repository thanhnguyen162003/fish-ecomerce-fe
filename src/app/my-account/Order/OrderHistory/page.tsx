"use client";
import { repayOrder } from "@/components/api/order/checkout";
import { GetOrderListAPI, Order } from "@/components/api/order/order";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrderHistory = () => {
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
const [pageSize, setPageSize] = useState(9);
const [pageNumber, setPageNumber] = useState(1);

  const [orders, setOrders] = useState<Order[]>();
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  console.log("Order history");
  useEffect(() => {
    const fetchData = async () => {
      const token = getWithExpiry('jwtToken');

      if (!token) {
          router.push('/login');
          return;
      }

      try {
          setIsLoading(true);
          const data = await GetOrderListAPI(token, pageSize, pageNumber);
          console.log(data);
          
          setOrders(data as Order[]);
          
      } catch (error) {
          console.error('Error fetching customer data:', error);
      } finally {
          setIsLoading(false);
      }
  };
  fetchData()
  }, [pageNumber, pageSize])

const handleDetail = (order: Order) => {
  const orderJson = JSON.stringify({ order });
  router.push(`/my-account/Order/OrderDetail?orderCode=${order.orderCode}`);
}

const handlePay = async (order: Order) => {
  var token = getWithExpiry("jwtToken");

    if (!token) {
      router.push("/login");
      return;
    }
    setIsLoading(true)
    if (token && order?.orderCode) {
      var response = await repayOrder(order.orderCode,token);
      if (typeof response === "string" && response.includes("payos")) {
        window.location.href = response;
      } else {
        toast.error(response);
      }
    } else {
      router.push("/login");
    }
}
   if (isLoading == true) {
        return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
    </div>;
    }
  return (
    <>
    <div id="header" className='relative w-full'>
                <Breadcrumb heading="Order History" />
            </div>
    <div className="container mx-auto">
      {/* <h1 className="text-2xl font-bold mb-4">Order History</h1> */}
      {orders && orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table
          className="table-auto w-full border-separate"
          style={{ borderSpacing: "0 10px" }}
        >
          <thead>
            <tr className="bg-[#4d7fff] text-white rounded-xl">
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Order Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.map((order, index) => (
              <tr key={order.orderCode} className="border-t">
                <td className="px-4 py-2 rounded-l-xl">{order.orderCode}</td>
                <td className="px-4 py-2">{order.orderDate}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">{order.totalPrice.toLocaleString("vi-VI")} VND</td>
                <td className="px-4 py-2 rounded-r-xl flex items-center">
                  <div className="flex space-x-4">
                    <button
                      style={{
                        backgroundColor: "#1E81B0", // Ocean Blue
                        color: "#FFFFFF", // White text
                        padding: "8px 16px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseOver={
                        (e) =>
                          (e.currentTarget.style.backgroundColor = "#15638B") // Darker blue on hover
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1E81B0")
                      }
                      onClick={(e) => handleDetail(order)}
                    >
                      Chi Tiết
                    </button>
                    <button
                      style={{
                        backgroundColor: "#DB4444", // Red
                        color: "#FFFFFF", // White text
                        padding: "8px 16px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseOver={
                        (e) =>
                          (e.currentTarget.style.backgroundColor = "#B33636") // Darker red on hover
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#DB4444")
                      }
onClick={() => handlePay(order)}
                    >
                      Thanh toán
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
};
export default OrderHistory