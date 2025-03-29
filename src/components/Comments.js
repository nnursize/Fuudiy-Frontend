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
   CardContent,
   Tooltip,
   Rating,
 } from "@mui/material";
 import { useParams } from "react-router-dom";
 import StarIcon from "@mui/icons-material/Star";
 import TranslateIcon from "@mui/icons-material/Translate";
 import { useTranslation } from "react-i18next";
 
 const API_BASE_URL = "http://localhost:8000";

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
   const [userData, setUserData] = useState(null);
   const [comments, setComments] = useState([]);
   const [loading, setLoading] = useState(true);
   const [newComment, setNewComment] = useState("");
   const [rating, setRating] = useState(0);
   const [error, setError] = useState(null);
   const [translatedComments, setTranslatedComments] = useState({});
   const [translating, setTranslating] = useState({});
   const { t, i18n } = useTranslation("global");
 
   useEffect(() => {
     const fetchComments = async () => {
       try {
         const response = await axios.get(`${API_BASE_URL}/comments/${food_id}`);
         setComments(response.data);
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
    const token = localStorage.getItem("accessToken");
    console.log("Token", token)
    if (!token) {
      alert("You have to login before submit a comment.");
      return;
    }
        
    if (!newComment.trim() || rating === 0) return;
    try {
      if (!userData) {
        try {
          const userResponse = await axios.get(`${API_BASE_URL}/auth/users/me`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : ''
            }
          });
          console.log(userResponse)
          setUserData(userResponse.data.data[0]);
        } catch (userError) {
          console.error("Error fetching user data:", userError);
        }
      }
      console.log(userData)
      const response = await axios.post(
        `${API_BASE_URL}/comments`, 
        {
          food_id: food_id,
          rate: rating,
          comment: newComment
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
  
      if (response.data && userData) {
        setComments([
          {
            ...response.data.data,
            userName: userData.username,
            userAvatar: userData.avatarId,
            rate: rating
          },
          ...comments
        ]);
      }
      
      // Reset form
      setNewComment("");
      setRating(0);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to submit comment. Please try again.");
    }
  };
 
   const translateComment = async (uniqueKey, text) => {
     // Mark this comment as translating
     setTranslating((prev) => ({ ...prev, [uniqueKey]: true }));
     try {
       const targetLanguage = i18n.language;
       console.log(targetLanguage)
       const response = await axios.post(`${API_BASE_URL}/translation/`, {
         text: text,
         target_lang: targetLanguage,
       });
       setTranslatedComments((prev) => ({
         ...prev,
         [uniqueKey]: response.data.translated_text,
       }));
     } catch (error) {
       console.error("Translation error:", error);
       setTranslatedComments((prev) => ({
         ...prev,
         [uniqueKey]: `${t("translationError")}`,
       }));
     } finally {
       setTranslating((prev) => ({ ...prev, [uniqueKey]: false }));
     }
   };
 
   return (
     <Box sx={{ maxWidth: 800, margin: "0 auto", padding: "10px" }}>
       {loading ? (
         <CircularProgress />
       ) : error ? (
         <Typography color="error">{error}</Typography>
       ) : (
         <List>
           {comments.map((comment, index) => {
             // Create a unique key using comment.id and index
             const uniqueKey = `${comment.id}-${index}`;
             return (
               <Card
                 key={uniqueKey}
                 sx={{
                   marginBottom: 1,
                   padding: 1,
                   borderRadius: "12px",
                   maxWidth: "100%",
                   display: "block",
                   minHeight: "60px",
                   boxShadow: 1,
                 }}
               >
                 <CardContent>
                   <ListItem alignItems="flex-start" sx={{ alignItems: "center" }}>
                     <ListItemAvatar>
                       <IconButton onClick={() => (window.location.href = `/profile/${comment.userName}`)}>
                         <Avatar src={`/avatars/${comment.userAvatar}.png`} alt={comment.userName} />
                       </IconButton>
                     </ListItemAvatar>
                     <ListItemText
                       primary={
                         <>
                           <Box
                             sx={{
                               display: "flex",
                               alignItems: "center",
                               justifyContent: "space-between",
                             }}
                           >
                             <Box>
                               <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                 {comment.userName}
                               </Typography>
                               <Rating name="read-only" value={comment.rate || 0} readOnly precision={0.5} 
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
                             </Box>
                             <Tooltip title={t("translate")}>
                               <IconButton
                                 onClick={() => translateComment(uniqueKey, comment.comment)}
                                 sx={{
                                   width: "30px",
                                   height: "30px",
                                   padding: "2px",
                                   "&:hover": {
                                     backgroundColor: "rgba(0, 0, 0, 0.04)",
                                     transform: "none",
                                   },
                                 }}
                                 disabled={translating[uniqueKey]}
                               >
                                 {translating[uniqueKey] ? (
                                   <CircularProgress size={16} />
                                 ) : (
                                   <TranslateIcon sx={{ fontSize: 16 }} />
                                 )}
                               </IconButton>
                             </Tooltip>
                           </Box>
                         </>
                       }
                       secondary={
                         <>
                           <Typography
                             sx={{
                               wordWrap: "break-word",
                               marginTop: "4px",
                               fontSize: "14px",
                             }}
                           >
                             {comment.comment}
                           </Typography>
                           {translatedComments[uniqueKey] && (
                             <Box sx={{ mt: 1, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                               <Typography
                                 variant="caption"
                                 sx={{
                                   color: "text.secondary",
                                   display: "block",
                                   mb: 0.5,
                                 }}
                               >
                                 {t("translated")}:
                               </Typography>
                               <Typography sx={{ fontSize: "14px" }}>
                                 {translatedComments[uniqueKey]}
                               </Typography>
                             </Box>
                           )}
                         </>
                       }
                     />
                   </ListItem>
                 </CardContent>
               </Card>
             );
           })}
         </List>
       )}
 
       {/* Add Comment Section */}
       <Box sx={{ marginTop: "10px" }}>
         <Typography variant="h6">{t("leaveComment")}</Typography>
         <StarRating value={rating} onChange={setRating} />
         <TextField
           fullWidth
           variant="outlined"
           placeholder={t("writeComment")}
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
           {t("submit")}
         </Button>
       </Box>
     </Box>
   );
 };
 
 export default Comments;