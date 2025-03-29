import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/ui/LoadingSpinner"; // Create or import a spinner component

const API_BASE_URL = "http://localhost:8000";
const Explore = () => {
  const { t } = useTranslation("global");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [page, setPage] = useState(1);
  const loadMore = () => setPage(prev => prev + 1);
  // Retrieve user info
  const token = localStorage.getItem("accessToken");

  const userId  = "67df1962c2b93bd39ca7a7bf"; // Get userId from the hook
  // First fetch available countries
  const handleApiError = (error) => {
    const status = error.response?.status;
    switch(status) {
      case 401:
      case 403:
        setError(t("errors.auth"));
        //redirectToLogin();
        break;
      case 500:
        setError(t("errors.server"));
        break;
      default:
        setError(t("errors.generic"));
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:8000/explore/countries/");
        setAvailableCountries(response.data.countries);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        setAvailableCountries(["Spanish", "Mexican", "Vietnamese", "Thai", "Turkish", 
                             "Japanese", "French", "Chinese", "American", "Brazilian"]);
      }
    };
    fetchCountries();
  }, []);

  // Fetch foods when country changes
  useEffect(() => {
    if (!selectedCountry || !userId) return;
    
    const fetchFoods = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/explore/recommend/`,
          {
            params: { country: selectedCountry },
            headers: { 
              Authorization: `Bearer ${token}`,
              "X-User-ID": userId
            }
          }
        );

        // Transform backend response to proper format
        const transformedFoods = response.data.map(foodStr => {
          const food = JSON.parse(foodStr);
          return {
            id: food._id,
            name: food.name,
            country: food.country || selectedCountry,
            ingredients: food.ingredients || [],
            score: food.score ? Math.round(food.score * 100) / 100 : 0
          };
        });
        //console.log("Foods from backend:", response.data);
        //console.log(JSON.parse(response.data[0]));

        setFoods(transformedFoods);
        console.log(transformedFoods)
        setError(null);

      } catch (error) {
        console.error("Fetch error:", error);
        handleApiError(error);
        setFoods([]);
      }
    };

    fetchFoods();
  }, [selectedCountry, userId, token, t]);

  
  return (
    <>
      <Header />
      <Hero />
      
      <ExploreContainer>
        <Title>
          <h1>{t("explore.title")}</h1>
          <p>{t("explore.subtitle")}</p>
        </Title>

        <CountryFilter>
          <h3>{t("explore.select_country")}</h3>
          <CountryBar>
            {availableCountries.map((country) => (
              <CountryButton
                key={country}
                active={selectedCountry === country}
                onClick={() => {
                  setSelectedCountry(country);
                  setFoods([]); // Reset food list
                  setError(null); // Clear previous errors
                }}
              >
                {country}
              </CountryButton>
            ))}
          </CountryBar>
        </CountryFilter>

        <ContentArea>
          {loading ? (
            <LoadingWrapper>
              <LoadingSpinner />
              <p>{t("explore.loading")}</p>
            </LoadingWrapper>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : foods.length > 0 ? (
            <FoodGrid>
              {foods.map((food) => (
                <FoodItemCard 
                  key={food.id} 
                  food={food}
                />
              ))}
            </FoodGrid>
          ) : (
            <EmptyState>
              <p>{t("explore.no_foods", { country: selectedCountry })}</p>
            </EmptyState>
          )}
        </ContentArea>
      </ExploreContainer>

      <Footer />
    </>
  );
};

const FoodItemCard = ({ food }) => (
  <FoodCard>
    <FoodHeader>
      <div>
        <h3>{food.name}</h3>
        <Score>Relevance Score: {food.score.toFixed(2)}</Score>
      </div>
      <CountryFlag country={food.country} />
    </FoodHeader>
    
    <Details>
      <Ingredients>
        <h4>Key Ingredients:</h4>
        <IngredientList>
          {food.ingredients.slice(0, 5).map((ingredient, index) => (
            <IngredientPill key={index}>
              {ingredient}
            </IngredientPill>
          ))}
          {food.ingredients.length > 5 && (
            <MoreIngredients>
              +{food.ingredients.length - 5} more
            </MoreIngredients>
          )}
        </IngredientList>
      </Ingredients>
    </Details>
  </FoodCard>
);

// Update the CountryFlag component implementation
const CountryFlag = ({ country }) => {
  const flagMap = {
    korean: "🇰🇷",
    mexican: "🇲🇽",
    japanese: "🇯🇵",
    italian: "🇮🇹",
    french: "🇫🇷",
    chinese: "🇨🇳",
    thai: "🇹🇭",
    turkish: "🇹🇷",
    spanish: "🇪🇸",
    american: "🇺🇸",
    brazilian: "🇧🇷",
    vietnamese: "🇻🇳"
  };

  return (
    <Flag>
      {flagMap[country.toLowerCase()] || "🌍"}
      <span>{country}</span>
    </Flag>
  );
};

// Styled Components
const ExploreContainer = styled.div`
  padding: 2rem;
  max-width: 1440px;
  margin: 0 auto;
`;

const Title = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const CountryFilter = styled.div`
  margin-bottom: 3rem;
  
  h3 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    color: #444;
  }
`;

const CountryBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto;
`;

const CountryButton = styled.button`
  background: ${({ active }) => active ? "#FF6B6B" : "#F8F9FA"};
  border: 2px solid ${({ active }) => active ? "#FF6B6B" : "#DEE2E6"};
  color: ${({ active }) => active ? "white" : "#495057"};
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.2s ease;
  &:hover {
  transform: scale(1.05);
  }
  cursor: pointer;
  
  &:hover {
    background: ${({ active }) => active ? "#FF5252" : "#E9ECEF"};
  }
`;

const ContentArea = styled.div`
  min-height: 500px;
  position: relative;
`;

const FoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
  transition: opacity 0.3s ease;
  opacity: ${({ loading }) => loading ? 0.5 : 1};
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  text-align: center;
  padding: 2rem;
  background: #fff5f5;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.2rem;
`;
const FoodCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const FoodHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }
`;

const Flag = styled.div`
  font-size: 1.5rem;
  span {
    margin-left: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }
`;

const Details = styled.div`
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const Score = styled.div`
  color: #4CAF50;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Ingredients = styled.div`
  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #666;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  li {
    background: #f5f5f5;
    padding: 0.3rem 0.6rem;
    border-radius: 15px;
    font-size: 0.8rem;
  }
`;

const IngredientList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const IngredientPill = styled.div`
  background: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  color: #555;
`;

const MoreIngredients = styled(IngredientPill)`
  background: #e0e0e0;
  cursor: pointer;
  &:hover {
    background: #d0d0d0;
  }
`;

export default Explore;