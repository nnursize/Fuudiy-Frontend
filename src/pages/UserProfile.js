import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import LogoutButtonWithPopup from '../components/LogoutButtonWithPopup';
import FoodInProfile from '../components/FoodInProfile';
import dummyUserData from '../data/dummyUserData.json';
import dummyFoodData from '../data/dummyFoodData.json';
import Header from '../components/Header';
import ProfilePictureSelector from '../components/ProfilePictureSelector';

const UserProfile = () => {
  const [userData, setUserData] = useState(dummyUserData);
  const [ratedFoodDetails, setRatedFoodDetails] = useState(
    dummyUserData.ratedFoods.map((ratedFood) => {
      const food = dummyFoodData.find((item) => item.id === ratedFood.foodId);
      return food ? { ...food, rate: ratedFood.rate, comment: ratedFood.comment } : null;
    }).filter(Boolean)
  );

  // Update food rating and refresh lists
  const handleRateChange = (foodId, newRate) => {
    // console.log(`Updating rating for foodId: ${foodId}, New Rate: ${newRate}`);
  
    // Update userData state
    setUserData((prev) => {
      const updatedRatedFoods = prev.ratedFoods.map((ratedFood) =>
        ratedFood.foodId === foodId ? { ...ratedFood, rate: newRate } : ratedFood
      );
  
      // console.log("Updated userData.ratedFoods:", updatedRatedFoods);
  
      return { ...prev, ratedFoods: updatedRatedFoods };
    });
  
    // Update ratedFoodDetails correctly
    setRatedFoodDetails((prev) => {
      const updatedRatedFoodDetails = prev.map((food) =>
        food.id === foodId ? { ...food, rate: newRate } : food
      );
  
      console.log("Updated ratedFoodDetails:", updatedRatedFoodDetails);
  
      return updatedRatedFoodDetails;
    });
  };
  

  // Favorite foods (only foods rated 5 stars)
  const favoriteFoodDetails = ratedFoodDetails.filter((food) => food.rate === 5);

  return (
    <>
      <Header />
      <Box padding={4} bgcolor="white">
        {/* User Information Section */}
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4, position: 'relative' }}>
          {/* Logout Button */}
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <LogoutButtonWithPopup />
          </Box>

          <Box display="flex" alignItems="center" marginBottom={3}>
            <ProfilePictureSelector currentAvatar={userData.avatarId} onSelect={(newAvatar) =>
              setUserData((prev) => ({ ...prev, avatarId: newAvatar }))
            } />
            <Box>
              <Typography variant="h5">{userData.name || 'Anonymous User'}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {userData.email || 'No email available.'}
              </Typography>
              <Typography variant="body1">{userData.bio || 'No bio available.'}</Typography>
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
                <FoodInProfile key={index} food={ratedFood} onRateChange={handleRateChange} />
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
                  <FoodInProfile key={index} food={food} onRateChange={handleRateChange} />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No favorite foods yet.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default UserProfile;
