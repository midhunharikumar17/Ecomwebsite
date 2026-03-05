import { useDispatch, useSelector } from "react-redux";   // ✅ FIX 1: Redux
import { removeFromCart, increaseQuantity, decreaseQuantity } from "../../redux/slices/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";              // ✅ FIX 2

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items); // ✅ FIX 1

  // ✅ FIX 6: Apply discount to price calculation
  const totalPrice = cartItems.reduce((total, item) => {
    const discounted = item.price - (item.price * (item.discount || 0)) / 100;
    return total + discounted * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}              // ✅ FIX 4: _id not id
                  className="bg-white rounded-xl shadow p-4 flex gap-4 items-center"
                >
                  {/* ✅ FIX 7: Product image */}
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>

                    {/* ✅ FIX 6: Show discounted price */}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-blue-600 font-bold">
                        ₹{(item.price - (item.price * (item.discount || 0)) / 100).toFixed(2)}
                      </p>
                      {item.discount > 0 && (
                        <span className="text-gray-400 line-through text-sm">
                          ₹{item.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => dispatch(decreaseQuantity(item._id))}  // ✅ FIX 4
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-lg flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(increaseQuantity(item._id))}  // ✅ FIX 4
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-lg flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}      // ✅ FIX 4
                    className="text-red-500 hover:text-red-700 text-sm font-medium ml-4"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Total + Checkout */}
            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">
                  Total ({cartItems.length} items)
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>

              {/* ✅ FIX 5: Checkout button */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;