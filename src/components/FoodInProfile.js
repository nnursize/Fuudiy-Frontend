import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Rating } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodInProfile = ({ food, onRateChange }) => {
  const [imageUrl, setImageUrl] = useState(
    food.imageUrl || `${process.env.PUBLIC_URL}/default-food.png`
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSignedImageUrl = async () => {
      try {
        if (food.url_id) {
          const response = await axios.get(`http://localhost:8000/food/image/${food.url_id}`);
          setImageUrl(response.data.image_url);
        }
      } catch (error) {
        console.error("Error fetching signed image URL:", error);
      }
    };

    fetchSignedImageUrl();
  }, [food.url_id]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      padding={2}
      gap={2}
      sx={{ border: "1px solid #ddd", borderRadius: 2 }}
    >
      <Avatar
        src={imageUrl}
        alt={food.name}
        variant="rounded"
        sx={{ width: 90, height: 90 }}
      />

      <Box flex={1}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            noWrap
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/food/${food.foodId}`)}
          >
            {food.name}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="textSecondary">
              {food.popularity ? food.popularity.toFixed(1) : "N/A"}
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

        <Typography variant="body2" color="textSecondary">
          {food.country}
        </Typography>
        <Typography variant="body2" color="textSecondary" marginTop={1}>
          Ingredients: {food.ingredients?.join(", ") || "Unknown"}
        </Typography>

        {food.comment && (
          <Typography
            variant="body2"
            color="textSecondary"
            marginTop={1}
            sx={{ fontStyle: "italic" }}
          >
            "{food.comment}"
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FoodInProfile;
