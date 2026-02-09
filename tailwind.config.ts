// tailwind.config.ts

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      fontFamily: {
        // We define a CSS variable `--font-primary` which will be set by @next/font
        primary: ["var(--font-primary)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
