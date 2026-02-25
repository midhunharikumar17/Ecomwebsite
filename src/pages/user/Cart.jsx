import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

const Cart = () => {

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
  } = useContext(CartContext);


  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <h3>Cart is empty</h3>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} style={{ marginBottom: "20px" }}>
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => decreaseQuantity(item.id)}>-</button>

                <span>{item.quantity}</span>

                <button onClick={() => increaseQuantity(item.id)}>+</button>
              </div>


              <button onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}

          <h2>Total: ₹{totalPrice}</h2>
        </>
      )}
    </div>
  );
};

export default Cart;
