import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],   // ✅ FIX 5
    },

    discount: {                               // ✅ FIX 2: missing from PRD
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    stock: {                                  // ✅ FIX 2: missing from PRD
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    category: {                               // ✅ FIX 2: missing from PRD
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    images: [                                 // ✅ FIX 3: array, not single string
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }                        // ✅ FIX 4
);

export default mongoose.model("Product", productSchema);