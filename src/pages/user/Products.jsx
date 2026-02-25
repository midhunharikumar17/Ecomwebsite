import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import ProductCard from "../../components/user/products/ProductCard";
import "./Products.css";

const Products = () => {

  const { products } = useContext(ProductContext);

  return (
    <div className="products-page">
      <h2 className="title">Our Products</h2>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;