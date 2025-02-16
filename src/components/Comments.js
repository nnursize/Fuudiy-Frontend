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
  Rating,
  IconButton,
  Card,
  CardContent
} from "@mui/material";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";

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
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);

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
        foodId: food_id,
        userId: "currentUserId", // Replace with actual logged-in user ID
        rate: rating,
        comment: newComment,
      });
      console.log("Submitted comment:", response.data);
      setComments([response.data, ...comments]);
      setNewComment("");
      setRating(0);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: "10px" }}>
      <Typography variant="h5" gutterBottom>Comments</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {comments.map((comment, index) => (
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
        <Typography variant="h6">Leave a Comment</Typography>
        <StarRating value={rating} onChange={setRating} />
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Write your comment..."
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
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Comments;
