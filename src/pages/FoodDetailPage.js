import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Grid2,
  Card,
  CardMedia,
  Chip,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Rating,
  Stack,
  ToggleButtonGroup,
  List,
  ListItem,
  ToggleButton
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Comments from "../components/Comments";
import { useTranslation } from "react-i18next";

const FoodDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation("global");
  const [foodDetails, setFoodDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [view, setView] = useState("ingredients");

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/food/${id}`);
        setFoodDetails(response.data);
      } catch (error) {
        setError(t("errorFetching"));
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodDetails();
  }, [id, t]);

  const handleFavoriteToggle = async () => {
    setIsFavorite(!isFavorite);
    await axios.post(`http://localhost:8000/favorites`, {
      foodId: id,
      isFavorite: !isFavorite
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "50px" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const foodImage = foodDetails.imageUrl || `${process.env.PUBLIC_URL}/default-food.png`;

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", padding: "30px" }}>
        <Paper elevation={3} sx={{ padding: "30px", borderRadius: "20px", marginBottom: "30px" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={5} alignItems="center">
            <Card sx={{ borderRadius: "16px", boxShadow: 3, maxWidth: 500 }}>
              <CardMedia component="img" height="300" image={foodImage} alt={foodDetails.name} />
            </Card>
            <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" }, position: "relative", padding: "20px" }}>
              <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                <Tooltip title={isFavorite ? t("removeFavorite") : t("addFavorite")}>
                  <IconButton onClick={handleFavoriteToggle} color={isFavorite ? "error" : "default"} sx={{ fontSize: "1rem", padding: "4px" }}>
                    {isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ marginBottom: "10px" }}>
                {foodDetails.name}, {foodDetails.country}
              </Typography>
              <Rating name="read-only" value={foodDetails.popularity || 0} readOnly precision={0.5} sx={{ marginBottom: "10px" }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginTop: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
                <Typography variant="body1" fontWeight="bold">{t("keywords")}:</Typography>
                {foodDetails.keywords.map((keyword, index) => (
                  <Chip key={index} label={keyword} sx={{ backgroundColor: "#f1f1f1", fontWeight: "bold", fontSize: "1rem", padding: "8px" }} />
                ))}
              </Box>
            </Box>
          </Stack>
        </Paper>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(event, newValue) => setView(newValue)}
          sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
        >
          <ToggleButton value="ingredients">{t("ingredients")}</ToggleButton>
          <ToggleButton value="comments">{t("comments")}</ToggleButton>
        </ToggleButtonGroup>
        <Paper elevation={3} sx={{ padding: "30px", borderRadius: "20px", textAlign: "center" }}>
          {view === "ingredients" ? (
            <>
              <Typography variant="h5" fontWeight="bold" gutterBottom>{t("ingredients")}:</Typography>
              <List sx={{ columnCount:3, gap: "10px" }}>
                {foodDetails.ingredients.map((ingredient, index) => (
                  <ListItem key={index} sx={{ width: "100%", justifyContent: "center" }}>
                    <Paper sx={{ padding: "15px", borderRadius: "10px", backgroundColor: "#f9f9f9", textAlign: "center", width: "50%" }}>
                      <Typography variant="body1" fontWeight="bold">• {ingredient}</Typography>
                    </Paper>
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Comments />
          )}
        </Paper>
      </Box>
      <Footer />
    </>
  );
};

export default FoodDetailPage;