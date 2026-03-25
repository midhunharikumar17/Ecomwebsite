import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import axiosInstance from "../../services/axiosInstance";
import { setProducts as setReduxProducts, setLoading as setReduxLoading, setError as setReduxError } from "../../redux/slices/productSlice";
import "./Home.css";
import Navbar from "../../components/common/Navbar";

const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home", "Beauty", "Sports"];

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

  const heroSearchRef = useRef(null);

useEffect(() => {
  const handleScroll = () => {
    if (heroSearchRef.current) {
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - (scrollY - 80) / 120);
      const translateY = Math.min(scrollY * 0.3, 40);
      heroSearchRef.current.style.opacity = opacity;
      heroSearchRef.current.style.transform = `translateY(-${translateY}px)`;
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

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
{/* ── REPLACE your entire <section className="home__hero"> with this ── */}

<section className="home__hero">
  {/* Background layers */}
  <div className="home__hero-bg">
    <div className="home__hero-grid" />
    <div className="home__hero-glow home__hero-glow--1" />
    <div className="home__hero-glow home__hero-glow--2" />
    <div className="home__hero-glow home__hero-glow--3" />
  </div>

  <div className="home__hero-inner">
    {/* Left content */}
    <div className="home__hero-content">

      {/* Pill badge */}
      <div className="home__hero-badge">
        <span className="home__hero-badge-dot" />
        New arrivals just dropped
      </div>

      <h1 className="home__hero-title">
        Shop the<br />
        <span className="home__hero-title-accent">Future</span>
        <span className="home__hero-title-plain">, Today.</span>
      </h1>

      <p className="home__hero-sub">
        Curated products, unbeatable prices,<br className="home__hero-sub-br" />
        delivered fast — right to your door.
      </p>

      {/* Search bar */}
      <div className="home__hero-search" ref={heroSearchRef}>
        <div className="home__hero-search-inner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="home__hero-search-icon">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search for products, brands, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="home__hero-search-input"
          />
          <button className="home__hero-search-btn" type="button">
            Search
          </button>
        </div>
        <div className="home__hero-search-tags">
          {["Electronics", "Clothing", "Books", "Home"].map((tag) => (
            <button
              key={tag}
              className="home__hero-tag"
              onClick={() => setActiveCategory(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Trust row */}
      <div className="home__hero-trust">
        <div className="home__hero-trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Free delivery ₹500+
        </div>
        <div className="home__hero-trust-dot" />
        <div className="home__hero-trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          7-day returns
        </div>
        <div className="home__hero-trust-dot" />
        <div className="home__hero-trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Secure checkout
        </div>
      </div>
    </div>

    {/* Right visual */}
    <div className="home__hero-visual">
      <div className="home__hero-card home__hero-card--main">
        <div className="home__hero-card-img">🎧</div>
        <div className="home__hero-card-info">
          <span className="home__hero-card-name">Premium Headphones</span>
          <span className="home__hero-card-price">₹2,499</span>
        </div>
        <div className="home__hero-card-badge">-30%</div>
      </div>
      <div className="home__hero-card home__hero-card--sm1">
        <div className="home__hero-card-img">📱</div>
        <div className="home__hero-card-info">
          <span className="home__hero-card-name">Smartphones</span>
          <span className="home__hero-card-price">₹12,999</span>
        </div>
      </div>
      <div className="home__hero-card home__hero-card--sm2">
        <div className="home__hero-card-img">👟</div>
        <div className="home__hero-card-info">
          <span className="home__hero-card-name">Sneakers</span>
          <span className="home__hero-card-price">₹1,799</span>
        </div>
      </div>
      <div className="home__hero-stats">
        <div className="home__hero-stat">
          <strong>50k+</strong>
          <span>Happy Customers</span>
        </div>
        <div className="home__hero-stat">
          <strong>4.9★</strong>
          <span>Avg Rating</span>
        </div>
      </div>
    </div>
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
              <ProductCard key={product._id} product={product} />
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