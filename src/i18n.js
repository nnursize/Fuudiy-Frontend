import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './translations/en/global.json';
import translationTR from './translations/tr/global.json';

const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      tr: { translation: translationTR },
    },
    lng: savedLanguage, // <- Use saved language
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
