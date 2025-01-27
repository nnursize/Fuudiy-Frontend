import React, { useState } from 'react';
import { Box, Typography, Avatar, Chip, Paper, Button } from '@mui/material';
import LogoutPopup from '../components/LogoutPopup';
import FoodInProfile from '../components/FoodInProfile';
import dummyUserData from '../data/dummyUserData.json';
import dummyFoodData from '../data/dummyFoodData.json';
import Header from '../components/Header';

const UserProfile = () => {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const userData = dummyUserData;
  const foodData = dummyFoodData;

  // Map ratedFoods to their corresponding food items
  const ratedFoodDetails = userData.ratedFoods.map((ratedFood) => {
    const food = foodData.find((item) => item.id === ratedFood.foodId);
    return { ...food, rate: ratedFood.rate, comment: ratedFood.comment };
  });

  // Favorite foods (only foods rated 5 stars)
  const favoriteFoodDetails = ratedFoodDetails.filter((food) => food.rate === 5);

  return (
    <>
      <Header />
      <Box padding={4} bgcolor="white">
        {/* User Information Section */}
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Box display="flex" alignItems="center" marginBottom={3}>
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
              <Typography variant="h5">{userData.name || 'Anonymous User'}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {userData.email || 'No email available.'}
              </Typography>
              <Typography variant="body1">{userData.bio || 'No bio available.'}</Typography>
            </Box>
            <Box marginTop={3}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setLogoutOpen(true)}
                sx={{ marginTop: 2 }}
              >
                Log Out
              </Button>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" marginBottom={2}>
              Disliked Ingredients
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {userData.dislikedIngredients.map((ingredient, index) => (
                <Chip key={index} label={ingredient} color="secondary" />
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Food Sections */}
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            gap: 2,
            width: '100%',
          }}
        >
          {/* Rated Foods Section */}
          <Paper elevation={3} sx={{ flex: 1, padding: 3 }}>
            <Typography variant="h6" marginBottom={2}>
              Rated Foods
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {ratedFoodDetails.map((ratedFood, index) => (
                <FoodInProfile key={index} food={ratedFood} />
              ))}
            </Box>
          </Paper>

          {/* Favorite Foods Section */}
          <Paper elevation={3} sx={{ flex: 1, padding: 3 }}>
            <Typography variant="h6" marginBottom={2}>
              Favorite Foods
            </Typography>
            {favoriteFoodDetails.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={2}>
                {favoriteFoodDetails.map((food, index) => (
                  <FoodInProfile key={index} food={food} />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No favorite foods yet.
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Logout Popup */}
        <LogoutPopup open={logoutOpen} onClose={() => setLogoutOpen(false)} />
      </Box>
    </>
  );
};

export default UserProfile;
