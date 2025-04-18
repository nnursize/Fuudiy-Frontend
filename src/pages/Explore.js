import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // Added useNavigate
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PropTypes from 'prop-types';
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading_animation.json";

const API_BASE_URL = "http://localhost:8000";

const Explore = () => {
  const { t } = useTranslation("global");
  const [recommendations, setRecommendations] = useState({
    personalized: [],
    similar: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const token = localStorage.getItem("accessToken");
  const userId = "67df1962c2b93bd39ca7a7bf";
  
  // Error handling
  const handleApiError = (error) => {
    const status = error.response?.status;
    const errorMessages = {
      401: t("errors.auth"),
      403: t("errors.auth"),
      500: t("errors.server"),
      default: t("errors.generic")
    };
    setError(errorMessages[status] || errorMessages.default);
  };

  const [availableCountries] = useState([
    "Spanish", "Mexican", "Vietnamese", "Thai", "Turkish", "Korean", "Italian",
    "Japanese", "French", "Chinese", "American", "Brazilian", "Indian", "Greek",
    "German", "British"
  ]);

  // Fetch recommendations when country changes
  useEffect(() => {
    if (!selectedCountry || !userId) return;
    
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/explore/recommend/`, {
          params: { country: selectedCountry },
          headers: { 
            Authorization: `Bearer ${token}`,
            "X-User-ID": userId
          }
        });

        const transformFoodData = (foods) => 
          foods.map(foodStr => {
            const food = JSON.parse(foodStr);
            console.log(food._id)
            return {
              id: food._id,
              name: food.name,
              country: food.country || selectedCountry,
              ingredients: food.ingredients || [],
              ...(food.score && { score: Math.round(food.score * 100) / 100 }),
              ...(food.similar_user_count && { similarUsers: food.similar_user_count }),
              ...(food.average_rating && { rating: food.average_rating })
            };
          });

        setRecommendations({
          personalized: transformFoodData(response.data.personalized_recommendations),
          similar: transformFoodData(response.data.similar_users_recommendations)
        });
        setError(null);
      } catch (error) {
        console.error("Fetch error:", error);
        handleApiError(error);
        setRecommendations({ personalized: [], similar: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [selectedCountry, userId, token, t]);

  const handleSimilarSearch = async (foodId) => {
    if (!selectedCountry || !foodId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/explore/similar/${foodId}`, 
        {
          params: { country: selectedCountry },
          headers: { 
            Authorization: `Bearer ${token}`,
            "X-User-ID": userId
          }
        }
      );

      const transformFoodData = (foods) => 
        foods.map(foodStr => ({
          id: JSON.parse(foodStr)._id,
          name: JSON.parse(foodStr).name,
          country: JSON.parse(foodStr).country || selectedCountry,
          ingredients: JSON.parse(foodStr).ingredients || [],
          similarity: JSON.parse(foodStr).similarity
        }));

      setRecommendations(prev => ({
        ...prev,
        similar: transformFoodData(response.data.results)
      }));
      setError(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

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
                $active={selectedCountry === country}
                onClick={() => {
                  setSelectedCountry(country);
                  setRecommendations({ personalized: [], similar: [] });
                  setError(null);
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
              <Lottie
                animationData={loadingAnimation}
                loop
                style={{ height: 120, width: 120 }}
              />
            </LoadingWrapper>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <>
              {recommendations.personalized.length > 0 && (
                <Section>
                  <SectionTitle>Personalized Recommendations</SectionTitle>
                  <FoodGrid>
                    {recommendations.personalized.map((food) => (
                      <FoodItemCard 
                        key={food.id} 
                        food={food}
                        type="personalized"
                      />
                    ))}
                  </FoodGrid>
                </Section>
              )}

              {!loading && recommendations.personalized.length === 0 && (
                <EmptyState>
                  <p>{t("explore.no_foods", { country: selectedCountry })}</p>
                </EmptyState>
              )}

              {recommendations.similar.length > 0 && (
                <Section>
                  <SectionTitle>Foods You May Like</SectionTitle>
                  <SimilarFoodsGrid>
                    {recommendations.similar.map((food) => (
                      <FoodItemCard 
                        key={food.id}
                        food={food}
                        type="similar"
                        onSimilarSearch={() => handleSimilarSearch(food.id)}
                        />
                    ))}
                  </SimilarFoodsGrid>
                </Section>
              )}
            </>
          )}
        </ContentArea>

      </ExploreContainer>

      <Footer />
    </>
  );
};

const FoodItemCard = ({ food, type, onSimilarSearch }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate(); // Added navigate hook

  useEffect(() => {
    let isMounted = true;
    const fetchSignedImageUrl = async () => {
      try {
        if (food.url_id) {
          const response = await axios.get(
            `http://localhost:8000/food/image/${food.url_id}`
          );
          if (isMounted) setImageUrl(response.data.image_url);
        }
      } catch (error) {
        if (isMounted) console.error("Error fetching signed image URL:", error);
      }
    };
    fetchSignedImageUrl();
    return () => { isMounted = false };
  }, [food.url_id]);

  const handleSimilarClick = (e) => {
    e.stopPropagation();
    onSimilarSearch(food.id);
  };

  return (
    <FoodCard 
      $type={type} 
      onClick={() => navigate(`/food/${food.id}`)} // Added click handler
      style={{ cursor: "pointer" }}
    >
      {imageUrl && (
        <FoodImage>
          <img src={imageUrl} alt={food.name} />
        </FoodImage>
      )}
      <FoodHeader>
        <div>
          <h3>{food.name}</h3>
          {type === 'personalized' && (
            <Score>Relevance Score: {food.score?.toFixed(2)}</Score>
          )}
          {type === 'similar' && (
            <SimilarityInfo>
              <div>Recommended by {food.similarUsers} users</div>
              <div>Average Rating: {food.rating?.toFixed(1)}</div>
            </SimilarityInfo>
          )}
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

        {/* Add Similar button and similarity score below ingredients */}
        <ActionContainer>
          {type === 'similar' && (
            <ActionButton onClick={handleSimilarClick}>
              🔍 Similar to This
            </ActionButton>
          )}
          
          {food.similarity && (
            <SimilarityScore>
              Match: {(food.similarity * 100).toFixed(1)}%
            </SimilarityScore>
          )}
        </ActionContainer>
      </Details>
    </FoodCard>
  );
};
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
      {flagMap[country.toLowerCase()] || "🌍🍲"}
      <span>{country}</span>
    </Flag>
  );
};

// Styled Components

FoodItemCard.propTypes = {
  food: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['personalized', 'similar']),
  onSimilarSearch: PropTypes.func
};

const ActionContainer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${({ theme }) => theme?.colors?.primary || "#FF6B6B"};
  color: white;
  &:hover {
    background: ${({ theme }) => theme?.colors?.primaryDark || "#EE5D5D"};
  }
`;

const SimilarityScore = styled.div`
  color: ${({ theme }) => theme?.colors?.secondary || "#4ECDC4"};
`;
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
    color: #2c3e50;
  }
  
  p {
    color: #7f8c8d;
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const CountryFilter = styled.div`
  margin-bottom: 3rem;
  
  h3 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    color: #34495e;
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
  background: ${({ $active }) => $active ? "#3498db" : "#ecf0f1"};
  border: 2px solid ${({ $active }) => $active ? "#2980b9" : "#bdc3c7"};
  color: ${({ $active }) => $active ? "white" : "#2c3e50"};
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    background: ${({ $active }) => $active ? "#2980b9" : "#dfe6e9"};
  }
`;

const ContentArea = styled.div`
  min-height: 500px;
  position: relative;
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
`;

const FoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const SimilarFoodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const FoodCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.2s ease;
  
  ${({ $type }) => $type === 'similar' && `
    background: #fdfdfd;
    border-left: 4px solid #3498db;
  `}

  &:hover {
    transform: translateY(-3px);
  }
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
const SimilarityInfo = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  div {
    margin: 0.3rem 0;
  }
`;
const FoodImage = styled.div`
  height: 200px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  margin-bottom: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;


export default Explore;