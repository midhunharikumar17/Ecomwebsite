import { useDispatch, useSelector } from "react-redux";   // ✅ FIX 1: Redux
import { removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";                   // ✅ FIX 2

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items); // ✅ FIX 1

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));                            // ✅ FIX 5: move to cart
    dispatch(removeFromWishlist(item._id));               // remove from wishlist
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div
                key={item._id}              // ✅ FIX 4: _id not id
                className="bg-white rounded-xl shadow p-4 flex gap-4 items-center"
              >
                {/* ✅ FIX 6: Product image */}
                <img
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-blue-600 font-bold mt-1">₹{item.price}</p>
                </div>

                <div className="flex gap-3">
                  <Link to={`/product/${item._id}`}>    {/* ✅ FIX 4: _id */}
                    <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 text-sm">
                      View
                    </button>
                  </Link>

                  {/* ✅ FIX 5: Add to Cart button */}
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => dispatch(removeFromWishlist(item._id))} // ✅ FIX 4
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;