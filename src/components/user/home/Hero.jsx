import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero container">
      <div className="hero-left">
        <h1>Shop Latest <br/>Technological Products</h1>
        <p>
          Discover next-generation gadgets and modern accessories
          designed to elevate your daily life.
        </p>

        <button className="btn-primary">
          Explore Products
        </button>
      </div>

      <div className="hero-right">
        <img
          src="https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_SL1500_.jpg"
          alt="product"
        />
      </div>
    </div>
  );
};

export default Hero;