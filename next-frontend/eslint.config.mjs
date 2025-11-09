// eslint.config.mjs

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Exported ESLint configuration.
 * Uses a layered config array to compose multiple presets.
 */
const eslintConfig = defineConfig([
  // Next.js recommended lint rules
  ...nextVitals,

  // TypeScript-aware preset
  ...nextTs,

  /**
   * Override Next.js default ignore list.
   * 
   * This prevents accidental linting inside build artifacts and generated files.
   *
   * If additional folders should be excluded (e.g., /dist),
   * add them here explicitly.
   */
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
