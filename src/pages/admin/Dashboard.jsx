import { useEffect, useState } from "react";
import AdminLayout from "../../components/common/AdminLayout";
import axiosInstance from "../../services/axiosInstance";

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white rounded-xl shadow p-6 flex items-center gap-4 border-l-4 ${color}`}>
    <span className="text-3xl">{icon}</span>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <p className="text-gray-500">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Users"    value={stats.totalUsers}    icon="👥" color="border-blue-500" />
          <StatCard label="Total Products" value={stats.totalProducts} icon="📦" color="border-green-500" />
          <StatCard label="Total Orders"   value={stats.totalOrders}   icon="🛒" color="border-purple-500" />
          <StatCard label="Revenue"        value={`₹${stats.totalRevenue}`} icon="💰" color="border-yellow-500" />
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;