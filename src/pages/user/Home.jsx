import Hero from "../../components/user/home/Hero";
import Categories from "../../components/user/home/Categories";
import Products from "./Products";

import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return  (
    <>
      <Hero />
      <Categories />
      <Products />
    </>
  );
};

export default Home;