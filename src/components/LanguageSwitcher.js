// src/components/LanguageSwitcher.js
import React from 'react';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ changeLanguage }) => {
  return (
    <div className="language-switch">
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('tr')}>TR</button>
    </div>
  );
};

export default LanguageSwitcher;
