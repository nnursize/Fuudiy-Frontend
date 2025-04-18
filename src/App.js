import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- add this

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Explore from "./pages/Explore";
import FoodDetailPage from './pages/FoodDetailPage';
import Survey from './pages/Survey';
import UserProfile from './pages/UserProfile';
import ForgotPassword from './pages/ForgotPassword';



const App = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientId}> {/* Replace this */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/food/:id" element={<FoodDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:USERNAME" element={<UserProfile />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
