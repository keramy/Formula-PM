module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    // Variable and import rules
    'no-unused-vars': ['warn', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'ignoreRestSiblings': true 
    }],
    'no-undef': 'error',
    'prefer-const': 'warn',
    'no-var': 'error',
    
    // Console and debugging
    'no-console': ['warn', { 'allow': ['warn', 'error'] }],
    'no-debugger': 'warn',
    'no-alert': 'warn',
    
    // Code quality
    'no-duplicate-imports': 'error',
    'no-unreachable': 'error',
    'no-unreachable-loop': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    
    // Function and component rules
    'max-lines-per-function': ['warn', { 'max': 100, 'skipBlankLines': true, 'skipComments': true }],
    'max-params': ['warn', 5],
    'complexity': ['warn', { 'max': 10 }],
    
    // React specific rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-unescaped-entities': 'warn',
    'react/jsx-uses-vars': 'error',
    
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Styling and formatting
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }],
    
    // Performance and best practices
    'no-useless-concat': 'error',
    'prefer-template': 'warn',
    'object-shorthand': 'warn',
    'prefer-destructuring': ['warn', { 'object': true, 'array': false }],
    
    // Error handling
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error'
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*'],
      rules: {
        'no-console': 'off',
        'max-lines-per-function': 'off'
      }
    }
  ]
};