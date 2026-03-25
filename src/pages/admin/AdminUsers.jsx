import { useEffect, useState } from "react";
import AdminLayout from "../../components/common/AdminLayout";
import axiosInstance from "../../services/axiosInstance";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/users");
      setUsers(data);
    } finally { setLoading(false); }
  };

  const toggleStatus = async (userId, currentStatus) => {
    setUpdating(userId);
    try {
      await axiosInstance.put(`/admin/users/${userId}`, { isActive: !currentStatus });
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isActive: !currentStatus } : u));
    } catch { alert("Failed to update user"); }
    finally { setUpdating(null); }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Users">
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input className="admin-input" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 300 }} />
        <span style={{ marginLeft: "auto", color: "#64748b", fontSize: 13 }}>{filtered.length} users</span>
      </div>

      <div className="admin-card">
        {loading ? <div className="admin-loading">Loading users...</div> : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#ff9900,#ff6600)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "white", flexShrink: 0 }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "#94a3b8", fontSize: 13 }}>{user.email}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${user.role === "admin" ? "orange" : "blue"}`}
                        style={user.role === "admin" ? { background: "rgba(255,153,0,0.12)", color: "#ff9900" } : {}}>
                        {user.role}
                      </span>
                    </td>
                    <td><span className={`admin-badge admin-badge--${user.isActive !== false ? "green" : "red"}`}>{user.isActive !== false ? "Active" : "Inactive"}</span></td>
                    <td style={{ color: "#64748b", fontSize: 12 }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className={`admin-btn ${user.isActive !== false ? "admin-btn--danger" : "admin-btn--ghost"}`}
                        onClick={() => toggleStatus(user._id, user.isActive !== false)}
                        disabled={updating === user._id || user.role === "admin"}
                        style={{ padding: "6px 14px", fontSize: 12 }}
                      >
                        {updating === user._id ? "..." : user.isActive !== false ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="admin-empty">No users found</div>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;