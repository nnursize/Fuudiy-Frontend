import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Comments from "../components/Comments" // Import your Header component

const FoodDetailPage = () => {
  const foodDetails = {
    name: "Spaghetti Carbonara",
    imageUrl: "", // Simulate a missing image
    ingredients: [
      "Spaghetti",
      "Eggs",
      "Pancetta",
      "Parmesan Cheese",
      "Black Pepper",
    ],
    keywords: ["Italian", "Pasta", "Comfort Food", "Dinner"],
    country: "Italy",
  };

  // Determine which image to use
  const foodImage =
    foodDetails.imageUrl || `${process.env.PUBLIC_URL}/default-food.png`;

  return (
    <>
      {/* Header */}
      <Header />

      <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <Grid container spacing={3}>
          {/* Left Side - Image */}
          <Grid item xs={12} md={5}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={foodImage}
                alt={foodDetails.name || "Default Food"}
              />
            </Card>
          </Grid>

          {/* Right Side - Name, Ingredients, Keywords */}
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                {/* Food Name */}
                <Typography variant="h4" component="h1" gutterBottom>
                  {foodDetails.name + ', ' + foodDetails.country}
                </Typography>

                {/* Ingredients */}
                <Typography variant="h6" component="h2" gutterBottom>
                  Ingredients:
                </Typography>
                <ul>
                  {foodDetails.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      <Typography variant="body1">{ingredient}</Typography>
                    </li>
                  ))}
                </ul>
                
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" , alignItems: "center"}}>
                  Keywords:  
                  {foodDetails.keywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      sx={{ backgroundColor: "#f1f1f1", fontWeight: "bold" }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Comments Section */}
        <Box sx={{ marginTop: "30px" }}>
         <Comments></Comments>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default FoodDetailPage;
