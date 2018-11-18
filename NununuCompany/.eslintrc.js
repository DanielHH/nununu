module.exports = {
  'parser': 'babel-eslint',
  'extends': ['eslint:recommended', 'plugin:react/recommended'],
  'parserOptions': {
    'ecmaVersion': 2018,
    'ecmaFeatures': {
      'jsx': true,
    },
    'sourceType': 'module',
  },
  'env': {
    'react-native/react-native': true,
  },
  'plugins': ['react', 'react-native'],
  'rules': {
    'indent': [
      'error',
      2,
      {'MemberExpression': 0},
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'never',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'react-native/no-unused-styles': 2,
    'react-native/no-color-literals': 2, // all colors should be defined
    'react-native/no-inline-styles': 2,
  },
}
