const fs = require('fs-extra');
const path = require('path');
const { DEFAULT_OPTIONS } = require('./src/constants/defaultOptions');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

exports.onPostBuild = () => {
  console.log('Copying locales');
  fs.copySync(
    path.join(__dirname, '/src/locales'),
    path.join(__dirname, '/public/locales'),
  );
};

/**
 * Makes sure to create localized paths for each file in the /pages folder.
 * For example, pages/404.js will be converted to /en/404.js and /el/404.js and
 * it will be accessible from https:// .../en/404/ and https:// .../el/404/
 */

exports.onCreatePage = async ({
  page,
  actions: { createPage, createRedirect, deletePage },
}) => {
  const {
    defaultLanguage,
    deleteOriginalPages,
    excludedPages,
    notFoundPage,
    supportedLanguages,
  } = DEFAULT_OPTIONS;

  const isEnvDevelopment = process.env.NODE_ENV === 'development';
  const originalPath = page.path;
  const is404 = originalPath.includes(notFoundPage);

  if (excludedPages.includes(originalPath)) {
    return;
  }
  // Delete the original page (since we are gonna create localized versions of it)
  await deletePage(page);

  if (!deleteOriginalPages) {
    await createPage({
      ...page,
      context: {
        ...page.context,
        originalPath,
        lang: defaultLanguage,
      },
    });
  }

  // Create one page for each locale
  await Promise.all(
    supportedLanguages.map(async (lang) => {
      const localizedPath = `/${lang}${page.path}`;

      // create a redirect based on the accept-language header
      createRedirect({
        fromPath: originalPath,
        toPath: localizedPath,
        Language: lang,
        isPermanent: false,
        redirectInBrowser: isEnvDevelopment,
        statusCode: is404 ? 404 : 301,
      });

      let matchPath = page.matchPath ? `/${lang}${page.matchPath}` : undefined;
      const regexp = new RegExp('/404/?$');
      if (regexp.test(page.path)) {
        matchPath = lang === defaultLanguage ? '/*' : `/${lang}/*`;
      }

      await createPage({
        ...page,
        path: localizedPath,
        matchPath,
        context: {
          ...page.context,
          originalPath,
          lang,
        },
      });
    }),
  );

  if (deleteOriginalPages) {
    createRedirect({
      fromPath: originalPath,
      toPath: `/${defaultLanguage}${page.path}`,
      isPermanent: false,
      redirectInBrowser: isEnvDevelopment,
      statusCode: 301,
    });
  }
};
