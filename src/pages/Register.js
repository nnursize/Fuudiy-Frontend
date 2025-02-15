// src/pages/Register.js
import React, { useEffect, useState } from 'react';
import Frame from '../components/Frame';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();

  // State for form inputs
  const [username, setUsername] = useState('');
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    console.log("Register form submitted");
  
    const payload = {
      username,
      email,
      password,
    };
  
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // If errorData.detail is an object or array, convert it to a string
        const errorDetail =
          typeof errorData.detail === 'object'
            ? JSON.stringify(errorData.detail)
            : errorData.detail;
        setErrorMsg(errorDetail || 'Registration failed');
        return;
      }
  
      const data = await response.json();
      console.log("Registration successful", data);
      // Optionally store the token if your backend returns one
      localStorage.setItem('accessToken', data.access_token);
      // Navigate to another page, e.g., a survey page, after successful registration
      navigate('/survey');
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMsg("An error occurred during registration.");
    }
  };
  return (
    <Frame title={t('register')} onSubmit={handleRegisterSubmit}>
      <LanguageSwitcher changeLanguage={changeLanguage} />

      <h1>{t('register')}</h1>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {/* Username Input */}
      <div className="input-box">
        <input 
          type="text" 
          placeholder={t('username')} 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <FaUser className="icon" />
      </div>
      {/* Email Input */}
      <div className="input-box">
        <input 
          type="email" 
          placeholder={t('email')} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <MdEmail className="icon" />
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
          {t('have_account')}{" "}
          <Link to="/login" className="toggle-link">{t('login')}</Link>
        </p>
      </div>
      <button type="submit">{t('register')}</button>
    </Frame>
  );
};

export default Register;
