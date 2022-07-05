const ENGLISH = 'en';
const GERMAN = 'de';

exports.ENGLISH = ENGLISH;
exports.GERMAN = GERMAN;

exports.DEFAULT_OPTIONS = {
  supportedLanguages: [ENGLISH, GERMAN],
  defaultLanguage: ENGLISH,
  siteUrl: process.env.UI_HOST || 'localhost:8000',
  notFoundPage: '/404/',
  excludedPages: [],
  deleteOriginalPages: true,
};
