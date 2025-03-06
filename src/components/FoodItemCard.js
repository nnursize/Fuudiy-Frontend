import React, { useState, useEffect } from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FoodItemCard = ({ food }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(food.imageUrl || `${process.env.PUBLIC_URL}/default-food.png`);

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

  if (!food) {
    return <Typography color="error">Error: Food data is missing</Typography>;
  }

  const handleClick = () => {
    navigate(`/food/${food.id}`); // Ensure `id` is used consistently
  };

  return (
    <Card
      sx={{
        width: 250,
        height: 270,
        margin: "1rem",
        borderRadius: 2,
        boxShadow: 3,
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
      onClick={handleClick}
    >
      {/* Food Image */}
      <CardMedia
        component="img"
        height="150"
        image={imageUrl}
        alt={food.name || "Food Item"}
        sx={{ objectFit: "cover" }}
      />

      {/* Food Info */}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {food.name || "Unknown Food"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {food.country || "Unknown Country"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FoodItemCard;
