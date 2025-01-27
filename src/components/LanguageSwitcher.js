// src/components/LanguageSwitcher.js
import Reac,{ useState}  from 'react';
import './LanguageSwitcher.css';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
const LanguageSwitcher =  ({ changeLanguage }) =>  {
  const [language, setLanguage] = useState('en'); // Default language is English

  const handleChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
      console.log(`Language switched to: ${newLanguage}`); // For demonstration purposes
      // You can integrate a translation library here (e.g., i18next)
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <ToggleButtonGroup
        color="primary"
        value={language}
        exclusive
        onChange={handleChange}
        aria-label="Language Selector"
        sx={{ marginBottom: 2}}
        
      >
        <ToggleButton  value="en" aria-label="English" onClick={() => changeLanguage('en')}  sx={{ borderRadius: 5 }}>
          EN
        </ToggleButton>
        <ToggleButton  value="tr" aria-label="Turkish" onClick={() => changeLanguage('tr')}sx={{ borderRadius: 5 }}>
          TR
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default LanguageSwitcher;
/*
const LanguageSwitcher = ({ changeLanguage }) => {
  return (
    <div className="language-switch">
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('tr')}>TR</button>
    </div>
  );
};

export default LanguageSwitcher;
*/