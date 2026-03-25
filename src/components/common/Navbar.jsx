import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onSearchVisible }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);
  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      // Show navbar search when hero search has scrolled past navbar height (~70px)
      setSearchVisible(scrollY > 180);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when it appears
  useEffect(() => {
    if (searchVisible && searchRef.current) {
      // Don't auto-focus — just make it available
    }
  }, [searchVisible]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/orders", label: "Orders" },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner">

          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon">⚡</span>
            <span className="navbar__logo-text">Shop<em>App</em></span>
          </Link>

          {/* Search — appears when hero search scrolls past */}
          <form
            className={`navbar__search ${searchVisible ? "navbar__search--visible" : ""}`}
            onSubmit={handleSearch}
          >
            <span className="navbar__search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar__search-input"
            />
          </form>

          {/* Desktop Nav */}
          <div className="navbar__links">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`navbar__link ${location.pathname === to ? "navbar__link--active" : ""}`}
              >
                {label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link to="/admin" className="navbar__link navbar__link--admin">Admin</Link>
            )}
          </div>

          {/* Actions */}
          <div className="navbar__actions">
            <Link to="/wishlist" className="navbar__icon-btn" title="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && <span className="navbar__badge">{wishlistCount}</span>}
            </Link>

            <Link to="/cart" className="navbar__icon-btn" title="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
            </Link>

            <div className="navbar__user" ref={dropdownRef}>
              <div className="navbar__avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              {dropdownOpen && (
                <div className="navbar__user-dropdown navbar__user-dropdown--open">
                  <div className="navbar__user-info">
                    <span className="navbar__user-name">{user?.name}</span>
                    <span className="navbar__user-email">{user?.email}</span>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <button onClick={handleLogout} className="navbar__logout-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`navbar__mobile-toggle ${mobileOpen ? "navbar__mobile-toggle--open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`navbar__mobile ${mobileOpen ? "navbar__mobile--open" : ""}`}>
          <form className="navbar__mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <div className="navbar__mobile-links">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="navbar__mobile-link">{label}</Link>
            ))}
            <Link to="/cart" className="navbar__mobile-link">Cart {cartCount > 0 && `(${cartCount})`}</Link>
            <Link to="/wishlist" className="navbar__mobile-link">Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="navbar__mobile-link navbar__mobile-link--admin">Admin Panel</Link>
            )}
            <button onClick={handleLogout} className="navbar__mobile-logout">Sign Out</button>
          </div>
        </div>
      </nav>
      <div className="navbar__spacer" />
    </>
  );
};

export default Navbar;

/* ---- ADD THESE TO YOUR Navbar.css ---- */