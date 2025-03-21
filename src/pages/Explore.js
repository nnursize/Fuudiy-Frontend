import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import FoodItemCard from "../components/FoodItemCard";
import styled from "styled-components";
import "../index.css";
import { useTranslation } from "react-i18next";

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

const CountryBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 1.5rem;
`;

const CountryButton = styled.button`
  background-color: ${(props) => (props.active ? "#ff7f50" : "#f0f0f0")};
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: 0.3s;
  
  &:hover {
    background-color: #ff6347;
    color: white;
  }
`;

const Explore = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const { t } = useTranslation("global");

  // List of 5 hardcoded countries
  const countries = ["Spanish", "Mexican", "Vietnamese", "Thai", "Turkish", "Japanese", "French", "Chinese", "American", "Brazilian"];

  // Fetch foods when a country is selected
  useEffect(() => {
    if (!selectedCountry) return; // Prevent API call if no country is selected

    const fetchFoods = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8000/explore/${selectedCountry}`, {
          headers: { "Cache-Control": "no-cache" },
        });
        setFoods(response.data);
      } catch (error) {
        console.error("API Error:", error);
        setError("Error fetching food items.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [selectedCountry]); // Re-run when country changes

  return (
    <>
      <Header />
      <Hero />
      <Title>
        <h2>{t("Explore Foods")}</h2>
      </Title>

      {/* Country Selection Bar */}
      <CountryBar>
        {countries.map((country) => (
          <CountryButton
            key={country}
            active={selectedCountry === country}
            onClick={() => setSelectedCountry(country)}
          >
            {country}
          </CountryButton>
        ))}
      </CountryBar>

      <FoodSection>
        {loading ? (
          <p>Loading food items...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : foods.length > 0 ? (
          foods.map((food) => <FoodItemCard key={food.id} food={food} />)
        ) : (
          <p>No food items available for {selectedCountry}.</p>
        )}
      </FoodSection>

      <Footer />
    </>
  );
};

export default Explore;
