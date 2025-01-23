import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import FoodDetailPage from './pages/FoodDetailPage';
import LoginRegister from './pages/LoginRegister';
import Survey from './pages/Survey';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Default route */}
        <Route path="/login" element={<LoginRegister />} /> {/* LoginRegister route */}
      </Routes>
    </Router>
  );
};

export default App;