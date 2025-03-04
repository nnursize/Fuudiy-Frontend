import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Card,
  CardContent
} from "@mui/material";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import TranslateIcon from "@mui/icons-material/Translate";

const StarRating = ({ value, onChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          sx={{
            color: (readOnly ? value : (hoverRating || value)) >= star ? "#FFD700" : "#DDDDDD",
            cursor: readOnly ? "default" : "pointer",
            fontSize: readOnly ? 16 : 24,
          }}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          onClick={() => !readOnly && onChange(star)}
        />
      ))}
    </Box>
  );
};

const Comments = () => {
  const { id: food_id } = useParams();
  const [comments, setComments] = useState([]);
  const [translatedComments, setTranslatedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en"); // Default language: English

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/comments/${food_id}`);
        const commentsWithUser = await Promise.all(
          response.data.map(async (comment) => {
            try {
              const userResponse = await axios.get(`http://localhost:8000/users/${comment.userId}`);
              return {
                ...comment,
                name: userResponse.data.data[0].name,
                avatarId: userResponse.data.data[0].avatarId,
              };
            } catch (error) {
              console.error("Error fetching user data:", error);
              return { ...comment, name: "Unknown User", avatarId: "default" };
            }
          })
        );
        setComments(commentsWithUser);
        setTranslatedComments(commentsWithUser); // Initially set to the original comments
      } catch (error) {
        setError("Error fetching comments.");
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [food_id]);

  // Function to translate comments
  const handleTranslate = async () => {
    if (language === "tr") {
      // Switch back to original English comments
      setTranslatedComments(comments);
      setLanguage("en");
      return;
    }

    try {
      const translated = await Promise.all(
        comments.map(async (comment) => {
          try {
            const response = await axios.post("http://localhost:8000/translate", { text: comment.comment });
            return { ...comment, comment: response.data.translated_text };
          } catch (error) {
            console.error("Translation error:", error);
            return comment; // Fallback to original comment if translation fails
          }
        })
      );
      setTranslatedComments(translated);
      setLanguage("tr");
    } catch (error) {
      console.error("Error translating comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || rating === 0) return;

    try {
      const response = await axios.post("http://localhost:8000/comments", {
        foodId: food_id,
        userId: "currentUserId", // Replace with actual logged-in user ID
        rate: rating,
        comment: newComment,
      });
      console.log("Submitted comment:", response.data);
      
      // After submitting, translate the new comment if necessary
      let translatedNewComment = newComment;
      if (language === "tr") {
        const translateResponse = await axios.post("http://localhost:8000/translate", { text: newComment });
        translatedNewComment = translateResponse.data.translated_text;
      }

      setComments([response.data, ...comments]);
      setTranslatedComments([{ ...response.data, comment: translatedNewComment }, ...translatedComments]);
      setNewComment("");
      setRating(0);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: "10px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" gutterBottom>
          {language === "en" ? "Comments" : "Yorumlar"}
        </Typography>
        <IconButton onClick={handleTranslate}>
          <TranslateIcon />
          <Typography sx={{ marginLeft: "5px" }}>
            {language === "en" ? "Translate to Turkish" : "Translate to English"}
          </Typography>
        </IconButton>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {translatedComments.map((comment, index) => (
            <Card key={index} sx={{ marginBottom: 1, padding: 1, borderRadius: "12px", maxWidth: "100%", display: "block", minHeight: "60px", boxShadow: 1 }}>
              <CardContent>
                <ListItem alignItems="flex-start" sx={{ alignItems: "center" }}>
                  <ListItemAvatar>
                    <IconButton onClick={() => window.location.href = `/user/${comment.userId}`}>
                      <Avatar src={`/avatars/${comment.avatarId}.png`} alt={comment.name} />
                    </IconButton>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>{comment.name}</Typography>
                        <StarRating value={comment.rate} readOnly />
                      </>
                    }
                    secondary={
                      <Typography sx={{ wordWrap: "break-word", marginTop: "4px", fontSize: "14px" }}>{comment.comment}</Typography>
                    }
                  />
                </ListItem>
              </CardContent>
            </Card>
          ))}
        </List>
      )}

      {/* Add Comment Section */}
      <Box sx={{ marginTop: "10px" }}>
        <Typography variant="h6">{language === "en" ? "Leave a Comment" : "Yorum Yap"}</Typography>
        <StarRating value={rating} onChange={setRating} />
        <TextField
          fullWidth
          variant="outlined"
          placeholder={language === "en" ? "Write your comment..." : "Yorumunuzu yazın..."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ marginTop: "5px" }}
        />
        <Button
          variant="contained"
          sx={{ marginTop: "5px", backgroundColor: "#aaa", color: "#fff" }}
          onClick={handleCommentSubmit}
          disabled={!newComment.trim() || rating === 0}
        >
          {language === "en" ? "Submit" : "Gönder"}
        </Button>
      </Box>
    </Box>
  );
};

export default Comments;
