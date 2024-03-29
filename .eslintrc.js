'use strict';

module.exports = {
  extends: 'airbnb-base',
  env: {
    es6: true,
    jasmine: true,
  },

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },

  rules: {
    'arrow-body-style': 'off',
    'class-methods-use-this': 'off',
    'lines-between-class-members': ['error', 'always', {
      exceptAfterSingleLine: true,
    }],
    'max-classes-per-file': 'off',
    'max-len': ['error', { code: 80 }],
    'no-continue': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
    }],
    'no-use-before-define': 'off',
    'object-curly-newline': 'off',
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'strict': ['error', 'global'],
  },
};
