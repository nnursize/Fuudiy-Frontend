// src/pages/Login.js
import React from 'react';
import Frame from '../components/Frame';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { FaUser, FaLock } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Login = () => {
  const { t, i18n } = useTranslation("global");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
      .then(() => console.log(`Language changed to: ${lng}`))
      .catch((err) => console.error("Language switch failed:", err));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted");
  };

  return (
    <Frame title={t('login')} onSubmit={handleLoginSubmit}>
      {/* Language Switcher */}
      <LanguageSwitcher changeLanguage={changeLanguage} />

      {/* Login Form Fields */}
      <div className="input-box">
        <input type="text" placeholder={t('username')} required />
        <FaUser className="icon" />
      </div>
      <div className="input-box">
        <input type="password" placeholder={t('password')} required />
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
