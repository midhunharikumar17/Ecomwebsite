import { useEffect, useState } from "react";
import AdminLayout from "../../components/common/AdminLayout";
import axiosInstance from "../../services/axiosInstance";
import { io } from "socket.io-client";

const STATUSES = ["Pending", "Payment Success", "Shipped", "Delivered", "Cancelled"];

const statusColor = (s) => {
  const map = { "Pending": "yellow", "Payment Success": "blue", "Shipped": "purple", "Delivered": "green", "Cancelled": "red" };
  return map[s] || "gray";
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
    // Socket for real-time order notifications
    const socket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000");
    socket.emit("admin:join");
    return () => socket.disconnect();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/orders");
      setOrders(data.orders || data);
    } finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await axiosInstance.put(`/admin/orders/${orderId}`, { status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      alert("Failed to update status");
    } finally { setUpdating(null); }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o._id?.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout title="Orders">
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input className="admin-input" placeholder="Search by order ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 300 }} />
        <select className="admin-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span style={{ marginLeft: "auto", color: "#64748b", fontSize: 13 }}>{filtered.length} orders</span>
      </div>

      <div className="admin-card">
        {loading ? <div className="admin-loading">Loading orders...</div> : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Date</th><th>Update Status</th></tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order._id}>
                    <td><span style={{ fontFamily: "monospace", fontSize: 12, color: "#94a3b8" }}>#{order._id?.slice(-8)}</span></td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 500 }}>{order.user?.name || "—"}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{order.user?.email}</div>
                      </div>
                    </td>
                    <td><span className="admin-badge admin-badge--gray">{order.items?.length || 0} items</span></td>
                    <td><strong style={{ color: "#f1f5f9" }}>₹{order.totalAmount?.toFixed(0)}</strong></td>
                    <td><span className={`admin-badge admin-badge--${statusColor(order.status)}`}>{order.status}</span></td>
                    <td style={{ color: "#64748b", fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        className="admin-select"
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        disabled={updating === order._id}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="admin-empty">No orders found</div>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;