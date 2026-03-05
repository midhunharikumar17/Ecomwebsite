import Order from "../models/Order.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// const razorpay = new Razorpay({
//   key_id:     process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

const razorpay = process.env.RAZORPAY_KEY_ID ? new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
}) : null;


/* ─────────────────────────────────────────
   CREATE ORDER + Razorpay order
   POST /api/orders
───────────────────────────────────────── */
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (!razorpay) {
  return res.status(500).json({ message: "Payment gateway not configured" });
}

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round(totalAmount * 100), // paise
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
    });

    // Save order to DB with Pending status
    const order = await Order.create({
      user:            req.user.id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      payment: {
        razorpay_order_id: razorpayOrder.id,
        status:            "Pending",
      },
    });

    res.status(201).json({ order, razorpayOrder });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   VERIFY PAYMENT
   POST /api/orders/verify-payment
───────────────────────────────────────── */
export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update order to Payment Success
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "Payment Success",
        payment: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status: "Paid",
        },
      },
      { new: true }
    );

    res.json({ message: "Payment verified", order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   GET USER'S ORDERS
   GET /api/orders
───────────────────────────────────────── */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 }); // newest first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   GET SINGLE ORDER
   GET /api/orders/:id
───────────────────────────────────────── */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Make sure user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};