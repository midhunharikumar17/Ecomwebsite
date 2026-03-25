import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import Navbar from "../../components/common/Navbar";
import "./Orders.css";

const statusConfig = {
  "Pending":         { color: "yellow", icon: "🕐" },
  "Payment Success": { color: "blue",   icon: "💳" },
  "Shipped":         { color: "purple", icon: "🚚" },
  "Delivered":       { color: "green",  icon: "✅" },
  "Cancelled":       { color: "red",    icon: "❌" },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/orders");
        setOrders(data);
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <div className="or-page">
      <Navbar />

      <div className="or-wrapper">
        {/* Header */}
        <div className="or-header">
          <h1 className="or-title">Your Orders</h1>
          {orders.length > 0 && (
            <span className="or-count">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="or-skeletons">
            {[1,2,3].map(i => (
              <div key={i} className="or-skeleton">
                <div className="or-skeleton__top" />
                <div className="or-skeleton__line" />
                <div className="or-skeleton__line or-skeleton__line--short" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="or-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="or-empty">
            <div className="or-empty__icon">📦</div>
            <h2 className="or-empty__title">No orders yet</h2>
            <p className="or-empty__sub">Your order history will appear here once you make a purchase.</p>
            <Link to="/" className="or-empty__btn">Start Shopping</Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="or-list">
            {orders.map((order) => {
              const status = statusConfig[order.status] || { color: "gray", icon: "📋" };
              const isOpen = expanded === order._id;

              return (
                <div key={order._id} className={`or-card ${isOpen ? "or-card--open" : ""}`}>
                  {/* Card header */}
                  <div className="or-card__head" onClick={() => toggle(order._id)}>
                    <div className="or-card__head-left">
                      <div className="or-card__id-wrap">
                        <span className="or-card__id-label">Order</span>
                        <span className="or-card__id">#{order._id?.slice(-8).toUpperCase()}</span>
                      </div>
                      <div className="or-card__meta">
                        <span className="or-card__date">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="or-card__items-count">{order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    <div className="or-card__head-right">
                      <span className={`or-badge or-badge--${status.color}`}>
                        {status.icon} {order.status}
                      </span>
                      <span className="or-card__total">₹{order.totalAmount?.toLocaleString()}</span>
                      <svg className={`or-card__chevron ${isOpen ? "or-card__chevron--open" : ""}`}
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>

                  {/* Expandable body */}
                  {isOpen && (
                    <div className="or-card__body">
                      <div className="or-card__divider" />

                      {/* Items */}
                      <div className="or-card__items">
                        <p className="or-card__section-label">Items Ordered</p>
                        {order.items?.map((item, i) => (
                          <div key={i} className="or-item">
                            <div className="or-item__img-wrap">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="or-item__img" />
                              ) : (
                                <div className="or-item__img-fallback">🛍️</div>
                              )}
                            </div>
                            <div className="or-item__info">
                              <span className="or-item__name">{item.name}</span>
                              <span className="or-item__qty">Qty: {item.quantity}</span>
                            </div>
                            <span className="or-item__price">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Shipping */}
                      {order.shippingAddress && (
                        <div className="or-card__shipping">
                          <p className="or-card__section-label">Shipping Address</p>
                          <div className="or-shipping">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>
                              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                              {order.shippingAddress.state} — {order.shippingAddress.pincode}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      <div className="or-card__summary">
                        <div className="or-card__summary-row">
                          <span>Payment</span>
                          <span className="or-card__payment">{order.payment?.method || "Razorpay"}</span>
                        </div>
                        <div className="or-card__summary-row or-card__summary-row--total">
                          <span>Order Total</span>
                          <span className="or-card__summary-total">₹{order.totalAmount?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;