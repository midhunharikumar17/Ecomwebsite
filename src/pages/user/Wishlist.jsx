import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import "./Wishlist.css";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  const getDiscounted = (item) =>
    Math.round(item.price - (item.price * (item.discount || 0)) / 100);

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item._id));
  };

  const isInCart = (id) => cartItems.some((i) => i._id === id);

  return (
    <div className="wl-page">
      <Navbar />

      <div className="wl-wrapper">
        {/* Header */}
        <div className="wl-header">
          <h1 className="wl-title">Wishlist</h1>
          {wishlistItems.length > 0 && (
            <span className="wl-count">{wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="wl-empty">
            <div className="wl-empty__icon">🤍</div>
            <h2 className="wl-empty__title">Your wishlist is empty</h2>
            <p className="wl-empty__sub">Save items you love and come back to them anytime.</p>
            <Link to="/" className="wl-empty__btn">Browse Products</Link>
          </div>
        ) : (
          <div className="wl-grid">
            {wishlistItems.map((item) => {
              const discounted = getDiscounted(item);
              const inCart = isInCart(item._id);

              return (
                <div key={item._id} className="wl-card">
                  {/* Image */}
                  <Link to={`/product/${item._id}`} className="wl-card__img-wrap">
                    <img
                      src={item.images?.[0] || "/placeholder.png"}
                      alt={item.name}
                      className="wl-card__img"
                    />
                    {item.discount > 0 && (
                      <span className="wl-card__badge">{item.discount}% OFF</span>
                    )}
                  </Link>

                  {/* Body */}
                  <div className="wl-card__body">
                    <p className="wl-card__category">{item.category?.name || "Product"}</p>
                    <Link to={`/product/${item._id}`} className="wl-card__name">{item.name}</Link>

                    <div className="wl-card__pricing">
                      <span className="wl-card__price">₹{discounted.toLocaleString()}</span>
                      {item.discount > 0 && (
                        <>
                          <span className="wl-card__original">₹{item.price.toLocaleString()}</span>
                          <span className="wl-card__saved">Save ₹{(item.price - discounted).toLocaleString()}</span>
                        </>
                      )}
                    </div>

                    <div className="wl-card__actions">
                      <button
                        className={`wl-card__cart-btn ${inCart ? "wl-card__cart-btn--in" : ""}`}
                        onClick={() => handleMoveToCart(item)}
                      >
                        {inCart ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            In Cart
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                            Move to Cart
                          </>
                        )}
                      </button>

                      <button
                        className="wl-card__remove-btn"
                        onClick={() => dispatch(removeFromWishlist(item._id))}
                        title="Remove from wishlist"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;