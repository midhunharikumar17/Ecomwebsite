import { useEffect, useState } from "react";
import AdminLayout from "../../components/common/AdminLayout";
import axiosInstance from "../../services/axiosInstance";
import "./Dashboard.css";

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className={`stat-card stat-card--${color}`}>
    <div className="stat-card__icon">{icon}</div>
    <div className="stat-card__body">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {sub && <p className="stat-card__sub">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/stats");
        setStats(data);
        const ordersRes = await axiosInstance.get("/admin/orders");
        setRecentOrders((ordersRes.data.orders || ordersRes.data)?.slice(0, 5) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusColor = (s) => {
    const map = { "Pending": "yellow", "Payment Success": "blue", "Shipped": "purple", "Delivered": "green", "Cancelled": "red" };
    return map[s] || "gray";
  };

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="admin-loading">Loading dashboard...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="dashboard__stats">
            <StatCard label="Total Revenue" value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
              color="orange" sub="All time"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} />
            <StatCard label="Total Orders" value={stats?.totalOrders || 0}
              color="blue" sub="All time"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} />
            <StatCard label="Total Users" value={stats?.totalUsers || 0}
              color="green" sub="Registered"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>} />
            <StatCard label="Total Products" value={stats?.totalProducts || 0}
              color="purple" sub="In store"
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>} />
          </div>

          {/* Recent Orders */}
          <div className="admin-card" style={{ marginTop: 28 }}>
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">Recent Orders</h2>
            </div>
            {recentOrders.length === 0 ? (
              <div className="admin-empty">No orders yet</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td><span style={{ fontFamily: "monospace", fontSize: 12, color: "#94a3b8" }}>#{order._id?.slice(-8)}</span></td>
                        <td>{order.user?.name || "—"}</td>
                        <td><strong>₹{order.totalAmount?.toFixed(0)}</strong></td>
                        <td><span className={`admin-badge admin-badge--${statusColor(order.status)}`}>{order.status}</span></td>
                        <td style={{ color: "#64748b", fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;