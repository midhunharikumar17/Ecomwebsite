import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

//get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// // GET single product
// router.get("/:id", async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   res.json(product);
// });

// // CREATE product (for testing)
// router.post("/", async (req, res) => {
//   const newProduct = new Product(req.body);
//   const saved = await newProduct.save();
//   res.json(saved);
// });

export default router;