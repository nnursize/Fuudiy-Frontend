import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import FoodItemCard from "../components/FoodItemCard";
import styled from "styled-components";
import "../index.css";
import { useTranslation } from "react-i18next";

const CategorySection = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2rem;
`;

const Title = styled.div`
  h2 {
    text-align: left;
    margin-left: 2.5rem;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const FoodSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2rem;
`;

const Home = () => {
  const [foods, setFoods] = useState([]);
  const { t } = useTranslation("global");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch("http://localhost:5000/food");
        const data = await response.json();
        setFoods(data);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <Title>
      <h2>{t("trendingFoods")}</h2>
        <FoodSection>
          {foods.map((food) => (
            <FoodItemCard key={food._id} food={food} />
          ))}
        </FoodSection>
      </Title>
      <Title>
        <h2>{t("trendingCuisines")}</h2>
          <CategorySection>
            <CategoryCard image="https://via.placeholder.com/300" title={t("Italian")} />
            <CategoryCard image="https://via.placeholder.com/300" title={t("Mexican")} />
            <CategoryCard image="https://via.placeholder.com/300" title={t("Indian")} />
          </CategorySection>
      </Title>
      <Footer />
    </>
  );
};

export default Home;
