import express from "express";
import {
  getStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserStatus,
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require login + admin role
router.get("/stats",          protect, isAdmin, getStats);
router.get("/orders",         protect, isAdmin, getAllOrders);
router.put("/orders/:id",     protect, isAdmin, updateOrderStatus);
router.get("/users",          protect, isAdmin, getAllUsers);
router.put("/users/:id",      protect, isAdmin, updateUserStatus);

export default router;