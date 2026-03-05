import jwt from "jsonwebtoken";                          // ✅ FIX 1: ESM

// ✅ Protect any authenticated route
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ FIX 2: Explicitly check for Bearer prefix
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    // ✅ FIX 4 & 5: Distinguish expired vs invalid
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ FIX 3: Separate admin guard middleware
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};