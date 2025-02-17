import React from 'react';
import { Box, Typography, Avatar, Rating } from '@mui/material';

const FoodInProfile = ({ food, onRateChange }) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" padding={2} gap={2} sx={{ border: '1px solid #ddd', borderRadius: 2 }}>
      <Avatar
        src={food.imageUrl || `${process.env.PUBLIC_URL}/default-food.png`} // ✅ Use provided imageUrl
        alt={food.name}
        variant="rounded"
        sx={{ width: 90, height: 90 }}
      />

      <Box flex={1}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" noWrap>{food.name}</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="textSecondary">
              {food.popularity ? food.popularity.toFixed(1) : 'N/A'}
            </Typography>
            <Rating
              name={`user-rating-${food.foodId}`} 
              value={food.rate || 0} 
              onChange={(event, newValue) => onRateChange(food.foodId, newValue)}
              precision={1}
              size="small"
            />
          </Box>
        </Box>

        <Typography variant="body2" color="textSecondary">{food.country}</Typography>
        <Typography variant="body2" color="textSecondary" marginTop={1}>
          Ingredients: {food.ingredients?.join(', ') || 'Unknown'}
        </Typography>

        {food.comment && (
          <Typography variant="body2" color="textSecondary" marginTop={1} sx={{ fontStyle: 'italic' }}>
            "{food.comment}"
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FoodInProfile;
