import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import axiosInstance from "../../services/axiosInstance";
import { setProducts as setReduxProducts, setLoading as setReduxLoading, setError as setReduxError } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";
import "./Home.css";

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home", "Beauty", "Sports"];

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
        {product.discount > 0 && (
          <span className="product-card__discount-badge">-{product.discount}%</span>
        )}
        {product.stock === 0 && (
          <div className="product-card__out-of-stock">Out of Stock</div>
        )}
        <button
          className={`product-card__wishlist ${isWishlisted ? "product-card__wishlist--active" : ""}`}
          onClick={(e) => { e.preventDefault(); onToggleWishlist(product); }}
          aria-label="Toggle wishlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category?.name || "General"}</p>
        <Link to={`/product/${product._id}`} className="product-card__name">
          {product.name}
        </Link>

        <div className="product-card__pricing">
          <span className="product-card__price">₹{discountedPrice.toFixed(0)}</span>
          {product.discount > 0 && (
            <span className="product-card__original">₹{product.price}</span>
          )}
        </div>

        <div className="product-card__stock-bar">
          <div
            className="product-card__stock-fill"
            style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
          />
        </div>
        <p className="product-card__stock-text">
          {product.stock === 0 ? "Out of stock" : product.stock < 5 ? `Only ${product.stock} left` : "In stock"}
        </p>

        <button
          className="product-card__cart-btn"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [addedId, setAddedId] = useState(null);

  // Read search from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");
    if (q) setSearch(q);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setReduxLoading(true));
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/products");
        dispatch(setReduxProducts(data));
        setProducts(data);
      } catch (err) {
        dispatch(setReduxError("Failed to load products"));
        setError("Failed to load products. Please try again.");
      } finally {
        dispatch(setReduxLoading(false));
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleToggleWishlist = (product) => {
    const isWishlisted = wishlistItems.some((i) => i._id === product._id);
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  // Filter + sort
  let filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category?.name === activeCategory;
    return matchSearch && matchCat;
  });

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "discount") filtered = [...filtered].sort((a, b) => (b.discount || 0) - (a.discount || 0));

  return (
    <div className="home">
      <Navbar />

      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-content">
          <p className="home__hero-eyebrow">Welcome back, {user?.name?.split(" ")[0] || "there"} 👋</p>
          <h1 className="home__hero-title">
            Discover <em>Amazing</em><br />Products Today
          </h1>
          <p className="home__hero-sub">Shop the latest trends with unbeatable prices and fast delivery.</p>
          <div className="home__hero-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="home__hero-visual">
          <div className="home__hero-blob" />
          <div className="home__hero-float home__hero-float--1">🛍️</div>
          <div className="home__hero-float home__hero-float--2">⚡</div>
          <div className="home__hero-float home__hero-float--3">🎁</div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="home__stats">
        <div className="home__stat">
          <strong>{products.length}+</strong>
          <span>Products</span>
        </div>
        <div className="home__stat-divider" />
        <div className="home__stat">
          <strong>Free</strong>
          <span>Delivery above ₹500</span>
        </div>
        <div className="home__stat-divider" />
        <div className="home__stat">
          <strong>24/7</strong>
          <span>Support</span>
        </div>
        <div className="home__stat-divider" />
        <div className="home__stat">
          <strong>100%</strong>
          <span>Secure Payments</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="home__main">

        {/* Filters */}
        <div className="home__filters">
          <div className="home__categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`home__cat-btn ${activeCategory === cat ? "home__cat-btn--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="home__sort">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="home__sort-select"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="home__results-count">
            {filtered.length === 0
              ? "No products found"
              : `Showing ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
            {search && <span> for "<strong>{search}</strong>"</span>}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="home__loading">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="home__skeleton">
                <div className="home__skeleton-img" />
                <div className="home__skeleton-line home__skeleton-line--short" />
                <div className="home__skeleton-line" />
                <div className="home__skeleton-line home__skeleton-line--short" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="home__error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="home__empty">
            <span className="home__empty-icon">🔍</span>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(""); setActiveCategory("All"); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="home__grid">
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistItems.some((i) => i._id === product._id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Added to cart toast */}
      <div className={`home__toast ${addedId ? "home__toast--show" : ""}`}>
        ✅ Added to cart!
      </div>
    </div>
  );
};

export default Home;