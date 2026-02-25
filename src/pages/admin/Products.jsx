import dummyProducts from "../../data/dummyProducts";
import ProductCard from "../../components/product/ProductCard";

const Products = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>All Products</h1>

      <div className="product-grid">
        {dummyProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
