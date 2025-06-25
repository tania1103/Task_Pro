import { use } from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const i18n = use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    resources: {
      en: {
        translation: require('./locales/en/translation.json'),
      },
      uk: {
        translation: require('./locales/uk/translation.json'),
      },
    },
    detection: {
      order: ['localStorage', 'navigator'],
    },
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18n;
