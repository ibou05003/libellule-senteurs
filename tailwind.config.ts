/**
 * Tailwind CSS configuration — kept as a reference document.
 *
 * NOTE: This project uses Tailwind CSS v4, which reads theme tokens from
 * globals.css via the `@theme` directive rather than from this file.
 * This file documents the design tokens for developer reference and is
 * retained in case a downgrade to v3 is ever needed.
 *
 * Actual effective tokens are in src/app/globals.css under `@theme`.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "or-luxe": "#C99700",
        "noir-profond": "#000000",
        "blanc-casse": "#F8F8F8",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Playfair Display", "serif"],
        body: ["var(--font-jost)", "Jost", "sans-serif"],
      },
      spacing: {
        section: "clamp(80px, 12vh, 160px)",
      },
    },
  },
  plugins: [],
};
export default config;
