import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// NOTE: genAI is initialized INSIDE the function to ensure dotenv is loaded first

const searchProducts = async (query, maxPrice = null, minPrice = null) => {
  const filter = {};
  if (query && query.trim()) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }
  if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };
  if (minPrice) filter.price = { ...filter.price, $gte: minPrice };

  const products = await Product.find(filter)
    .populate("category", "name")
    .limit(5)
    .sort({ discount: -1 });

  return products.map((p) => ({
    id: p._id,
    name: p.name,
    description: p.description,
    price: p.price,
    discount: p.discount || 0,
    finalPrice: Math.round(p.price - (p.price * (p.discount || 0)) / 100),
    stock: p.stock,
    category: p.category?.name || "General",
    image: p.images?.[0] || null,
  }));
};

const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
  return orders.map((o) => ({
    id: o._id,
    status: o.status,
    total: o.totalAmount,
    date: o.createdAt.toLocaleDateString(),
    items: o.items?.length || 0,
  }));
};

export const chatWithBot = async (req, res) => {
  try {
    // ✅ Initialize INSIDE function — dotenv is guaranteed loaded by this point
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key inside function:", apiKey?.slice(0, 12));

    if (!apiKey) {
      return res.status(500).json({ reply: "Chatbot is not configured. Please contact support.", products: [] });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const { message, history = [] } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    if (!message) return res.status(400).json({ message: "Message is required" });

    let productContext = "";
    let orderContext = "";

    const productKeywords = ["product","buy","price","find","looking","want","need","show","recommend",
      "suggest","cheap","best","available","stock","electronics","clothing","books","home","beauty",
      "sports","under","below","above","headphone","phone","shirt","laptop","watch","shoes"];
    const orderKeywords = ["order","track","delivery","shipped","status","package","where","when"];

    const isProductQuery = productKeywords.some((k) => message.toLowerCase().includes(k));
    const isOrderQuery = orderKeywords.some((k) => message.toLowerCase().includes(k));

    if (isProductQuery) {
      const underMatch = message.match(/under\s*₹?\s*(\d+)/i) || message.match(/below\s*₹?\s*(\d+)/i);
      const aboveMatch = message.match(/above\s*₹?\s*(\d+)/i) || message.match(/more than\s*₹?\s*(\d+)/i);
      const maxPrice = underMatch ? parseInt(underMatch[1]) : null;
      const minPrice = aboveMatch ? parseInt(aboveMatch[1]) : null;

      const cleanQuery = message
        .replace(/under\s*₹?\s*\d+/gi, "").replace(/below\s*₹?\s*\d+/gi, "")
        .replace(/above\s*₹?\s*\d+/gi, "").replace(/less than\s*₹?\s*\d+/gi, "")
        .replace(/more than\s*₹?\s*\d+/gi, "")
        .replace(/show me|find|i want|i need|looking for|do you have|any/gi, "").trim();

      const products = await searchProducts(cleanQuery, maxPrice, minPrice);
      productContext = products.length > 0
        ? `\n\nPRODUCTS IN DATABASE:\n${products.map((p, i) =>
            `${i + 1}. ${p.name} | ₹${p.finalPrice}${p.discount > 0 ? ` (${p.discount}% off)` : ""} | Stock: ${p.stock > 0 ? p.stock + " available" : "Out of stock"} | Category: ${p.category}`
          ).join("\n")}`
        : "\n\nNo matching products found in database.";
    }

    if (isOrderQuery) {
      const orders = await getUserOrders(userId);
      orderContext = orders.length > 0
        ? `\n\nUSER ORDERS:\n${orders.map((o, i) =>
            `${i + 1}. Order #${o.id} | Status: ${o.status} | ₹${o.total} | ${o.date}`
          ).join("\n")}`
        : "\n\nUser has no orders.";
    }

    const prompt = `You are ShopBot, a friendly AI shopping assistant for ShopApp, an Indian e-commerce store.

RULES:
- Be concise (3-5 lines max unless listing products)
- Use ₹ for prices
- Only recommend products from the DATABASE DATA below — never make up products
- If no products found, say so and suggest browsing the store
- For product listings use format: "• Name — ₹Price (X% off)"
- Be warm and helpful

STORE INFO:
- Free delivery above ₹500, else ₹49
- Delivery: 3-7 business days
- Returns: 7 days from delivery
- Payments: Cards, UPI, Net Banking via Razorpay
- Refunds: 5-7 business days

USER NAME: ${userName}
${productContext}
${orderContext}

User message: ${message}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    // Return product cards for frontend
    let products = [];
    if (isProductQuery) {
      const underMatch = message.match(/under\s*₹?\s*(\d+)/i) || message.match(/below\s*₹?\s*(\d+)/i);
      const maxPrice = underMatch ? parseInt(underMatch[1]) : null;
      const cleanQuery = message.replace(/under\s*₹?\s*\d+/gi, "").replace(/below\s*₹?\s*\d+/gi, "").trim();
      products = await searchProducts(cleanQuery, maxPrice);
    }

    res.json({ reply, products });
  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({
      reply: "Sorry, I'm having trouble right now. Please try again! 🙏",
      products: [],
    });
  }
};