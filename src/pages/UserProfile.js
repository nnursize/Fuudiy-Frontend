import React from 'react';
import { Box, Typography, Avatar, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import FoodItemCard from '../components/FoodItemCard';
import dummyUserData from '../data/dummyUserData.json';
import dummyFoodData from '../data/dummyFoodData.json';
import Header from '../components/Header';

const UserProfile = () => {
  const userData = dummyUserData;
  const foodData = dummyFoodData;

  // Map ratedFoods to their corresponding food items
  const ratedFoodDetails = userData.ratedFoods.map((ratedFood) => {
    const food = foodData.find((item) => item.id === ratedFood.foodId);
    return { ...food, rate: ratedFood.rate }; // Add the rate to the food details
  });

  return (
    <>
      <Header />
      <Box padding={4} bgcolor="white">
        {/* Profile Header */}
        <Box display="flex" alignItems="center" marginBottom={4}>
          <Avatar
            src={
              userData.avatarId
                ? `/avatars/${userData.avatarId}.png`
                : `${process.env.PUBLIC_URL}/default-profile.jpeg`
            }
            alt={userData.name || 'User Profile'}
            sx={{ width: 100, height: 100, marginRight: 3 }}
          />
          <Box>
            <Typography variant="h5" component="h1">
              {userData.name || 'Anonymous User'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {userData.email || 'No email available.'}
            </Typography>
          </Box>
        </Box>

        {/* Rated Foods Section */}
        <Box marginTop={4}>
          <Typography variant="h6" component="h2" marginBottom={2}>
            Rated Foods
          </Typography>
          <Grid container spacing={2}>
            {ratedFoodDetails.map((food, index) => (
              <Grid xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <FoodItemCard
                      food={{
                        name: food.name,
                        ingredients: food.ingredients,
                        country: food.country,
                        popularity: food.popularity,
                        imageUrl: food.imageUrl,
                        rate: food.rate,
                        categoryKeywords: food.category_keywords,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default UserProfile;
