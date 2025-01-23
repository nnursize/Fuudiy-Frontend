import React from 'react';
import '../styles/LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const [t, i18n ] = useTranslation("global");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className='wrapper'>
        {/* Language Switcher */}
        <div className="language-switch">
            <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('tr')}>Türkçe</button>
        </div>

        <form action=''>
            <h1>{t('login')}</h1>
            <div className="input-box">
                <input type='text' placeholder={t('username')} required/> 
                <FaUser className='icon'/>
            </div>
            <div className="input-box">
                <input type='password' placeholder={t('password')} required/> 
                <FaLock className='icon'/>
            </div>

            <div className="remember-forgot">
                <label><input type='checkbox'/> {t('remember_me')}</label>
                <a href='#'>{t('forgot_password')}</a>
            </div>

            <button type='submit'>{t('login')}</button>

            <div className="register-link">
                <p>{t('no_account')} <a href="#">{t('register')}</a></p> 
            </div>
        </form>
    </div>
  );
}

export default LoginForm;
