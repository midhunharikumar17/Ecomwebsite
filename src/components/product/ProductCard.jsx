import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";
import "./ProductCard.css";

const StarRating = ({ rating = 4.2, count = 0 }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="pc-rating">
      <div className="pc-stars">
        {stars.map((s) => (
          <svg key={s} width="12" height="12" viewBox="0 0 24 24"
            fill={s <= Math.round(rating) ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="2"
            className={s <= Math.round(rating) ? "pc-star--filled" : "pc-star--empty"}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>
      <span className="pc-rating-num">{rating.toFixed(1)}</span>
      {count > 0 && <span className="pc-rating-count">({count})</span>}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((i) => i._id === product._id);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discountedPrice = Math.round(product.price - (product.price * (product.discount || 0)) / 100);
  const stockPercent = Math.min((product.stock / 50) * 100, 100);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="pc" draggable={false}>
      {/* Image */}
      <div className="pc__img-wrap">
        {!imgError ? (
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="pc__img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="pc__img-fallback">🛍️</div>
        )}

        {/* Overlay gradient */}
        <div className="pc__img-overlay" />

        {/* Badges */}
        <div className="pc__badges">
          {product.discount > 0 && (
            <span className="pc__badge pc__badge--discount">{product.discount}% OFF</span>
          )}
          {isOutOfStock && (
            <span className="pc__badge pc__badge--out">Out of Stock</span>
          )}
          {isLowStock && (
            <span className="pc__badge pc__badge--low">Only {product.stock} left!</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`pc__wishlist ${isWishlisted ? "pc__wishlist--active" : ""}`}
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
        >
          <svg width="17" height="17" viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="pc__body">
        <p className="pc__category">{product.category?.name || "General"}</p>
        <h3 className="pc__name">{product.name}</h3>

        <StarRating rating={product.rating || 4.2} count={product.reviewCount || 0} />

        {/* Price */}
        <div className="pc__pricing">
          <span className="pc__price">₹{discountedPrice.toLocaleString()}</span>
          {product.discount > 0 && (
            <div className="pc__price-meta">
              <span className="pc__original">₹{product.price.toLocaleString()}</span>
              <span className="pc__savings">Save ₹{(product.price - discountedPrice).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Stock bar */}
        {!isOutOfStock && (
          <div className="pc__stock">
            <div className="pc__stock-bar">
              <div className="pc__stock-fill" style={{ width: `${stockPercent}%` }} />
            </div>
            <span className="pc__stock-label">
              {isLowStock ? `🔥 Only ${product.stock} left` : `✓ In stock`}
            </span>
          </div>
        )}

        {/* Add to Cart */}
        <button
          className={`pc__btn ${added ? "pc__btn--added" : ""} ${isOutOfStock ? "pc__btn--disabled" : ""}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? (
            "Out of Stock"
          ) : added ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Added!
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;