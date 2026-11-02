import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0C0B0A",
          900: "#141312",
          850: "#1A1816",
          800: "#22201D",
          700: "#312E2A",
          600: "#44403B",
          500: "#605C55",
        },
        cream: {
          50: "#FCFAF6",
          100: "#F7F2E9",
          200: "#EFE6D7",
          300: "#E1D2BE",
          400: "#C3B19A",
          500: "#9E8B75",
        },
        terracotta: {
          400: "#F08C4A",
          500: "#E26D28",
          600: "#C95716",
        },
        sage: {
          400: "#65B888",
          500: "#469766",
          600: "#32774E",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

