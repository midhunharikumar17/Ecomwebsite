import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,                          // ✅ FIX 5: strip whitespace
      minlength: [2, "Name must be at least 2 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,                          // ✅ FIX 5: strip whitespace
      lowercase: true,                     // ✅ FIX 4: normalize to lowercase
      match: [                             // ✅ FIX 2: format validation
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"], // ✅ FIX 3
      select: false,                       // ✅ FIX 6: never returned in queries by default
    },

    role: {                                // ✅ FIX 1: role field added
      type: String,
      enum: ["user", "admin"],             // only valid values accepted
      default: "user",
    },

    isActive: {                            // ✅ FIX 7: soft delete support
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ FIX 6: Extra safety — strip password from any JSON response globally
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);