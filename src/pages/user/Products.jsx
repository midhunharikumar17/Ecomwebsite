import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import "./Products.css";

const Products = () => {
  const { filteredProducts } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  return (
    <div className="products-container">
      <h1 className="page-title">All Products</h1>

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-products">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/400x300?text=No+Image")
                  }
                />
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">₹ {product.price}</p>
              </div>

              <div className="product-buttons">
                <button
                  className="btn-primary"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => addToWishlist(product)}
                >
                  Wishlist
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;