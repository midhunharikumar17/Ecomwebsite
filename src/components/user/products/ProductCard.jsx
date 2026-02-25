import "./ProductCard.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { WishlistContext } from "../../../context/WishlistContext";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlistItems } =
    useContext(WishlistContext);

  const isWishlisted = wishlistItems?.some(
    (item) => item.id === product.id
  );

  return (
    <div className="product-card">

      {/* ONLY IMAGE IS CLICKABLE */}
      <Link to={`/product/${product.id}`} className="product-image">
        <img src={product.image} alt={product.name} />
      </Link>

      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-name">
          <h3>{product.name}</h3>
        </Link>

        <p className="price">₹{product.price}</p>

        <div className="product-actions">

          <button
            className="cart-btn"
            onClick={() => addToCart(product)}
          >
            <FaShoppingCart /> Add
          </button>

          <button
            className="wishlist-btn"
            onClick={() =>
              isWishlisted
                ? removeFromWishlist(product.id)
                : addToWishlist(product)
            }
          >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;