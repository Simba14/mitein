import i18n from 'i18next';
import { initReactI18next } from 'next-i18next';

import locales from 'locales';
import { ENGLISH } from 'constants/defaultOptions';

export const i18nOptions = {
  lng: ENGLISH,
  fallbackLng: ENGLISH,
  debug: 'true',
  resources: locales,
  react: {
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    useSuspense: false,
  },
};

i18n.use(initReactI18next).init(i18nOptions);

export default i18n;
