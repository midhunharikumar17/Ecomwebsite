import User    from "../models/User.js";
import Product from "../models/Product.js";
import Order   from "../models/Order.js";

/* ─────────────────────────────────────────
   GET DASHBOARD STATS
   GET /api/admin/stats
───────────────────────────────────────── */
export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.find(),
    ]);

    const totalOrders  = orders.length;
    const totalRevenue = orders
      .filter((o) => o.payment.status === "Paid")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({ totalUsers, totalProducts, totalOrders, totalRevenue });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   GET ALL ORDERS (Admin)
   GET /api/admin/orders
───────────────────────────────────────── */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   UPDATE ORDER STATUS (Admin)
   PUT /api/admin/orders/:id
───────────────────────────────────────── */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   GET ALL USERS (Admin)
   GET /api/admin/users
───────────────────────────────────────── */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   TOGGLE USER ACTIVE STATUS (Admin)
   PUT /api/admin/users/:id
───────────────────────────────────────── */
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};