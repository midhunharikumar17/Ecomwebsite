import express from "express";
import { chatWithBot } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, chatWithBot);

export default router;