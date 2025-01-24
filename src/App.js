import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import FoodDetailPage from './pages/FoodDetailPage';
import LoginRegister from './components/LoginRegister/LoginRegister';
import Survey from './components/Survey/Survey';
import UserProfile from './pages/UserProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route: "/" points to Home */}
       {/* {<Route path="/" element={<Home />} />} */}

        {/* Dynamic Route for Food Details */}
       {/* <Route path="/food/:id" element={<FoodDetailPage />} /> */}

        {/* Fallback Route: Redirect to Home if no match */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}

        <Route path="/" element={<LoginRegister />} /> {/* LoginRegister route */}
      
        <Route path="/Survey" element={<Survey />} /> {/* Survey route */}

        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
};

export default App;