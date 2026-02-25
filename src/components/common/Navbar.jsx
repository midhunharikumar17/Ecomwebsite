import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { Link } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";

import "./Navbar.css";

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const cartCount = cartItems.length;
  const wishlistCount = wishlistItems.length;
  return (
    <div className="navbar">
      <div className="container navbar-inner">

        <div className="logo">
          Shop<span>Zone</span>
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/wishlist" className="icon">
            Wishlist <FiHeart />
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
        </div>

        <div className="nav-icons">

          <div className="icon">
            <FiSearch />
          </div>

          <div className="icon">
            <FiHeart />
            {wishlistCount > 0 && (
              <span className="badge">{wishlistCount}</span>
            )}
          </div>

          <div className="icon">
            <FiShoppingCart />
            {cartCount > 0 && (
              <span className="badge">{cartCount}</span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Navbar;