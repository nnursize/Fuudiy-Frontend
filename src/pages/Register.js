// src/pages/Register.js
import React, { useEffect } from 'react';
import Frame from '../components/Frame';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { Link,useNavigate } from 'react-router-dom';

const Register = () => {
  const { t, i18n } = useTranslation("global");

  // Add `frame-body` class to the body when this component is mounted
  useEffect(() => {
    document.body.classList.add('frame-body'); // Add the class
    return () => {
      document.body.classList.remove('frame-body'); // Cleanup on unmount
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
      .then(() => console.log(`Language changed to: ${lng}`))
      .catch((err) => console.error("Language switch failed:", err));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log("Register form submitted");
  };

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/survey');
  };

  return (
    <Frame title={t('register')} onSubmit={handleRegisterSubmit}>
      {/* Language Switcher */}
      <LanguageSwitcher changeLanguage={changeLanguage} />

      <h1>{t('register')}</h1>
      {/* Register Form Fields */}
      <div className="input-box">
        <input type="text" placeholder={t('username')} required />
        <FaUser className="icon" />
      </div>
      <div className="input-box">
        <input type="email" placeholder={t('email')} required />
        <MdEmail className="icon" />
      </div>
      <div className="input-box">
        <input type="password" placeholder={t('password')} required />
        <FaLock className="icon" />
      </div>
      <div className="register-link">
        <p>
          {t('have_account')}{" "}
          <Link to="/login" className="toggle-link">{t('login')}</Link>
        </p>
      </div>
      <button type="submit" onClick={handleLogin}>{t('register')}</button>
    </Frame>
  );
};

export default Register;
