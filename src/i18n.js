import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './translations/en/global.json';
import translationTR from './translations/tr/global.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      tr: { translation: translationTR },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
