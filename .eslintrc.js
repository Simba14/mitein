module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    'prettier/prettier': 'error',
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
  },
  overrides: [
    {
      files: ['*.jsx'],
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
