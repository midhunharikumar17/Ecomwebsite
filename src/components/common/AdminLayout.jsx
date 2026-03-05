// src/components/common/AdminLayout.jsx
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const AdminLayout = ({ children, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">ShopApp Admin</h1>
          <p className="text-xs text-gray-400 mt-1">{user?.name}</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/admin"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
            📊 Dashboard
          </Link>
          <Link to="/admin/products"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
            📦 Products
          </Link>
          <Link to="/admin/orders"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
            🛒 Orders
          </Link>
          <Link to="/admin/users"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
            👥 Users
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;