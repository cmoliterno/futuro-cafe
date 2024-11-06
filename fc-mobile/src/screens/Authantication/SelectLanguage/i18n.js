import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {en, ara, Spa, Fr, Br} from '../../../../src';

i18n.use(initReactI18next).init({
  lng: 'br',
  fallbackLng: 'br',
  compatibilityJSON: 'v3',
  resources: {
    en: en,
    ara: ara,
    fr: Fr,
    spa: Spa,
    br: Br,
  },
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
