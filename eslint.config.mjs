import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import { importX } from "eslint-plugin-import-x";

export default defineConfig(
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  prettierConfig,
  tseslint.configs.recommendedTypeChecked,
  {
    ignores: ["eslint.config.mjs", "**/dist/**", ".pnpm.store/**", "**/node_modules/**"],
  },
  {
    extends: ["import-x/flat/recommended"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "import-x": importX,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: "latest",
      sourceType: "commonjs",
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "import-x/no-dynamic-require": "warn",
    },
  },
);
