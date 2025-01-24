// src/components/FoodItemCard.js
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


const FoodCard = styled.div`
  width: 250px;
  margin: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const FoodImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const FoodContent = styled.div`
  padding: 0.5rem;
  h4 {
    margin: 0;
    font-size: 1rem;
  }
  p {
    font-size: 0.8rem;
    color: #555;
  }
`;

const FoodItemCard = ({ food }) => {
  const navigate = useNavigate();

  if (!food) {
    return <div>Error: Food data is missing</div>; // Fallback for undefined food
  }

  const handleClick = () => {
    navigate(`/food/${food._id}`);
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer', margin: '1rem' }}>
      <img
        src={food.imageUrl || `${process.env.PUBLIC_URL}/default-food.png`}
        alt={food.name || 'Food Item'}
        style={{ width: '250px', height: '150px', borderRadius: '8px' }}
      />
      <h3>{food.name || 'Unknown Food'}</h3>
      <p>{(food.description || '').substring(0, 50)}...</p>
    </div>
  );
};

export default FoodItemCard;
