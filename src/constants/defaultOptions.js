const ENGLISH = 'en';
const GERMAN = 'de';

exports.ENGLISH = ENGLISH;
exports.GERMAN = GERMAN;

exports.DEFAULT_OPTIONS = {
  supportedLanguages: [ENGLISH, GERMAN],
  defaultLanguage: ENGLISH,
  siteUrl: process.env.URL || 'localhost:8080',
  notFoundPage: '/404/',
  excludedPages: [],
  deleteOriginalPages: true,
};
