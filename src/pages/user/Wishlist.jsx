import { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import { Link } from "react-router-dom";

const Wishlist = () => {

  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <h3>No items in wishlist</h3>
      ) : (
        wishlistItems.map((item) => (
          <div key={item.id} style={{ marginBottom: "20px" }}>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>

            <Link to={`/product/${item.id}`}>
              <button>View Product</button>
            </Link>

            <button
              onClick={() => removeFromWishlist(item.id)}
              style={{ marginLeft: "10px" }}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
