export default {
  root: true,
  plugins: ['@angular-eslint', 'import', 'jsdoc', 'prefer-arrow'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: [
    'plugin:@angular-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsdoc/recommended',
    'prettier', // If you have Prettier configured, add this to prevent conflicts.
  ],
  rules: {
    // Enforces the indentation of x spaces
    indent: ['error', 2],
    // Enforces the use of semicolon when necessary
    semi: ['error', 'always'],
    // Enforces the use of single quotes for strings
    quotes: ['error', 'single'],
    // Requires variables to be initialized when declared
    'init-declarations': 'error',
    // Flags variables that are declared but not used
    'no-unused-vars': 'error',
    // Flags imported modules that are not used
    'no-unused-vars': 'error',
    // Disallows trailing spaces at the end of lines
    'no-trailing-spaces': 'error',
    // Enforces the use of strict equality (=== and !==)
    eqeqeq: 'error',
    // Disallows the use of console.log() and other console methods in production code
    'no-console': 'warn',
    // Disallows the use of debugger statements in production code
    'no-debugger': 'error',
    // Disallows the use of var and encourages using let or const
    'no-var': 'error',
  },
};
