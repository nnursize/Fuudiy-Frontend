import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import global_en from "./translations/en/global.json"
import global_tr from "./translations/tr/global.json"
import iI18Next from "i18next";
import './i18n';

iI18Next.init({
  interpolation :{escapeValue: false},
  lng: "en",
  resources:{
    en: {
      global: global_en,
    },
    tr:{
      global: global_tr,
    },
  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();