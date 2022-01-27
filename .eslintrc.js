module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  ignorePatterns: ["*.json", "scripts/assets/"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      node: {}, // placed above other resolver configs
    },
  },
  plugins: ["react"],
  rules: {
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "import/no-extraneous-dependencies": ["error", { packageDir: "." }],
    "consistent-return": "off",
    "import/no-named-as-default": 0,
    "import/no-named-as-default-member": 0,
    "react/function-component-definition": [
      2,
      { namedComponents: "arrow-function" },
    ],
  },
  overrides: [
    {
      files: ["scripts/*.js"],
      rules: {
        "no-console": "off",
        "import/extensions": "off",
      },
    },
  ],
};
