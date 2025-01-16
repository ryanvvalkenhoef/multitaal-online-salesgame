import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Base config for JavaScript and Node.js
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // ESLint rules for code quality (no formatting rules here!)
      semi: ["error", "always"],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      "space-before-function-paren": ["error", "never"],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 1,
          maxBOF: 0,
        },
      ],
    },
  },
  // Recommended JS rules
  pluginJs.configs.recommended,
  // React rules
  pluginReact.configs.flat.recommended,
  // Prettier config to disable conflicting ESLint rules
  prettierConfig,
];
