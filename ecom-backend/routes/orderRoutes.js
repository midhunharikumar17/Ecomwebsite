import express from "express";
import {
  createOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All order routes require login
router.post("/",               protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get("/",                protect, getUserOrders);
router.get("/:id",             protect, getOrderById);

export default router;