import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        Module: "readonly",
        Log: "readonly",
        MM: "readonly",
        config: "readonly",
        moment: "readonly"
      }
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^notification" }]
    }
  }
]);
