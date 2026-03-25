import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import axiosInstance from "../../services/axiosInstance";
import { clearCart } from "../../redux/slices/cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { user, token } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1 = Shipping, 2 = Review, 3 = Payment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shippingData, setShippingData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  // ─── Calculations ──────────────────────────────────────
  const subtotal = cartItems.reduce((sum, item) => {
    const discounted = item.price - (item.price * (item.discount || 0)) / 100;
    return sum + discounted * item.quantity;
  }, 0);
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const total = subtotal + deliveryFee;

  // ─── Redirect if cart empty ─────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  // ─── Shipping form handler ──────────────────────────────
  const handleShippingChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate pincode and phone
    if (!/^\d{6}$/.test(shippingData.pincode)) {
      return setError("Pincode must be 6 digits");
    }
    if (!/^\d{10}$/.test(shippingData.phone)) {
      return setError("Phone must be 10 digits");
    }

    setStep(2);
  };

  // ─── Place Order ────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price - (item.price * (item.discount || 0)) / 100,
          quantity: item.quantity,
          image: item.images?.[0] || "",
        })),
        shippingAddress: shippingData,
        totalAmount: total,
        paymentMethod: "Online",
      };

      const { data } = await axiosInstance.post("/orders", orderData);

      // ─── Razorpay Integration ───────────────────────────
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "ShopApp",
        description: "Order Payment",
        order_id: data.razorpayOrder.id,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: shippingData.phone,
        },
        handler: async (response) => {
          try {
            // Verify payment on backend
            await axiosInstance.post("/orders/verify-payment", {
              orderId: data.order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            dispatch(clearCart());           // ✅ clear cart after success
            navigate("/orders");             // ✅ redirect to orders
          } catch {
            setError("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled. Please try again.");
          },
        },
        theme: { color: "#3b82f6" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step indicators ────────────────────────────────────
  const steps = ["Shipping", "Review", "Payment"];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Step Progress Bar */}
        <div className="flex items-center mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${step > i + 1
                    ? "bg-green-500 text-white"
                    : step === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                  }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className="text-xs mt-1 text-gray-500">{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${step > i + 1 ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left Panel ── */}
          <div className="flex-1">

            {/* STEP 1 — Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">

                  <div>
                    <label className="block text-sm font-medium mb-1">Full Address</label>
                    <textarea
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      required
                      rows={3}
                      placeholder="House no, Street, Area..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        required
                        placeholder="Kochi"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        required
                        placeholder="Kerala"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingData.pincode}
                        onChange={handleShippingChange}
                        required
                        maxLength={6}
                        placeholder="682001"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleShippingChange}
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Continue to Review →
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2 — Review */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Review Your Order</h2>

                {/* Cart items */}
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => {
                    const discounted = item.price - (item.price * (item.discount || 0)) / 100;
                    return (
                      <div key={item._id} className="flex gap-3 items-center">
                        <img
                          src={item.images?.[0] || "/placeholder.png"}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-red-700 text-xl font-extrabold tracking-tight">
                          ₹{(discounted * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Shipping summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600">
                  <p className="font-semibold text-gray-800 mb-1">📦 Shipping to:</p>
                  <p>{shippingData.address}</p>
                  <p>{shippingData.city}, {shippingData.state} — {shippingData.pincode}</p>
                  <p>📞 {shippingData.phone}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    ← Edit Address
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Payment */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Payment</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-700">
                  🔒 Secure payment powered by Razorpay
                </div>

                <div className="mb-6 text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 text-base border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {loading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right Panel — Order Summary (always visible) ── */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-xl shadow p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate flex-1 pr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      ₹{((item.price - (item.price * (item.discount || 0)) / 100) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-green-600 text-xs">🎉 Free delivery on orders above ₹500</p>
                )}
                <div className="flex justify-between font-bold text-gray-800 text-base border-t pt-2">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;