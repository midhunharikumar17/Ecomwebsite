import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import "./models/Category.js";
import "./models/User.js";
import "./models/Product.js";
import "./models/Order.js";

dotenv.config();
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY ? "loaded ✅" : "missing ❌");

const app = express();
const httpServer = createServer(app);

// ── Socket.io setup ──────────────────────────────────────
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Track connected users: { userId -> socketId }
export const connectedUsers = new Map();
// Track connected admins: Set of socketIds
export const connectedAdmins = new Set();

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // User joins with their userId
  socket.on("user:join", (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    socket.join(`user:${userId}`);
    console.log(`👤 User ${userId} joined`);
  });

  // Admin joins
  socket.on("admin:join", () => {
    connectedAdmins.add(socket.id);
    socket.isAdmin = true;
    socket.join("admins");
    console.log(`🛡️ Admin joined: ${socket.id}`);
    // Send count of connected users to admin
    io.to("admins").emit("admin:stats", { onlineUsers: connectedUsers.size });
  });

  // ── Live Chat: User sends message ──
  socket.on("chat:user_message", (data) => {
    // data: { userId, userName, message }
    io.to("admins").emit("chat:user_message", {
      ...data,
      socketId: socket.id,
      timestamp: new Date(),
    });
  });

  // ── Live Chat: Admin replies ──
  socket.on("chat:admin_reply", (data) => {
    // data: { userId, message }
    io.to(`user:${data.userId}`).emit("chat:admin_reply", {
      message: data.message,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    if (socket.userId) connectedUsers.delete(socket.userId);
    if (socket.isAdmin) connectedAdmins.delete(socket.id);
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use("/api/", generalLimiter);
app.use("/api/auth", authLimiter);

// ── Routes ───────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// ── Global error handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// ── Start server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });