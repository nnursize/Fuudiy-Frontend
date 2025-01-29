import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

const Comments = () => {
  // Static comments for demonstration
  const [comments, setComments] = useState([
    "This dish is absolutely delicious!",
    "Tried it last night, and it was amazing!",
  ]);
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Add new comment to the list
    setComments([...comments, newComment]);
    setNewComment(""); // Clear input field
  };

  return (
    <Box>
      {/* Comments Section Header */}
      <Typography variant="h5" gutterBottom>
        Comments
      </Typography>
      <Divider sx={{ marginBottom: "20px" }} />

      {/* Display Comments */}
      <Box sx={{ marginBottom: "20px" }}>
        {comments.map((comment, index) => (
          <Card key={index} sx={{ marginBottom: "10px" }}>
            <CardContent>
              <Typography variant="body1">{comment}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Add Comment Form */}
      <Box
        component="form"
        onSubmit={handleCommentSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <TextField
          label="Write your comment here..."
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ alignSelf: "flex-end" }}
        >
          Add Comment
        </Button>
      </Box>
    </Box>
  );
};

export default Comments;

// const Comments = ({ foodId }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/foods/${foodId}/comments`);
//         setComments(response.data);
//       } catch (err) {
//         console.error("Error fetching comments:", err);
//       }
//     };

//     fetchComments();
//   }, [foodId]);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;

//     try {
//       const response = await axios.post(`http://localhost:5000/api/foods/${foodId}/comments`, {
//         comment: newComment,
//       });
//       setComments([...comments, response.data]);
//       setNewComment("");
//     } catch (err) {
//       console.error("Error submitting comment:", err);
//     }
//   };

//   return (
//     <CommentContainer>
//       <CommentList>
//         {comments.map((comment, index) => (
//           <Comment key={index}>{comment.text}</Comment>
//         ))}
//       </CommentList>
//       <CommentForm onSubmit={handleCommentSubmit}>
//         <textarea
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Write your comment here..."
//         />
//         <button type="submit">Add Comment</button>
//       </CommentForm>
//     </CommentContainer>
//   );
// };

// export default Comments;

// // Styled-components
// const CommentContainer = styled.div`
//   margin-top: 20px;
// `;

// const CommentList = styled.div`
//   margin-bottom: 20px;
// `;

// const Comment = styled.div`
//   background-color: #f9f9f9;
//   padding: 10px;
//   margin-bottom: 10px;
//   border-radius: 5px;
//   border: 1px solid #ddd;
// `;

// const CommentForm = styled.form`
//   display: flex;
//   flex-direction: column;

//   textarea {
//     resize: none;
//     padding: 10px;
//     border-radius: 5px;
//     border: 1px solid #ddd;
//     margin-bottom: 10px;
//     font-size: 1rem;
//   }

//   button {
//     background-color: #007bff;
//     color: white;
//     border: none;
//     padding: 10px 15px;
//     border-radius: 5px;
//     cursor: pointer;
//     font-size: 1rem;

//     &:hover {
//       background-color: #0056b3;
//     }
//   }
// `;
