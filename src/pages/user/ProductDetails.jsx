import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";
import axiosInstance from "../../services/axiosInstance";
import Navbar from "../../components/common/Navbar";
import "./ProductDetails.css";

const StarRating = ({ rating = 4.2 }) => (
  <div className="pd-stars">
    {[1,2,3,4,5].map((s) => (
      <svg key={s} width="16" height="16" viewBox="0 0 24 24"
        fill={s <= Math.round(rating) ? "#ff9900" : "none"}
        stroke={s <= Math.round(rating) ? "#ff9900" : "#334155"}
        strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
    <span className="pd-stars-num">{rating.toFixed(1)}</span>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="pd-loading">
        <div className="pd-loading__img" />
        <div className="pd-loading__body">
          <div className="pd-loading__line pd-loading__line--short" />
          <div className="pd-loading__line" />
          <div className="pd-loading__line pd-loading__line--med" />
          <div className="pd-loading__line pd-loading__line--short" />
        </div>
      </div>
    </>
  );

  if (error || !product) return (
    <>
      <Navbar />
      <div className="pd-error">
        <span className="pd-error__icon">🔍</span>
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/")}>Back to Shop</button>
      </div>
    </>
  );

  const isWishlisted = wishlistItems.some((i) => i._id === product._id);
  const discountedPrice = Math.round(product.price - (product.price * (product.discount || 0)) / 100);
  const savings = product.price - discountedPrice;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;
  const stockPercent = Math.min((product.stock / 50) * 100, 100);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    if (isWishlisted) dispatch(removeFromWishlist(product._id));
    else dispatch(addToWishlist(product));
  };

  const images = product.images?.length > 0 ? product.images : ["/placeholder.png"];

  return (
    <div className="pd-page">
      <Navbar />

      <div className="pd-wrapper">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <span onClick={() => navigate("/")} className="pd-breadcrumb__link">Home</span>
          <span className="pd-breadcrumb__sep">›</span>
          <span className="pd-breadcrumb__link">{product.category?.name || "Products"}</span>
          <span className="pd-breadcrumb__sep">›</span>
          <span className="pd-breadcrumb__current">{product.name}</span>
        </nav>

        <div className="pd-main">
          {/* ── Left: Images ── */}
          <div className="pd-images">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumb ${selectedImage === i ? "pd-thumb--active" : ""}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i+1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="pd-img-main">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="pd-img-main__img"
              />
              {product.discount > 0 && (
                <div className="pd-img-badge">{product.discount}% OFF</div>
              )}
              {isOutOfStock && (
                <div className="pd-img-out">Out of Stock</div>
              )}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="pd-info">
            <p className="pd-category">{product.category?.name || "General"}</p>
            <h1 className="pd-name">{product.name}</h1>

            <StarRating rating={product.rating || 4.2} />

            {/* Price */}
            <div className="pd-pricing">
              <span className="pd-price">₹{discountedPrice.toLocaleString()}</span>
              {product.discount > 0 && (
                <div className="pd-price-meta">
                  <span className="pd-original">₹{product.price.toLocaleString()}</span>
                  <span className="pd-discount-tag">{product.discount}% OFF</span>
                </div>
              )}
            </div>

            {product.discount > 0 && (
              <div className="pd-savings">
                🎉 You save <strong>₹{savings.toLocaleString()}</strong> on this order!
              </div>
            )}

            {/* Description */}
            <p className="pd-description">{product.description}</p>

            {/* Divider */}
            <div className="pd-divider" />

            {/* Stock */}
            <div className="pd-stock">
              <div className="pd-stock__bar">
                <div className="pd-stock__fill" style={{ width: `${stockPercent}%`,
                  background: isLowStock ? "linear-gradient(90deg,#ef4444,#dc2626)" : "linear-gradient(90deg,#22c55e,#16a34a)"
                }} />
              </div>
              <span className={`pd-stock__label pd-stock__label--${isOutOfStock ? "out" : isLowStock ? "low" : "in"}`}>
                {isOutOfStock ? "❌ Out of Stock" : isLowStock ? `🔥 Only ${product.stock} items left!` : `✓ In Stock (${product.stock} available)`}
              </span>
            </div>

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="pd-quantity">
                <span className="pd-quantity__label">Qty:</span>
                <div className="pd-quantity__ctrl">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="pd-actions">
              <button
                className={`pd-btn-cart ${added ? "pd-btn-cart--added" : ""} ${isOutOfStock ? "pd-btn-cart--disabled" : ""}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Out of Stock" : added ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              <button
                className={`pd-btn-wish ${isWishlisted ? "pd-btn-wish--active" : ""}`}
                onClick={handleWishlist}
              >
                <svg width="18" height="18" viewBox="0 0 24 24"
                  fill={isWishlisted ? "currentColor" : "none"}
                  stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {/* Delivery info */}
            <div className="pd-meta">
              <div className="pd-meta__item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <span>Free delivery on orders above ₹500</span>
              </div>
              <div className="pd-meta__item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                <span>7-day easy returns</span>
              </div>
              <div className="pd-meta__item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Secure payment via Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;