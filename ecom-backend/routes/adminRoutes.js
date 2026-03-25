import express from "express";
import { getStats, getAllOrders, updateOrderStatus, getAllUsers, updateUserStatus, getCategories } from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/stats", getStats);
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);
router.get("/users", getAllUsers);
router.put("/users/:id", updateUserStatus);
router.get("/categories", getCategories);

export default router;