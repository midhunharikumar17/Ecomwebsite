import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
      <h1 className="text-8xl font-bold text-blue-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
      <p className="text-gray-500">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;
