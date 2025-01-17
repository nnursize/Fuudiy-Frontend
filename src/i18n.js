import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translations/en/global.json';
import tr from './translations/tr/global.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en', // Default language
  lng: 'en', // Initial language
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
