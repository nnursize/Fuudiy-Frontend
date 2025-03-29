import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
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
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Comments from "../components/Comments";
import { useTranslation } from "react-i18next";

const API_BASE_URL = 'http://localhost:8000'; 

const FoodDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation("global");
  const [foodDetails, setFoodDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInList, setisInList] = useState(false);
  const [view, setView] = useState("ingredients");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/food/${id}`);
        const foodData = response.data;
        setFoodDetails(foodData);

  
        // Fetch signed image URL if 'url_id' exists
        if (foodData.url_id) {
          const imageResponse = await axios.get(`${API_BASE_URL}/food/image/${foodData.url_id}`);
          setImageUrl(imageResponse.data.image_url);
        }
      } catch (error) {
        setError(t("errorFetching"));
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodDetails();
  }, [id, t]);

  const handleListToggle = async () => {
    setisInList(!isInList);
    await axios.post(`${API_BASE_URL}/add_list`, {
      foodId: id,
      isInList: !isInList
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

  const foodImage = imageUrl || `${process.env.PUBLIC_URL}/default-food.png`;

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
              <Tooltip title={isInList ? t("removeFromList") : t("addToList")}>
                <IconButton
                  onClick={handleListToggle}
                  color={isInList ? "error" : "default"}
                  sx={{ fontSize: "1rem", padding: "4px" }}
                >
                  {isInList ? <CloseIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ marginBottom: "10px" }}>
                {foodDetails.name}, {foodDetails.country}
              </Typography>
              <Rating name="read-only" value={foodDetails.popularity.rating || 0} readOnly precision={0.5} 
                sx={{ 
                    marginBottom: "10px",
                    "& .MuiRating-iconFilled": {
                      color: "#FFD700", // Gold/yellow color for filled stars
                    },
                    "& .MuiRating-iconEmpty": {
                      color: "#C0C0C0", // Light gray for empty stars
                    }
                  }} 
              />              
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginTop: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
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