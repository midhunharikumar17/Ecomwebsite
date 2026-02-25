import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import "./ProductDetails.css";

const ProductDetails = () => {

  const { id } = useParams();
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlistItems } = useContext(WishlistContext);

  const product = products.find((item) => item.id === Number(id));

  if (!product) return <h2>Product Not Found</h2>;

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  return (
    <div className="details-container">
      <div className="details-left">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="details-right">
        <h2>{product.name}</h2>
        <p className="price">₹{product.price}</p>
        <p className="description">{product.description}</p>

        <div className="details-buttons">
          <button className="cart-btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>

          <button
            className="wishlist-btn"
            onClick={() =>
              isWishlisted
                ? removeFromWishlist(product.id)
                : addToWishlist(product)
            }
          >
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;