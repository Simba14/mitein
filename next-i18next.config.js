const path = require('path');

module.exports = {
  i18n: {
    defaultNS: 'home',
    defaultLocale: 'en',
    locales: ['en', 'de'],
    lng: 'en',
    fallbackLng: 'en',
    debug: 'true',
    localePath: path.resolve('./public/locales'),
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      useSuspense: false,
    },
  },
};
