import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";


// Add this line with your other imports in server.js
import "./models/Category.js";
import "./models/User.js";
import "./models/Product.js";
import "./models/Order.js";

// Routes
import authRoutes    from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes   from "./routes/orderRoutes.js";
import adminRoutes   from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// ── Rate Limiting ───────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use("/api/", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, please try again later.",
});

// ── Routes ──────────────────────────────────────────────
app.get("/", (req, res) => res.send("API Running..."));

app.use("/api/auth",     authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/admin",    adminRoutes);

// ── Global Error Handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ── Connect DB then Start Server ────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(
      process.env.PORT || 5000,
      () => console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });