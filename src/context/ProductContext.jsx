import { createContext, useEffect, useState, useMemo } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log("API Error:", err));
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <ProductContext.Provider
      value={{ products, filteredProducts, searchTerm, setSearchTerm }}
    >
      {children}
    </ProductContext.Provider>
  );
};