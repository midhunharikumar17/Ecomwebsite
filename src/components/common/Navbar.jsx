import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import "./Navbar.css";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { ProductContext } from "../../context/ProductContext";

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useContext(ProductContext);

  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlistItems?.length || 0;

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="navbar-left">
          {/* LOGO */}
          <Link to="/" className="logo">
            Shop<span>Ease</span>
          </Link>
        </div>

        {/* SEARCH */}
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search products..."value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)} />
        </div>


        {/* ICONS */}
        <div className="navbar-right">
          <div className="nav-icons">

            <Link to="/wishlist" className="icon">
              <FiHeart />
              {wishlistCount > 0 && (
                <span className="badge">{wishlistCount}</span>
              )}
            </Link>

            <Link to="/cart" className="icon">
              <FiShoppingCart />
              {cartCount > 0 && (
                <span className="badge">{cartCount}</span>
              )}
            </Link>

            {user ? (
              <>
                <span className="welcome-user">Welcome, {user.name}</span>
                <button className="nav-logout" onClick={logout}>
                  <FiLogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="nav-logout">Login</Link>
                <Link to="/register" className="nav-logout">Register</Link>
              </>
            )}

          </div>
          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search products..." />
          </div>

          <div className="mobile-links">
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Cart</Link>

            {user ? (
              <button onClick={logout}>Logout</button>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;