import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const LoginRegister = () => {
    const [action, setAction] = useState(''); // Track active or passive state

    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction(' passive');
    };

    const [t, i18n] = useTranslation("global");

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className={`wrapper${action}`}>
            
            <div className='form-box login'>
                <div className="language-switch">
                    <button onClick={() => changeLanguage('en')}>EN</button>
                    <button onClick={() => changeLanguage('tr')}>TR</button>
            </div>
                <form action=''>
                    <h1>{t('login')}</h1>
                    <div className="input-box">
                        <input type='text' placeholder={t('username')} required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type='password' placeholder={t('password')} required />
                        <FaLock className='icon' />
                    </div>

                    <div className="remember-forgot">
                        <label><input type='checkbox' /> {t('remember_me')}</label>
                        <a href='#'>{t('forgot_password')}</a>
                    </div>

                    <button type='submit'>{t('login')}</button>

                    <div className="register-link">
                        <p>{t('no_account')} <a href="#" onClick={registerLink} >{t('register')}</a></p>
                    </div>
                </form>
            </div>

            <div className='form-box register'>

            <div className="language-switch">
                    <button onClick={() => changeLanguage('en')} >EN</button>
                    <button onClick={() => changeLanguage('tr')} >TR</button>
                </div>
                <form action=''>
                    <h1>{t('register')}</h1>
                    <div className="input-box">
                        <input type='text' placeholder={t('username')} required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type='email' placeholder={t('email')} required />
                        <MdEmail className='icon' />
                    </div>
                    <div className="input-box">
                        <input type='password' placeholder={t('password')}required />
                        <FaLock className='icon' />
                    </div>

                    <div className="remember-forgot">
                        <label><input type='checkbox' /> {t('agree_terms')}</label>
                    </div>

                    <button type='submit'> {t('register')} </button>
 <div className="register-link">
                        <p><Link to="/Survey">Go to Survey</Link></p>
                    </div>
                    <div className="register-link">
                        <p>{t('have_account')} <a href="#" onClick={loginLink}>{t('login')}</a></p>
                    </div>
                   
                </form>
            </div>
        </div>
    );
}

export default LoginRegister;
