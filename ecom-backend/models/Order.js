const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: Number,

    shippingAddress: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Payment Success", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);