import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Rating, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FoodInProfile = ({
  food,
  onRateChange,
  onCommentUpdate,
  ingredientsList,
  isWannaTry = false,
  readOnly = true,
  onRemoveFromWannaTry
}) => {
  const [imageUrl, setImageUrl] = useState(
    food.imageUrl || `${process.env.PUBLIC_URL}/default-food.png`
  );
  const [localComment, setLocalComment] = useState(food.comment || "");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editedComment, setEditedComment] = useState(food.comment || "");
  const [originalComment, setOriginalComment] = useState(food.comment || "");

  const navigate = useNavigate();
  const { i18n, t } = useTranslation("global");

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

  const getLocalizedIngredient = (enName) => {
    const match = ingredientsList?.find((item) => item.en === enName);
    return match ? (i18n.language === "tr" ? match.tr : match.en) : enName;
  };

  const handleSaveComment = () => {
    setIsEditingComment(false);
    if (editedComment !== originalComment && onCommentUpdate) {
      setLocalComment(editedComment); // show the new comment immediately
      onCommentUpdate(food.foodId, editedComment);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingComment(false);
    setEditedComment(originalComment); // restore original comment
  };

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

          {isWannaTry ? (
            <IconButton
              onClick={() => onRemoveFromWannaTry && onRemoveFromWannaTry(food.foodId)}
              size="small"
              color="error"
              sx={{ p: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="textSecondary">
                {food.popularity?.rating ? food.popularity.rating.toFixed(1) : "N/A"}
              </Typography>
              <Rating
                name={`user-rating-${food.foodId}`}
                value={food.rate || 0}
                onChange={(event, newValue) => onRateChange(food.foodId, newValue)}
                precision={1}
                size="small"
              />
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="textSecondary">
          {food.country}
        </Typography>
        <Typography variant="body2" color="textSecondary" marginTop={1}>
          {t("ingredients")}: {
            food.ingredients
              ? food.ingredients.map(getLocalizedIngredient).join(", ")
              : t("unknown")
          }
        </Typography>

        {!isWannaTry && (
          <Box marginTop={1}>
            {isEditingComment ? (
              <Box display="flex" flexDirection="column" gap={1}>
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "0.9rem",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    resize: "vertical"
                  }}
                />
                <Box display="flex" gap={1}>
                  <IconButton size="small" onClick={handleSaveComment}>
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleCancelEdit}>
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontStyle: localComment ? "italic" : "normal" }}
                >
                  {localComment ? `"${localComment}"` : t("noComment")}
                </Typography>
                {!readOnly && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setOriginalComment(localComment);
                      setEditedComment(localComment);
                      setIsEditingComment(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FoodInProfile;
