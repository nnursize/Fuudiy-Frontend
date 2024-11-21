import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FoodDetailPage = () => {
  const { id } = useParams(); // Get food ID from URL
  const [food, setFood] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/food/${id}`);
        if (!response.ok) throw new Error('Failed to fetch food data');
        const data = await response.json();
        setFood(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  if (!food) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{food.name}</h1>
      <img src={food.imageUrl} alt={food.name} style={{ width: '100%', maxWidth: '500px', borderRadius: '8px' }} />
      <p>{food.description}</p>
      <h3>Ingredients:</h3>
      <ul>
        {food.ingredients?.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
};

export default FoodDetailPage;

