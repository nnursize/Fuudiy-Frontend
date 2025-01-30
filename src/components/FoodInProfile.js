import React, { useState } from 'react';
import { Box, Typography, Avatar, Rating } from '@mui/material';

const FoodInProfile = ({ food, onRateChange = () => {} }) => {
  const [rating, setRating] = useState(food.rate);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    if (typeof onRateChange === 'function') {
      onRateChange(food.id, newValue);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      padding={2}
      gap={2}
      sx={{ border: '1px solid #ddd', borderRadius: 2 }}
    >
      {/* Food Image */}
      <Avatar
        src={food.imageUrl || `${process.env.PUBLIC_URL}/default-food.jpg`}
        alt={food.name}
        variant="rounded"
        sx={{ width: 90, height: 90 }}
      />

      {/* Food Details */}
      <Box flex={1}>
        {/* Food Name, Popularity, and Rating */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" noWrap>
            {food.name}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="textSecondary">
              {food.popularity.toFixed(1)}
            </Typography>
            <Rating
              name="user-rating"
              value={rating}
              onChange={handleRatingChange}
              precision={1}
              size="small"
            />
          </Box>
        </Box>

        {/* Food Country */}
        <Typography variant="body2" color="textSecondary">
          {food.country}
        </Typography>

        {/* Ingredients */}
        <Typography variant="body2" color="textSecondary" marginTop={1}>
          Ingredients: {food.ingredients.join(', ')}
        </Typography>

        {/* User Comment */}
        {food.comment && (
          <Typography
            variant="body2"
            color="textSecondary"
            marginTop={1}
            sx={{ fontStyle: 'italic' }}
          >
            "{food.comment}"
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FoodInProfile;
