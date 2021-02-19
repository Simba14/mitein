exports.DEFAULT_OPTIONS = {
  supportedLanguages: ['en', 'de'],
  defaultLanguage: 'en',
  siteUrl: process.env.URL || 'localhost:8080',
  notFoundPage: '/404/',
  excludedPages: [],
  deleteOriginalPages: true,
};
