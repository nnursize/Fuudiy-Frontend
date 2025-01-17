import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle login/register form
  const {t, i18n} = useTranslation("global");
  //const {t} = useTranslation("global");
  console.log(t("login")); // Should show the translated string based on the selected language


  // Change language function
  const changeLanguage = (lng) => {
    console.log(`Switching language to: ${lng}`); // Check if this appears in the console
    i18n.changeLanguage(lng)
    .then(() => console.log(`Language changed to: ${lng}`))
    .catch((err) => console.error("Language switch failed:", err));
  };

  return (
    <div className="wrapper">
      <div className="language-switch">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('tr')}>TR</button>
      </div>
      
      {isLogin ? (
        <div className="form-box login">
          <form>
            <h1>{t('login')}</h1>
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
                <span className="toggle-link" onClick={() => setIsLogin(false)}>{t('register')}</span>
              </p>
            </div>
            <button type="submit">{t('login')}</button>
          </form>
        </div>
      ) : (
        <div className="form-box register">
          <form>
            <h1>{t('register')}</h1>
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
                <span className="toggle-link" onClick={() => setIsLogin(true)}>{t('login')}</span>
              </p>
              <p>
                <Link to="/Survey">{t('go_to_survey')}</Link>
              </p>
            </div>
            <button type="submit">{t('register')}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginRegister;
