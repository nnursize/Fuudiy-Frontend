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
  const [translatedComments, setTranslatedComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");
  /*
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserId = currentUser?.userId;
  */
  const handleTranslate = async (comment, targetLang) => {
    try {
      const response = await axios.post("http://localhost:8000/translation", {
        text: comment.comment, // Ensure we're translating the actual comment text
        target_lang: targetLang,
      });

      setTranslatedComments(prev => ({
        ...prev,
        [comment._id]: {
          ...comment,
          comment: response.data.translated_text // Update the text
        }
      }));
    } catch (error) {
      console.error("Error translating comment:", error);
    }
  };

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
        
      } catch (error) {
        setError("Error fetching comments.");
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [food_id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || rating === 0) return;

    try {
      const response = await axios.post("http://localhost:8000/comments", {
        userId: "67b09c0cea7db4001fe76154", // Replace with actual logged-in user ID
        foodId: food_id,
        rate: rating,
        comment: newComment,
      });
      let translatedNewComment = newComment;
      if (language === "tr") {
        const translateResponse = await axios.post("http://localhost:8000/translate", { text: newComment });
        translatedNewComment = translateResponse.data.translated_text;
      }
      /*
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      setComments([{
        ...response.data,
        name: currentUser.name,
        avatarId: currentUser.avatarId
      }, ...comments]);
      setNewComment("");
      setRating(0);
      */
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
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {comments.map((comment, index) => (
            <Card key={comment._id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={`/avatars/${comment.avatarId}.png`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {comment.name}
                        </Typography>
                        <StarRating value={comment.rate} readOnly />
                      </>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">
                          {translatedComments[comment._id]?.comment || comment.comment}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<TranslateIcon />}
                            onClick={() => handleTranslate(comment, 'tr')}
                          >
                            Turkish
                          </Button>
                          <Button
                            size="small"
                            startIcon={<TranslateIcon />}
                            onClick={() => handleTranslate(comment, 'en')}
                          >
                            English
                          </Button>
                        </Box>
                      </>
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
