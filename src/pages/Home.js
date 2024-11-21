// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero.js';
import CategoryCard from '../components/CategoryCard';
import FoodItemCard from '../components/FoodItemCard';
import styled from 'styled-components';

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

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch('http://localhost:5000/food');
        const data = await response.json();
        setFoods(data);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    fetchFoods();
  }, []);
  return (
    <>
      <Header />
      <Hero />
      <Title>
        <h2>Trending Cuisines</h2>
        <CategorySection>
          <CategoryCard image="https://via.placeholder.com/300" title="Italian" />
          <CategoryCard image="https://via.placeholder.com/300" title="Mexican" />
          <CategoryCard image="https://via.placeholder.com/300" title="Indian" />
        </CategorySection>
      </Title>
      <Title>
        <h2>Trending Foods</h2>
        <FoodSection>
            {foods.map((food) => (
              <FoodItemCard key={food._id} food={food} />
            ))}
           {/* <FoodItemCard image="https://via.placeholder.com/250" name="Pizza" description="Italian classic dish with tomato, cheese, and various toppings" />
           <FoodItemCard image="https://via.placeholder.com/250" name="Tacos" description="Mexican dish with fillings inside a tortilla" />
           <FoodItemCard image="https://via.placeholder.com/250" name="Butter Chicken" description="Indian dish with creamy tomato-based sauce" /> */}
         </FoodSection>
       </Title>
     </>
   );
 };

export default Home;
