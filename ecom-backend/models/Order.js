import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name:     { type: String,  required: true },
        price:    { type: Number,  required: true },
        quantity: { type: Number,  required: true },
        image:    { type: String,  default: "" },
      },
    ],

    shippingAddress: {
      address:  { type: String, required: true },
      city:     { type: String, required: true },
      state:    { type: String, required: true },
      pincode:  { type: String, required: true },
      phone:    { type: String, required: true },
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Payment Success", "Shipped", "Delivered"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      default: "Online",
    },

    payment: {
      razorpay_order_id:   { type: String },
      razorpay_payment_id: { type: String },
      razorpay_signature:  { type: String },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);