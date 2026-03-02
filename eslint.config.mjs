import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", // Required for modern Flat Config
      globals: {
        ...globals.browser,
        ...globals.node,
        // Custom MagicMirror Globals to prevent "not defined" errors
        Module: "readonly",
        Log: "readonly",
        MM: "readonly",
        config: "readonly",
        moment: "readonly"
      }
    },
    rules: {
      "no-console": "off", // Allows console.error in node_helper
      "no-unused-vars": ["error", { "argsIgnorePattern": "^notification" }] // Ignores MM's standard unused vars
    }
  }
];
