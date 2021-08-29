module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
  },
};
