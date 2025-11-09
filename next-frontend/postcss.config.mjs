// postcss.config.mjs

/** @type {import("postcss-load-config").Config} */
const config = {
  plugins: {
    /**
     * Tailwind CSS PostCSS integration.
     * Required to enable Tailwind’s utility and layer transformations.
     */
    "@tailwindcss/postcss": {},
    // Example to add additional plugins later:
    // autoprefixer: {},
  },
};

export default config;
