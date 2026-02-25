import { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

  const [products] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 2499,
      image: "https://picsum.photos/400?1",
      description: "Noise cancellation headphones with premium sound quality."
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 3999,
      image: "https://picsum.photos/400?2",
      description: "Track fitness, heart rate and notifications."
    },
    {
      id: 3,
      name: "Gaming Mouse",
      price: 1499,
      image: "https://picsum.photos/400?3",
      description: "High precision gaming mouse with RGB lighting."
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      price: 1999,
      image: "https://picsum.photos/400?4",
      description: "Portable speaker with deep bass and long battery."
    },
    {
      id: 5,
      name: "Mechanical Keyboard",
      price: 4599,
      image: "https://picsum.photos/400?5",
      description: "Mechanical keyboard with tactile feedback."
    },
    {
      id: 6,
      name: "Laptop Stand",
      price: 899,
      image: "https://picsum.photos/400?6",
      description: "Ergonomic aluminum laptop stand."
    },
  ]);

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};