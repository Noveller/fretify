import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import en from './locales/en.json';
import ro from './locales/ro.json';

// When migrating to BE, swap the `resources` block for i18next-http-backend:
//   import HttpBackend from 'i18next-http-backend';
//   .use(HttpBackend)
//   backend: { loadPath: '/api/i18n/{{lng}}' }

const STORAGE_KEY = 'fretify:lang';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      ro: { translation: ro },
    },
    lng:          localStorage.getItem(STORAGE_KEY) ?? 'ru',
    fallbackLng:  'ru',
    interpolation: { escapeValue: false },
  });

export function setLanguage(lang: string) {
  i18n.changeLanguage(lang);
  localStorage.setItem(STORAGE_KEY, lang);
}

export const LANGUAGES = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'ro', label: 'RO' },
] as const;

export default i18n;
