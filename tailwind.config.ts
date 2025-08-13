/**
 * Tailwind CSS v4 uses zero-config for content scanning.
 * Keep plugin for animations; other theme tokens are provided via CSS variables.
 */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class", ":root"],
  plugins: [tailwindcssAnimate],
} satisfies import("tailwindcss").Config;
