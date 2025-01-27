import React from 'react';
import { Box, Typography, Avatar, Rating, Grid } from '@mui/material';

const FoodInProfile = ({ food }) => {
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
        sx={{ width: 60, height: 60 }}
      />

      {/* Food Details */}
      <Box flex={1}>
        {/* Food Name and Country */}
        <Typography variant="h6" noWrap>
          {food.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {food.country}
        </Typography>

        {/* Ingredients */}
        <Typography variant="body2" color="textSecondary" marginTop={1}>
          Ingredients: {food.ingredients.join(', ')}
        </Typography>

        {/* Popularity and Rating */}
        <Grid container alignItems="center" spacing={1} marginTop={1}>
          <Grid item>
            <Rating
              name="user-rating"
              value={food.rate}
              readOnly
              precision={1}
              size="small"
            />
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              (Popularity: {food.popularity.toFixed(1)})
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FoodInProfile;
