import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "../../redux/slices/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import "./Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const getDiscounted = (item) =>
    Math.round(item.price - (item.price * (item.discount || 0)) / 100);

  const subtotal = cartItems.reduce((t, item) => t + getDiscounted(item) * item.quantity, 0);
  const totalSavings = cartItems.reduce((t, item) =>
    t + (item.price - getDiscounted(item)) * item.quantity, 0);
  const delivery = subtotal >= 500 ? 0 : 49;
  const total = subtotal + delivery;
  const totalItems = cartItems.reduce((t, item) => t + item.quantity, 0);

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-wrapper">
        {/* Header */}
        <div className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
          {cartItems.length > 0 && (
            <span className="cart-count">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty__icon">🛒</div>
            <h2 className="cart-empty__title">Your cart is empty</h2>
            <p className="cart-empty__sub">Looks like you haven't added anything yet.</p>
            <Link to="/" className="cart-empty__btn">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items">
              {cartItems.map((item) => {
                const discounted = getDiscounted(item);
                const saved = (item.price - discounted) * item.quantity;
                return (
                  <div key={item._id} className="cart-item">
                    {/* Image */}
                    <Link to={`/product/${item._id}`} className="cart-item__img-wrap">
                      <img
                        src={item.images?.[0] || "/placeholder.png"}
                        alt={item.name}
                        className="cart-item__img"
                      />
                      {item.discount > 0 && (
                        <span className="cart-item__img-badge">{item.discount}%</span>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="cart-item__body">
                      <div className="cart-item__top">
                        <div>
                          <p className="cart-item__category">{item.category?.name || "Product"}</p>
                          <Link to={`/product/${item._id}`} className="cart-item__name">
                            {item.name}
                          </Link>
                        </div>
                        <button
                          className="cart-item__remove"
                          onClick={() => dispatch(removeFromCart(item._id))}
                          title="Remove"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                          </svg>
                        </button>
                      </div>

                      <div className="cart-item__bottom">
                        {/* Price */}
                        <div className="cart-item__pricing">
                          <span className="cart-item__price">₹{discounted.toLocaleString()}</span>
                          {item.discount > 0 && (
                            <span className="cart-item__original">₹{item.price.toLocaleString()}</span>
                          )}
                          {saved > 0 && (
                            <span className="cart-item__saved">Save ₹{saved.toLocaleString()}</span>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="cart-item__qty">
                          <button
                            className="cart-item__qty-btn"
                            onClick={() => dispatch(decreaseQuantity(item._id))}
                            disabled={item.quantity <= 1}
                          >−</button>
                          <span className="cart-item__qty-num">{item.quantity}</span>
                          <button
                            className="cart-item__qty-btn"
                            onClick={() => dispatch(increaseQuantity(item._id))}
                          >+</button>
                        </div>
                      </div>

                      {/* Line total */}
                      <p className="cart-item__line-total">
                        Line total: <strong>₹{(discounted * item.quantity).toLocaleString()}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h2 className="cart-summary__title">Order Summary</h2>

              <div className="cart-summary__rows">
                <div className="cart-summary__row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="cart-summary__row cart-summary__row--green">
                    <span>Total Savings</span>
                    <span>−₹{totalSavings.toLocaleString()}</span>
                  </div>
                )}
                <div className="cart-summary__row">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? "cart-summary__free" : ""}>
                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                  </span>
                </div>
                {delivery > 0 && (
                  <p className="cart-summary__delivery-note">
                    Add ₹{(500 - subtotal).toLocaleString()} more for free delivery
                  </p>
                )}
              </div>

              <div className="cart-summary__divider" />

              <div className="cart-summary__total">
                <span>Total</span>
                <span className="cart-summary__total-price">₹{total.toLocaleString()}</span>
              </div>

              {totalSavings > 0 && (
                <div className="cart-summary__savings-banner">
                  🎉 You're saving <strong>₹{totalSavings.toLocaleString()}</strong> on this order!
                </div>
              )}

              <button
                className="cart-summary__btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <Link to="/" className="cart-summary__continue">
                ← Continue Shopping
              </Link>

              {/* Trust badges */}
              <div className="cart-summary__trust">
                <div className="cart-summary__trust-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  Secure checkout
                </div>
                <div className="cart-summary__trust-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                  </svg>
                  7-day returns
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;