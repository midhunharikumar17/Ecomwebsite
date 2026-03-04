import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import ProductCard from "../../components/product/ProductCard";

const Products = () => {
  const { products } = useContext(ProductContext);

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Products</h1>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;