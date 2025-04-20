import React, { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const LanguageSwitcher = ({ changeLanguage, size = "small", height = "25px", width = "25px", fontSize = "0.7rem", padding = "2px", display='flex' }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  const handleChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
      changeLanguage(newLanguage);
      localStorage.setItem('language', newLanguage); // <- Persist selection
    }
  };

  return (
    <div className="language-switcher">
      <ToggleButtonGroup
        color="primary"
        value={language}
        exclusive
        onChange={handleChange}
        aria-label="Language Selector"
        sx={{
          display: "inline-flex", // Ensure it behaves inline
          alignItems: "center",
          height: height,
          width: "auto",
          borderRadius: "5px",
        }}
      >
        <ToggleButton
          value="en"
          aria-label="English"
          className="language-toggle"
          sx={{
            borderRadius: "50%", // Fully circular
            height: height,
            width: width,
            fontSize: fontSize,
            padding: padding,
            minWidth: "unset",
            border: "1px black", // Keep border consistent
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgb(204, 201, 201)",
              color: "black",
            },
          }}
        >
          EN
        </ToggleButton>
        <ToggleButton
          value="tr"
          aria-label="Turkish"
          className="language-toggle"
          sx={{
            borderRadius: "50%", // Fully circular
            height: height,
            width: width,
            fontSize: fontSize,
            padding: padding,
            minWidth: "unset",
            border: "1px black", // Keep border consistent
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgb(204, 201, 201)",
              color: "black",
            },
          }}
        >
          TR
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default LanguageSwitcher;