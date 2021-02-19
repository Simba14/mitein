import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import locales from 'locales';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  debug: 'true',
  resources: locales,
  react: {
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    useSuspense: false,
  },
});

export default i18n;
