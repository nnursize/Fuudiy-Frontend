import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Stack, Typography, Paper, Chip } from '@mui/material';
import LogoutButtonWithPopup from '../components/LogoutButtonWithPopup';
import FoodInProfile from '../components/FoodInProfile';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfilePictureSelector from '../components/ProfilePictureSelector';

const API_BASE_URL = 'http://localhost:8000'; 
const USER_ID = '67b09c0cea7db4001fe76154'; 

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [ratedFoodDetails, setRatedFoodDetails] = useState([]);
  const [favoriteFoodDetails, setFavoriteFoodDetails] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/users/${USER_ID}`)
      .then(response => {
        const user = response.data.data[0];
        setUserData(user);
        console.log("User from backend: ", user);
        return axios.get(`${API_BASE_URL}/comments/${USER_ID}/comments`);
      })
      .then(response => {
        console.log("User Comments: ", response.data);

        const ratedFoods = response.data.map(comment => ({
          userId: USER_ID, 
          foodId: comment.foodId,
          rate: comment.rate, 
          comment: comment.comment,
        }));

        const foodRequests = ratedFoods.map(food =>
          axios.get(`${API_BASE_URL}/food/${food.foodId}`)
            .then(res => ({
              ...food,
              ...res.data, 
            }))
        );

        return Promise.all(foodRequests);
      })
      .then(updatedRatedFoods => {
        setRatedFoodDetails(updatedRatedFoods);
        setFavoriteFoodDetails(updatedRatedFoods.filter(food => food.rate === 5));
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleRateChange = (foodId, newRate) => {
    console.log("Updating rating for foodId:", foodId, "userId:", USER_ID);
  
    axios.put(`${API_BASE_URL}/comments/update-rate/${USER_ID}/${foodId}?rate=${newRate}`)
      .then(response => {
        setRatedFoodDetails(prev =>
          prev.map(food => (food.foodId === foodId ? { ...food, rate: newRate } : food))
        );
        setFavoriteFoodDetails(prev =>
          prev.map(food => (food.foodId === foodId ? { ...food, rate: newRate } : food)).filter(food => food.rate === 5)
        );
      })
      .catch(error => console.error('Error updating rating:', error));
  };
  

  if (!userData) return <Typography>Loading...</Typography>;

  return (
    <>
      <Header />
      <Box padding={4} bgcolor="white">
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4, position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <LogoutButtonWithPopup />
          </Box>

          <Box display="flex" alignItems="center" marginBottom={3} gap={2}>
            <ProfilePictureSelector
              currentAvatar={userData.avatarId}
              onSelect={(newAvatar) =>
                axios.put(`${API_BASE_URL}/user/${USER_ID}`, { avatarId: newAvatar })
                  .then(() => setUserData(prev => ({ ...prev, avatarId: newAvatar })))
                  .catch(error => console.error('Error updating avatar:', error))  
              }
            />

            <Box sx={{ paddingLeft: 1 }}>
              <Typography variant="h5">{userData.username || 'Anonymous User'}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {userData.email || 'No email available.'}
              </Typography>
              <Typography variant="body1">{userData.bio || 'No bio available.'}</Typography>
            </Box>
          </Box>

          {/* Disliked Ingredients Section */}
          {userData.dislikedIngredients && userData.dislikedIngredients.length > 0 && (
            <Stack direction="row" spacing={1} alignItems="center" marginTop={2} flexWrap="wrap">
              <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "12px", color: "gray" }}>
                Disliked Ingredients:
              </Typography>
              {userData.dislikedIngredients.map((ingredient, index) => (
                <Chip key={index} label={ingredient} sx={{ backgroundColor: "#f1f1f1", fontWeight: "bold" }} />
              ))}
            </Stack>
          )}
        </Paper>

        {/* Food Sections */}
        <Box display="flex" justifyContent="space-between" sx={{ gap: 2, width: '100%' }}>
          {/* Rated Foods Section */}
          <Paper elevation={3} sx={{ flex: 1, padding: 3 }}>
            <Typography variant="h6" marginBottom={2}>Rated Foods</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {ratedFoodDetails.map((ratedFood, index) => (
                <FoodInProfile key={index} food={ratedFood} onRateChange={handleRateChange} />
              ))}
            </Box>
          </Paper>

          {/* Favorite Foods Section */}
          <Paper elevation={3} sx={{ flex: 1, padding: 3 }}>
            <Typography variant="h6" marginBottom={2}>Favorite Foods</Typography>
            {favoriteFoodDetails.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={2}>
                {favoriteFoodDetails.map((food, index) => (
                  <FoodInProfile key={index} food={food} onRateChange={handleRateChange} />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">No favorite foods yet.</Typography>
            )}
          </Paper>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default UserProfile;
