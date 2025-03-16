import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Stack, Typography, Paper, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import FoodInProfile from '../components/FoodInProfile';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfilePictureSelector from '../components/ProfilePictureSelector';
import { useParams } from 'react-router-dom'; 
const API_BASE_URL = 'http://localhost:8000'; 
//const USER_ID = localStorage.getItem("user"); 


const UserProfile = () => {
  const { USER_ID } = useParams();
  const [userData, setUserData] = useState(null);
  const [ratedFoodDetails, setRatedFoodDetails] = useState([]);
  const [favoriteFoodDetails, setFavoriteFoodDetails] = useState([]);
  const [editingDisliked, setEditingDisliked] = useState(false);
  const [editedDislikedIngredients, setEditedDislikedIngredients] = useState([]);

  useEffect(() => {
    if (!USER_ID) {
      console.error('No user ID in URL');
      return;
    }
    axios.get(`${API_BASE_URL}/users/${USER_ID}`)
      .then(response => {
        const user = response.data.data[0];
        setUserData(user);
        // Initialize the temporary disliked ingredients list.
        setEditedDislikedIngredients(user.dislikedIngredients || []);
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

  const handleRateChange = async (foodId, newRate) => {
    console.log("🔄 Updating rating for foodId:", foodId, "userId:", USER_ID);

    // Find the food object in the state
    const food = ratedFoodDetails.find(f => f.foodId === foodId);
    if (!food) return;

    const oldRate = food.rate; // User's previous rating
    const votes = food.popularity?.votes || 0;
    const oldRating = food.popularity?.rating || 0;

    // Optimistically calculate the new popularity rating
    const newCalculatedRating = ((oldRating * votes - oldRate + newRate) / votes).toFixed(1);

    // **Instant UI update** (Optimistic UI for rating update)
    setRatedFoodDetails(prev => prev.map(food => 
        food.foodId === foodId 
            ? { ...food, rate: newRate, popularity: { ...food.popularity, rating: parseFloat(newCalculatedRating) } }
            : food
    ));

    try {
        // **Update rating in backend**
        await axios.put(`${API_BASE_URL}/comments/update-rate/${USER_ID}/${foodId}?rate=${newRate}`);
        console.log("✅ Rating updated successfully");

        // **Update popularity in backend**
        const popularityResponse = await axios.put(`${API_BASE_URL}/food/update-popularity/${foodId}`, {
            rating: parseFloat(newCalculatedRating),
            existing_vote: true
        });

        console.log("✅ Food popularity updated successfully:", popularityResponse.data);

        // ✅ **Only now update favorite foods with the correct popularity value**
        setFavoriteFoodDetails(prev => {
            if (newRate === 5) {
                const updatedFood = ratedFoodDetails.find(food => food.foodId === foodId);
                if (updatedFood) {
                    return [...prev, { 
                        ...updatedFood, 
                        rate: 5, 
                        popularity: { ...updatedFood.popularity, rating: parseFloat(newCalculatedRating) } 
                    }];
                }
            } else {
                return prev.filter(food => food.foodId !== foodId);
            }
            return prev;
        });

    } catch (error) {
        console.error('❌ Error updating rating or popularity:', error);

        // ❌ **Revert UI if backend fails**
        setRatedFoodDetails(prev => prev.map(food => 
            food.foodId === foodId 
                ? { ...food, rate: oldRate, popularity: { ...food.popularity, rating: oldRating } }
                : food
        ));

        // **Remove from favorites if the rating update failed**
        setFavoriteFoodDetails(prev => prev.filter(favFood => favFood.foodId !== foodId));
    }

    // **If the updated rating is below 5, remove the food from favorites**
    if (newRate < 5) {
        setFavoriteFoodDetails(prev => prev.filter(favFood => favFood.foodId !== foodId));
    }
  };

  
  // Handler to remove an ingredient from the temporary list.
  const handleRemoveIngredient = (ingredientToRemove) => {
    setEditedDislikedIngredients(prev => prev.filter(ing => ing !== ingredientToRemove));
  };

  // Save the updated disliked ingredients list to the backend.
  const handleSaveEditedIngredients = () => {
    axios.put(`${API_BASE_URL}/users/update-disliked/${USER_ID}`, { dislikedIngredients: editedDislikedIngredients })
      .then(() => {
        setUserData(prev => ({ ...prev, dislikedIngredients: editedDislikedIngredients }));
        setEditingDisliked(false);
      })
      .catch(error => console.error('Error updating disliked ingredients:', error));
  };  

  // Cancel the edit and revert changes.
  const handleCancelEditedIngredients = () => {
    setEditedDislikedIngredients(userData.dislikedIngredients);
    setEditingDisliked(false);
  };

  if (!userData) return <Typography>Loading...</Typography>;

  return (
    <>
      <Header />
      <Box padding={4} bgcolor="white">
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4, position: 'relative' }}>
          <Box display="flex" alignItems="center" marginBottom={3} gap={2}>
            <ProfilePictureSelector
              currentAvatar={userData.avatarId}
              onSelect={(newAvatar) => {
                axios.put(`${API_BASE_URL}/users/update-avatar/${USER_ID}`, { avatarId: newAvatar })
                  .then(() => {
                    setUserData(prev => ({ ...prev, avatarId: newAvatar }));
                  })
                  .catch(error => console.error('Error updating avatar:', error));
              }}
            />

            <Box sx={{ paddingLeft: 1 }}>
              <Typography variant="h5">{userData.username || 'Anonymous User'}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {userData.email || 'No email available.'}
              </Typography>
              <Typography variant="body1">{userData.bio || 'No bio available.'}</Typography>
            </Box>
          </Box>

          {/* Disliked Ingredients Section with Edit Toggle */}
          {userData.dislikedIngredients && userData.dislikedIngredients.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "gray" }}>
                  Disliked Ingredients:
                </Typography>
                {editingDisliked ? (
                  <Box>
                    <IconButton 
                      onClick={handleSaveEditedIngredients}
                      size="small"
                      sx={{ p: 0.25, minWidth: 0, width: "20px", height: "20px" }}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={handleCancelEditedIngredients}
                      size="small"
                      sx={{ p: 0.25, minWidth: 0, width: "20px", height: "20px" }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton 
                    onClick={() => { 
                      setEditingDisliked(true); 
                      setEditedDislikedIngredients([...userData.dislikedIngredients]);
                    }}
                    size="small"
                    sx={{ p: 0.25, minWidth: 0, width: "20px", height: "20px" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                {(editingDisliked ? editedDislikedIngredients : userData.dislikedIngredients)
                  .map((ingredient, index) => (
                    <Chip 
                      key={index} 
                      label={ingredient} 
                      {...(editingDisliked ? { onDelete: () => handleRemoveIngredient(ingredient) } : {})}
                      sx={{ backgroundColor: "#f1f1f1", fontWeight: "bold", fontSize: "14px", py: 0.5, px: 1 }} 
                    />
                ))}
              </Stack>
            </Box>
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
