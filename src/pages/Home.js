import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import FoodItemCard from "../components/FoodItemCard";
import styled from "styled-components";
import "../index.css";
import { useTranslation } from "react-i18next";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
`;

const MainContent = styled.div`
  flex: 1 0 auto;
  paddingBottom: 0;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation("global");

  useEffect(() => {
    let isMounted = true;

    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/food", {
          headers: { "Cache-Control": "no-cache" },
        });

        if (isMounted) {
          if (response.data.length === 0) {
            setError("No food items found.");
          } else {
            setFoods(response.data);
          }
        }
      } catch (error) {
        if (isMounted) {
          setError("Error fetching food items.");
          console.error("API Error:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFoods();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageContainer>
      <Header />
      {/* Main Content */}
      <MainContent>
        <Hero />
        <Title>
          <h2>{t("trendingFoods")}</h2>
        </Title>
        <FoodSection>
          {loading ? (
            <p>Loading food items...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : foods.length > 0 ? (
            foods.map((food) => <FoodItemCard key={food.id} food={food} />)
          ) : (
            <p>No food items available.</p>
          )}
        </FoodSection>
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

export default Home;
