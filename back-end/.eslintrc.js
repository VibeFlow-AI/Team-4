module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "sonarjs"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:sonarjs/recommended",
    "prettier",
  ],
  rules: {
    'sonarjs/cognitive-complexity': ['warn', 15],
    'sonarjs/no-duplicate-string': ['warn', 3],
  },
  env: {
    node: true,
    es6: true,
  },
};
