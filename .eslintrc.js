module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'arrow-body-style': 'off',
    'consistent-return': 'off',
    'default-case': 'off',
    'global-require': 'off',
    'linebreak-style': 0,
    'no-await-in-loop': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-param-reassign': 0,
    'no-unused-expressions': 'off',
    'no-restricted-syntax': 'off',
    'prefer-const': 'off',
    radix: 'off',
  },
};
