// UserProfile.js
import React, { useEffect, useState } from 'react';  
import { Box, Stack, Typography, Paper, Chip, IconButton } from '@mui/material';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from "@mui/icons-material/Add";
import FoodInProfile from '../components/FoodInProfile';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfilePictureSelector from '../components/ProfilePictureSelector';
import AddIngredientAutocomplete from "../components/AddIngredientAutocomplete";
import axiosInstance from '../axiosInstance';  // Import the custom axios instance
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000'; 

//const USER_ID = localStorage.getItem("user"); 
const accessToken = localStorage.getItem("accessToken"); 
console.log("access token: ", accessToken);


const UserProfile = () => {
  const { USERNAME } = useParams();
  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [ratedFoodDetails, setRatedFoodDetails] = useState([]);
  const [favoriteFoodDetails, setFavoriteFoodDetails] = useState([]);
  const [editingDisliked, setEditingDisliked] = useState(false);
  const [editedDislikedIngredients, setEditedDislikedIngredients] = useState([]);
  const [dislikedIngredients, setDislikedIngredients] = useState([]);
  const [editingBio, setEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [editingAllergies, setEditingAllergies] = useState(false);
  const [editedAllergies, setEditedAllergies] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [newAllergyInput, setNewAllergyInput] = useState("");
  const [showAllergyInput, setShowAllergyInput] = useState(false);
  const [showDislikedInput, setShowDislikedInput] = useState(false);
  const [wannaTryFoods, setWannaTryFoods] = useState([]);

  const { t, i18n } = useTranslation("global");

  const getAvatarSrc = (avatarId) => {
    if (typeof avatarId !== 'string' || avatarId.trim() === '') {
      return '/avatars/default-profile.jpeg';
    }
    return avatarId.includes('.png')
      ? `/avatars/${avatarId}`
      : `/avatars/${avatarId}.png`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/auth/users/me');
        const user = response.data.data[0];
        setCurrentUser(user);
  
        let profileUser = null;
  
        if (USERNAME === user.username) {
          setIsOwnProfile(true);
          profileUser = user;
        } else {
          setIsOwnProfile(false);
          const userResponse = await axiosInstance.get(`/users/${USERNAME}`);
          profileUser = userResponse.data.data[0];
        }
        console.log("Is Own Profile: ", isOwnProfile);
  
        setUserData(profileUser);
        setEditedBio(profileUser.bio || "");
  
        const parsedDisliked = Array.isArray(profileUser?.disliked_ingredients)
          ? profileUser.disliked_ingredients
          : [];
        setEditedDislikedIngredients(parsedDisliked);
        setDislikedIngredients(parsedDisliked);

        if (profileUser?.username) {
          const allergiesResponse = await axios.get(`${API_BASE_URL}/users/allergies/${profileUser.username}`);
          const allergyData = allergiesResponse.data.data;
          const parsedAllergies = Array.isArray(allergyData) ? allergyData.flat() : [];
          setAllergies(parsedAllergies);
          setEditedAllergies(parsedAllergies);
        } else {
          console.warn("⚠️ Username is missing, skipping allergy fetch.");
        }
  
        // Get comments
        const commentsResponse = USERNAME === user.username
          ? await axios.get(`${API_BASE_URL}/comments/me`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            })
          : await axiosInstance.get(`/comments/${USERNAME}/comments`);
  
        const ratedFoods = commentsResponse.data.map(comment => ({
          foodId: comment.foodId,
          rate: comment.rate,
          comment: comment.comment,
        }));
  
        const foodRequests = ratedFoods.map(async food => {
          const res = await axiosInstance.get(`/food/${food.foodId}`);
          return { ...food, ...res.data };
        });
  
        const updatedRatedFoods = await Promise.all(foodRequests);
        setRatedFoodDetails(updatedRatedFoods);
        try {
          const surveyRes = await axios.get(`${API_BASE_URL}/survey/user/${profileUser.username}`);
          const wannaTryIds = surveyRes.data.wannaTry || [];
        
          // Fetch food data for each ID
          const wannaTryFoodRequests = wannaTryIds.map(async (foodId) => {
            const res = await axiosInstance.get(`/food/${foodId}`);
            return { foodId, ...res.data };
          });
        
          const fetchedWannaTryFoods = await Promise.all(wannaTryFoodRequests);
          setWannaTryFoods(fetchedWannaTryFoods);
        } catch (surveyErr) {
          console.warn("Couldn't fetch wannaTry list:", surveyErr);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [USERNAME]);
  
  useEffect(() => {
    fetch("/ingredients.json")
      .then((res) => res.json())
      .then((data) => setIngredientsList(data))
      .catch((err) => console.error("Failed to load ingredients:", err));
  }, []);

  const handleRateChange = async (foodId, newRate) => {
    if (!isOwnProfile) return;

    const food = ratedFoodDetails.find(f => f.foodId === foodId);
    if (!food) return;

    const oldRate = food.rate;
    const votes = food.popularity?.votes || 0;
    const oldRating = food.popularity?.rating || 0;
    const newCalculatedRating = ((oldRating * votes - oldRate + newRate) / votes).toFixed(1);

    // Optimistic UI update
    setRatedFoodDetails(prev => prev.map(food =>
      food.foodId === foodId
        ? { ...food, rate: newRate, popularity: { ...food.popularity, rating: parseFloat(newCalculatedRating) } }
        : food
    ));

    try {
      // Update rating in backend
      await axiosInstance.put(`/comments/update-rate/${foodId}?rate=${newRate}`, {});
      // Update popularity in backend
      await axiosInstance.put(`/food/update-popularity/${foodId}`, {
        rating: parseFloat(newCalculatedRating),
        existing_vote: true
      });
      
    } catch (error) {
      console.error('Error updating rating or popularity:', error);
      // Revert UI changes on error
      setRatedFoodDetails(prev => prev.map(food =>
        food.foodId === foodId
          ? { ...food, rate: oldRate, popularity: { ...food.popularity, rating: oldRating } }
          : food
      ));
    }
  };

  useEffect(() => {
    console.log("🩺 editedAllergies now:", editedAllergies);
  }, [editedAllergies]);
  
  // Handler to remove an ingredient from the temporary list.
  const handleRemoveIngredient = (ingredientToRemove) => {
    if (!isOwnProfile) return;
    setEditedDislikedIngredients(prev => prev.filter(ing => ing !== ingredientToRemove));
  };

  const handleSaveEditedIngredients = () => {
    if (!isOwnProfile) return;
    
    axiosInstance.put(`/users/update-disliked-by-username/${userData.username}`, 
      { dislikedIngredients: editedDislikedIngredients },
      {}
    )
    .then(() => {
      setUserData(prev => ({ ...prev, dislikedIngredients: editedDislikedIngredients }));
      setEditingDisliked(false);
      setDislikedIngredients(editedDislikedIngredients);
    })
    .catch(error => console.error('Error updating disliked ingredients:', error));
  };

  const handleCancelEditedIngredients = () => {
    setEditedDislikedIngredients(dislikedIngredients);
    setEditingDisliked(false);
  };

  const displayedDislikedIngredients = editingDisliked ? editedDislikedIngredients : dislikedIngredients;

  const handleSaveEditedBio = () => {
    if (!isOwnProfile) return;
    
    axiosInstance.put(`/users/update-bio-by-username/${userData.username}`, 
      { bio: editedBio },
      {}
    )
    .then(() => {
      setUserData(prev => ({ ...prev, bio: editedBio }));
      setEditingBio(false);
    })
    .catch(error => console.error("Error updating bio:", error));
  };
    
  const handleCancelEditedBio = () => {
    setEditedBio(userData.bio || "");
    setEditingBio(false);
  };

  const handleRemoveAllergy = (allergyToRemove) => {
    setEditedAllergies(prev => prev.filter(ing => ing !== allergyToRemove));
  };
  
  const handleSaveEditedAllergies = () => {
    axios.put(`${API_BASE_URL}/users/update-allergies-by-username/${userData.username}`, 
      { allergies: editedAllergies }, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    .then(() => {
      setUserData(prev => ({ ...prev, allergies: editedAllergies }));
      setAllergies(editedAllergies);
      setEditingAllergies(false);
    })
    .catch(error => console.error("Error updating allergies:", error));
  };
  
  const handleCancelEditedAllergies = () => {
    setEditedAllergies(allergies);
    setEditingAllergies(false);
  }; 
  
  const handleCommentUpdate = async (foodId, newComment) => {
    try {
      const commentRes = await axios.get(`${API_BASE_URL}/comments/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
  
      const comment = commentRes.data.find(c => c.foodId === foodId);
      if (!comment) return;
  
      await axios.put(`${API_BASE_URL}/comments/${comment._id}`, {
        comment: newComment
      });
  
      // ✅ Immediately update local state for UI
      setRatedFoodDetails(prev =>
        prev.map(food =>
          food.foodId === foodId ? { ...food, comment: newComment } : food
        )
      );
  
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };  
  
  const getLocalizedIngredient = (enName) => {
    const found = ingredientsList.find((item) => item.en === enName);
    return found ? (i18n.language === "tr" ? found.tr : found.en) : enName;
  };

  console.log("displayedDislikedIngredients: ", displayedDislikedIngredients)
  console.log("editingDisliked: ", editingDisliked)
  console.log("editedDislikedIngredients: ", editedDislikedIngredients)

  if (!userData) return <Typography>{t("loading")}</Typography>;

  return (
    <>
      <Header />
      <Box padding={4} bgcolor="white">
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4, position: 'relative' }}>
          <Box display="flex" alignItems="center" marginBottom={3} gap={2}>
            {isOwnProfile ? (
              <ProfilePictureSelector
                currentAvatar={userData.avatarId || ''} // ensures an empty string is passed
                onSelect={(newAvatar) => {
                  axiosInstance.put(`/users/update-avatar-by-username/${userData.username}`, { avatarId: newAvatar })
                    .then(() => {
                      setUserData(prev => ({ ...prev, avatarId: newAvatar }));
                    })
                    .catch(error => console.error('Error updating avatar:', error));
                }}
              />
            ) : (
              <Box sx={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden' }}>
                <img 
                  src={getAvatarSrc(userData.avatarId)} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            )}
            
            <Box sx={{ paddingLeft: 1 }}>
              <Typography variant="h5">{userData.username || 'Anonymous User'}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {userData.email || 'No email available.'}
              </Typography>
              <Box display="flex" alignItems="right" justifyContent="space-between" gap={1}>
                {isOwnProfile && editingBio ? (
                  <>
                    <input
                      type="text"
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "4px 8px",
                        fontSize: "1rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px"
                      }}
                    />
                    <Box display="flex" gap={0.5}>
                      <IconButton
                        onClick={handleSaveEditedBio}
                        size="small"
                        sx={{ p: 0.25, minWidth: 0, width: "20px", height: "20px" }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={handleCancelEditedBio}
                        size="small"
                        sx={{ p: 0.25, minWidth: 0, width: "20px", height: "20px" }}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ flex: 1 }}>
                      {userData.bio || t("noBio")}
                    </Typography>
                    {isOwnProfile && (
                      <IconButton
                        onClick={() => setEditingBio(true)}
                        size="small"
                        sx={{ p: 0.25, minWidth: 0, width: "20px", height: "20px" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Box>

          {dislikedIngredients.length > 0 && (
          <Box sx={{ mt: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "gray" }}>
              {t("dislikedIngredients")}
            </Typography>
        
            {isOwnProfile && (
              editingDisliked ? (
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
                    setEditedDislikedIngredients(dislikedIngredients);
                    setTimeout(() => setEditingDisliked(true), 0);
                  }}
                  size="small"
                  sx={{ p: 0.25, minWidth: 0, width: "20px", height: "20px" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )
            )}
          </Box>
        
          {dislikedIngredients.length === 0 && !isOwnProfile ? (
            <Typography variant="body2" color="textSecondary">
              {t("noDislikedIngredients")}
            </Typography>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              {displayedDislikedIngredients.map((ingredient, index) => (
                <Chip
                  key={index}
                  label={getLocalizedIngredient(ingredient)}
                  {...(editingDisliked ? { onDelete: () => handleRemoveIngredient(ingredient) } : {})}
                  sx={{ backgroundColor: "#f1f1f1", fontWeight: "bold", fontSize: "14px", py: 0.5, px: 1 }}
                />
              ))}
        
              {editingDisliked && showDislikedInput && (
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <AddIngredientAutocomplete
                    onAdd={(newIngredient) => {
                      if (!editedDislikedIngredients.includes(newIngredient)) {
                        setEditedDislikedIngredients((prev) => [...prev, newIngredient].flat());
                        setShowDislikedInput(false);
                      }
                    }}
                  />
                </Box>
              )}
        
              {editingDisliked && !showDislikedInput && (
                <IconButton
                  onClick={() => setShowDislikedInput(true)}
                  size="small"
                  sx={{
                    p: 0.25,
                    minWidth: 0,
                    width: "24px",
                    height: "24px",
                    border: "1px dashed #ccc",
                    ml: 0.5,
                    alignSelf: "center"
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          )}
        </Box>        
        
        )}

          {isOwnProfile && (editingAllergies ? editedAllergies.length > 0 : allergies.length > 0 || editingAllergies) && (
            <Box sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "gray" }}>
                  {t("allergies")}
                </Typography>
                {editingAllergies ? (
                  <Box>
                    <IconButton 
                      onClick={handleSaveEditedAllergies}
                      size="small"
                      sx={{ p: 0.25, minWidth: 0, width: "20px", height: "20px" }}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={handleCancelEditedAllergies}
                      size="small"
                      sx={{ p: 0.25, minWidth: 0, width: "20px", height: "20px" }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton 
                    onClick={() => {
                      setEditedAllergies(allergies);
                      setTimeout(() => setEditingAllergies(true), 0);
                    }}
                    size="small"
                    sx={{ p: 0.25, minWidth: 0, width: "20px", height: "20px" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                {(editingAllergies ? editedAllergies : allergies).map((allergy, index) => (
                  <Chip 
                    key={index} 
                    label={getLocalizedIngredient(allergy)}
                    {...(editingAllergies ? { onDelete: () => handleRemoveAllergy(allergy) } : {})}
                    sx={{ backgroundColor: "#ffe5e5", fontWeight: "bold", fontSize: "14px", py: 0.5, px: 1 }}
                  />
                ))}

                {/* Autocomplete input appears here */}
                {editingAllergies && showAllergyInput && (
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <AddIngredientAutocomplete
                      onAdd={(newAllergy) => {
                        if (!editedAllergies.includes(newAllergy)) {
                          setEditedAllergies((prev) => [...prev, newAllergy].flat()); // flatten
                          setShowAllergyInput(false);
                        }
                      }}
                    />
                  </Box>
                )}

                {/* ➕ Add button only if input is not visible */}
                {editingAllergies && !showAllergyInput && (
                  <IconButton
                    onClick={() => setShowAllergyInput(true)}
                    size="small"
                    sx={{
                      p: 0.25,
                      minWidth: 0,
                      width: "24px",
                      height: "24px",
                      border: "1px dashed #ccc",
                      ml: 0.5,
                      alignSelf: "center"
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            </Box>
          )}
        </Paper>

        <Box display="flex" justifyContent="space-between" sx={{ gap: 2, width: '100%' }}>
          <Paper elevation={3} sx={{ flex: 1, padding: 3 }}>
            <Typography variant="h6" marginBottom={2}>
              {t("ratedFoods")}
            </Typography>            
            <Box display="flex" flexDirection="column" gap={2}>
              {ratedFoodDetails.map((ratedFood, index) => (
                <FoodInProfile 
                  key={index} 
                  food={ratedFood} 
                  onRateChange={handleRateChange}
                  readOnly={!isOwnProfile} 
                  ingredientsList={ingredientsList}
                  onCommentUpdate={handleCommentUpdate}
                />
              ))}
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ flex: 1, padding: 3 }}>
          <Typography variant="h6" marginBottom={2}>
            {t("wannaTryFoods")}
          </Typography>
            {wannaTryFoods.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={2}>
                {wannaTryFoods.map((food, index) => (
                  <FoodInProfile
                    key={index}
                    food={food}
                    isWannaTry={true}
                    onRemoveFromWannaTry={async (foodIdToRemove) => {
                      try {
                        await axios.delete(`${API_BASE_URL}/survey/remove-from-wanna-try/${userData.username}/${foodIdToRemove}`);
                        setWannaTryFoods(prev => prev.filter(f => f.foodId !== foodIdToRemove));
                      } catch (err) {
                        console.error("Failed to remove from wannaTry:", err);
                      }
                    }}
                    ingredientsList={ingredientsList}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {t("noWannaTryFoods")}
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default UserProfile;