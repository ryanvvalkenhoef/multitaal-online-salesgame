import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // ESLint rules
      semi: ["error", "always"],
      quotes: [
        "error",
        "single",
        {
          allowTemplateLiterals: true, // Allow backticks
          avoidEscape: true, // Avoid escaping quotes unnecessarily
        },
      ],
      indent: ["error", 2],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      "space-before-function-paren": ["error", "never"],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1, // Maximum number of consecutive empty lines
          maxEOF: 1, // Maximum number of empty lines at the end of the file
          maxBOF: 0, // Maximum number of empty lines at the beginning of the file
        },
      ],
      // Prettier rules
      "prettier/prettier": "error",
    },
    plugins: {
      prettier: pluginPrettier,
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettierConfig,
];
