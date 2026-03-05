import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";        // ✅ FIX 1: Redux
import { addToCart } from "../../redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";
import axiosInstance from "../../services/axiosInstance";
import Navbar from "../../components/common/Navbar";            // ✅ FIX 8
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector((state) => state.wishlist.items);

  // ✅ FIX 4 & 5: Fetch product from API with loading/error states
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`); // ✅ FIX 2: string id
        setProduct(data);
      } catch (err) {
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
      <div className="text-center py-20 text-gray-500">Loading product...</div>
    </>
  );

  if (error || !product) return (
    <>
      <Navbar />
      <div className="text-center py-20">
        <p className="text-red-500 text-lg mb-4">{error || "Product not found"}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Back to Home
        </button>
      </div>
    </>
  );

  // ✅ FIX 1: Redux for wishlist check
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  // ✅ FIX 6: Discounted price
  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    dispatch(addToCart(product));                               // ✅ FIX 1: Redux
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));                // ✅ FIX 1 & 2: Redux + _id
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <div>
      <Navbar />                                                {/* ✅ FIX 8 */}

      <div className="details-container">
        {/* Left — Images */}
        <div className="details-left">
          {/* ✅ FIX 3: uses images array */}
          <img
            src={product.images?.[selectedImage] || "/placeholder.png"}
            alt={product.name}
          />

          {/* Thumbnail strip for multiple images */}
          {product.images?.length > 1 && (
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    cursor: "pointer",
                    border: selectedImage === i ? "2px solid #3b82f6" : "2px solid transparent",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — Details */}
        <div className="details-right">
          <h2>{product.name}</h2>

          {/* ✅ FIX 6: Discounted price display */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <p className="price">₹{discountedPrice.toFixed(2)}</p>
            {product.discount > 0 && (
              <>
                <span style={{ textDecoration: "line-through", color: "#999" }}>
                  ₹{product.price}
                </span>
                <span style={{ color: "green", fontWeight: 600 }}>
                  {product.discount}% off
                </span>
              </>
            )}
          </div>

          <p className="description">{product.description}</p>

          {/* ✅ FIX 7: Stock indicator */}
          <p style={{
            marginBottom: "20px",
            fontWeight: 500,
            color: product.stock === 0 ? "red" : product.stock < 5 ? "orange" : "green"
          }}>
            {product.stock === 0
              ? "Out of Stock"
              : product.stock < 5
              ? `Only ${product.stock} left!`
              : "In Stock"}
          </p>

          <div className="details-buttons">
            {/* ✅ FIX 7: Disabled when out of stock */}
            <button
              className="cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{ opacity: product.stock === 0 ? 0.5 : 1 }}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button className="wishlist-btn" onClick={handleWishlist}>
              {isWishlisted ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;