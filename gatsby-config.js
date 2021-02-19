require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  plugins: [
    `gatsby-plugin-netlify`,
    'gatsby-alias-imports',
    `gatsby-plugin-preload-fonts`,
    {
      resolve: 'gatsby-plugin-env-variables',
      options: {
        whitelist: [
          'API_URL',
          'COOKIE_USER_ID_IDENTIFIER',
          'COOKIE_USER_ID_EXPIRE_DAYS',
        ],
      },
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'Mitein',
        fieldName: 'mitein',
        url: process.env.API_URL,
      },
    },
    'gatsby-plugin-graphql-tag-loader',
    'gatsby-plugin-sass',
    'gatsby-plugin-mini-css-class-name',
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /assets/,
        },
      },
    },
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `${__dirname}/locales`,
    //     name: `locale`,
    //   },
    // },
    // {
    //   resolve: `gatsby-plugin-react-i18next`,
    //   options: {
    //     localeJsonSourceName: `locale`, // name given to `gatsby-source-filesystem` plugin.
    //     languages: [`en`, `de`],
    //     defaultLanguage: `en`,
    //     i18nextOptions: {
    //       debug: 'true',
    //       react: {
    //         transSupportBasicHtmlNodes: true,
    //         transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    //       },
    //     },
    //   },
    // },
  ],
};
