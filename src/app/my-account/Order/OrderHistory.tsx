"use client";
import { useState } from "react";

export const OrderHistory = () => {
  interface Order {
    id: string;
    status: string;
    total: string;
  }

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      status: "Delivered",
      total: "$100",
    },
    {
      id: "ORD002",
      status: "Pending",
      total: "$150",
    },
    {
      id: "ORD003",
      status: "Shipped",
      total: "$120",
    },
  ]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table
          className="table-auto w-full border-separate"
          style={{ borderSpacing: "0 10px" }}
        >
          <thead>
            <tr className="bg-[#4d7fff] text-white rounded-xl">
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-2 rounded-l-xl">{order.id}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">{order.total}</td>
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
                    >
                      Edit
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
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
