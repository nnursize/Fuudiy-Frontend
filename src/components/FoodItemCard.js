import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FoodItemCard = ({ food }) => {
  const navigate = useNavigate();

  if (!food) {
    return <Typography color="error">Error: Food data is missing</Typography>;
  }

  const handleClick = () => {
    navigate(`/food/${food.id}`); // Use `id` instead of `_id` for consistency
  };

  return (
    <Card
      sx={{
        width: 250,
        height: 250,
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
        image={food.imageUrl || `${process.env.PUBLIC_URL}/default-food.png`}
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
