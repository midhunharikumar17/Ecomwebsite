import { createContext, useState, useEffect } from "react";


// create context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ADD TO CART
  const addToCart = (product) => {

    const existingItem = cartItems.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      // increase quantity
      const updatedCart = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedCart);
    } else {
      // add new item
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // REMOVE ITEM
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
  };

  // INCREASE QUANTITY
const increaseQuantity = (id) => {
  const updatedCart = cartItems.map((item) =>
    item.id === id
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );
  setCartItems(updatedCart);
};

// DECREASE QUANTITY
const decreaseQuantity = (id) => {
  const updatedCart = cartItems.map((item) =>
    item.id === id && item.quantity > 1
      ? { ...item, quantity: item.quantity - 1 }
      : item
  );
  setCartItems(updatedCart);
};

  return (
   <CartContext.Provider
  value={{
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
  }}
>

      {children}
    </CartContext.Provider>
  );
};
