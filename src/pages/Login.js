// src/pages/Login.js
import React, { useEffect, useState } from 'react';
import Frame from '../components/Frame';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { FaUser, FaLock } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

const Login = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.body.classList.add('frame-body');
    return () => {
      document.body.classList.remove('frame-body');
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
      .then(() => console.log(`Language changed to: ${lng}`))
      .catch((err) => console.error("Language switch failed:", err));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    console.log("Login form submitted");

    // Build the payload
    const payload = { email, password };

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.detail || 'Login failed');
        return;
      }

      const data = await response.json();
      console.log("Login successful", data);
      // Store the token in localStorage (or use another storage method)
      localStorage.setItem('accessToken', data.access_token);
      // Redirect to the homepage or desired page after login
      navigate('/');
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMsg("An error occurred during login.");
    }
  };

  return (
    <Frame title={t('login')} onSubmit={handleLoginSubmit}>
      {/* Language Switcher positioned at top-right */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: '10px',
          right: '15px',
        }}
      >
        <LanguageSwitcher 
          changeLanguage={changeLanguage} 
          size="large" 
          height="35px" 
          width="35px" 
          fontSize="0.8rem" 
          color="white" 
        />
      </Box>

      <h1>{t('login')}</h1>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      {/* Email Input */}
      <div className="input-box">
        <input 
          type="email" 
          placeholder={t('email') || "Email"} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <FaUser className="icon" />
      </div>

      {/* Password Input */}
      <div className="input-box">
        <input 
          type="password" 
          placeholder={t('password')} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <FaLock className="icon" />
      </div>

      <div className="register-link">
        <p>
          {t('no_account')}{" "}
          <Link to="/register" className="toggle-link">{t('register')}</Link>
        </p>
      </div>

      <button type="submit">{t('login')}</button>
    </Frame>
  );
};

export default Login;
