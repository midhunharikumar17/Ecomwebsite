import "./Categories.css";

const categories = [
  {
    name: "Laptops",
    image: "https://cdn-icons-png.flaticon.com/512/179/179386.png",
  },
  {
    name: "Gaming",
    image: "https://cdn-icons-png.flaticon.com/512/686/686589.png",
  },
  {
    name: "Television",
    image: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
  },
  {
    name: "Camera",
    image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
  },
  {
    name: "Headphones",
    image: "https://cdn-icons-png.flaticon.com/512/727/727245.png",
  },
];

const Categories = () => {
  return (
    <div className="container categories-section">
      <h2>Shop By Categories</h2>

      <div className="categories">
        {categories.map((cat, index) => (
          <div className="category-card" key={index}>
            <img src={cat.image} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;