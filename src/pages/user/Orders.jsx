import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import Navbar from "../../components/common/Navbar";

// ✅ FIX 1: Correct component name
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FIX 2: Actually fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/orders");
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Status badge color
  const statusColor = (status) => {
    switch (status) {
      case "Pending":         return "bg-yellow-100 text-yellow-700";
      case "Payment Success": return "bg-blue-100 text-blue-700";
      case "Shipped":         return "bg-purple-100 text-purple-700";
      case "Delivered":       return "bg-green-100 text-green-700";
      default:                return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

        {loading && (
          <p className="text-center text-gray-500">Loading orders...</p>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No orders yet</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-6"
            >
              {/* Order header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono text-sm font-semibold">{order._id}</p>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Order items */}
              <div className="space-y-2 mb-4">
                {order.items?.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-700">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Order footer */}
              <div className="flex justify-between items-center border-t pt-4">
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="font-bold text-blue-600">
                  Total: ₹{order.totalAmount?.toFixed(2)}
                </p>
              </div>

              {/* Shipping info */}
              {order.shippingAddress && (
                <div className="mt-3 text-sm text-gray-500 border-t pt-3">
                  📦 Shipping to: {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.state} —{" "}
                  {order.shippingAddress.pincode}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;