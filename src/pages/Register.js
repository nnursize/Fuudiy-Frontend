// src/pages/Register.js
import React from 'react';
import Frame from '../components/Frame';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Register = () => {
  const { t, i18n } = useTranslation("global");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
      .then(() => console.log(`Language changed to: ${lng}`))
      .catch((err) => console.error("Language switch failed:", err));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log("Register form submitted");
  };

  return (
    <Frame title={t('register')} onSubmit={handleRegisterSubmit}>
      {/* Language Switcher */}
      <LanguageSwitcher changeLanguage={changeLanguage} />

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
      <button type="submit">{t('register')}</button>
    </Frame>
  );
};

export default Register;
