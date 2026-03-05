import { useEffect, useState } from "react";
import AdminLayout from "../../components/common/AdminLayout";
import axiosInstance from "../../services/axiosInstance";

const STATUS_OPTIONS = ["Pending", "Payment Success", "Shipped", "Delivered"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/orders");
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map((o) =>
        o._id === orderId ? { ...o, status: newStatus } : o
      ));
    } catch {
      alert("Failed to update order status");
    }
  };

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
    <AdminLayout title="Manage Orders">
      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 && (
            <p className="text-center py-10 text-gray-500">No orders yet</p>
          )}
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-mono text-sm font-semibold">{order._id}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Customer: {order.user?.name} ({order.user?.email})
                  </p>
                </div>

                {/* Status dropdown */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className={`text-sm px-3 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColor(order.status)}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 mb-3">
                {order.items?.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between border-t pt-3 text-sm">
                <span className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="font-bold text-blue-600">
                  ₹{order.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;