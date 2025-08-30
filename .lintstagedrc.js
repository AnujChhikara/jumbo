module.exports = {
  // Lint and format TypeScript/JavaScript files
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],

  // Format other files
  '**/*.{json,css,md,yml,yaml}': ['prettier --write'],
};
