import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

//chatbot
import Chatbot from "./components/common/Chatbot";
//footer
import Footer from "./components/common/Footer";
// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/user/Home";
import ProductDetails from "./pages/user/ProductDetails";
import Cart from "./pages/user/Cart";
import Wishlist from "./pages/user/Wishlist";
import Orders from "./pages/user/Orders";
import Checkout from "./pages/user/Checkout"; // Add this page

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/AdminProducts";
import ManageOrders from "./pages/admin/AdminOrders";
import ManageUsers from "./pages/admin/AdminUsers";

import NotFound from "./pages/NotFound"; // Add this page

// ✅ FIX 1: Moved outside App to prevent recreation on every render
const ProtectedRoute = ({ children, isAuthenticated, isLoading }) => {
  if (isLoading) return <div>Loading...</div>; // ✅ FIX 3: Handle hydration
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children, isAuthenticated, user, isLoading }) => {
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role?.toLowerCase() !== "admin") { // ✅ FIX 4: Normalize role
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

  return (
    <div>
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <Home />
        </ProtectedRoute>
      } />

      <Route path="/product/:id" element={
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <ProductDetails />
        </ProtectedRoute>
      } />

      <Route path="/cart" element={
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <Cart />
        </ProtectedRoute>
      } />

      <Route path="/wishlist" element={
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <Wishlist />
        </ProtectedRoute>
      } />

      <Route path="/orders" element={
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <Orders />
        </ProtectedRoute>
      } />

      {/* ✅ FIX 5: Added missing Checkout route */}
      <Route path="/checkout" element={
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
          <Checkout />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
          <AdminDashboard />
        </AdminRoute>
      } />

      <Route path="/admin/products" element={
        <AdminRoute isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
          <Products />
        </AdminRoute>
      } />

      <Route path="/admin/orders" element={
        <AdminRoute isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
          <ManageOrders />
        </AdminRoute>
      } />

      <Route path="/admin/users" element={
        <AdminRoute isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
          <ManageUsers />
        </AdminRoute>
      } />

      {/* ✅ FIX 2 & 6: Proper fallback with real 404 page */}
      <Route path="*" element={<NotFound />} />

     
    </Routes>
    <Footer />
    {isAuthenticated && <Chatbot />}
    </div>
  );
};

export default App;