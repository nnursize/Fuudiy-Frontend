import React, { useState } from "react";
import "./LanguageSwitcher.css";

const LanguageSwitcher = ({ changeLanguage }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "tr" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <div className="language-switcher">
      <button className="language-toggle" onClick={toggleLanguage}>
        {currentLanguage.toUpperCase()}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
