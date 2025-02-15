import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // ✅ Import useParams
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
import Comments from "../components/Comments";

const FoodDetailPage = () => {
  const { id } = useParams();  // ✅ Get 'id' from URL
  const [foodDetails, setFoodDetails] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function fetchFoodData() {
      try {
        if (!id) return;  // Ensure ID exists before making requests

        // Step 1: Fetch food details using the 'id' from backend
        const foodResponse = await fetch(`http://localhost:8000/food/${id}`);
        const foodData = await foodResponse.json();
        setFoodDetails(foodData);

        // Step 2: Use the id to get the associated 'url_id' (assuming foodData contains 'url_id')
        const { url_id } = foodData;

        if (!url_id) {
          console.log("No url_id found for this food");
          return;
        }

        // Step 3: Fetch the signed image URL using the 'url_id' from backend
        const imageResponse = await fetch(`http://localhost:8000/food/image/${url_id}`);
        const imageData = await imageResponse.json();
        console.log("Received Image URL:", imageData.image_url);  // ✅ Log the URL
        setImageUrl(imageData.image_url);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    }

    fetchFoodData();
  }, [id]);  // ✅ Runs when 'id' changes

  if (!foodDetails) return <p>Loading...</p>;

  return (
    <>
      <Header />

      <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={imageUrl || `${process.env.PUBLIC_URL}/default-food.png`}
                alt={foodDetails.name || "Default Food"}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h1" gutterBottom>
                  {foodDetails.name + ", " + foodDetails.country}
                </Typography>

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

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                  Keywords:
                  {foodDetails.keywords.map((keyword, index) => (
                    <Chip key={index} label={keyword} sx={{ backgroundColor: "#f1f1f1", fontWeight: "bold" }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: "30px" }}>
          <Comments />
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default FoodDetailPage;
