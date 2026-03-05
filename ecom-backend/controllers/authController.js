import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Single token generator using env secret, includes role
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ Safe user response — never expose password or internal fields
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

/* ======================
   REGISTER
====================== */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ FIX 7: Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ FIX 8: role defaults to "user" explicitly
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      user: sanitizeUser(user), // ✅ FIX 4: sanitized, no password
      token: generateToken(user), // ✅ FIX 6: role in token
    });

  } catch (error) {
    // ✅ FIX 5: try/catch on everything
    res.status(500).json({ message: error.message });
  }
};

/* ======================
   LOGIN
====================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ FIX 7: Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    const isMatch = user && (await bcrypt.compare(password, user.password));

    // ✅ FIX 9: Same message for both cases — no email enumeration
    if (!user || !isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      user: sanitizeUser(user), // ✅ FIX 4: sanitized
      token: generateToken(user), // ✅ FIX 6: role in token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ======================
   GET CURRENT USER
====================== */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};