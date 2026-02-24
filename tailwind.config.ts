import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f8f3eb",
        champagne: "#d7c19a",
        charcoal: "#1b1a18",
        ivory: "#fffdf8"
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-montserrat)", "sans-serif"]
      },
      boxShadow: {
        luxe: "0 12px 40px rgba(0,0,0,0.12)"
      },
      backgroundImage: {
        "luxe-gradient": "radial-gradient(circle at 12% 12%, rgba(215,193,154,.32), transparent 55%), radial-gradient(circle at 88% 0%, rgba(27,26,24,.13), transparent 44%)"
      }
    }
  },
  plugins: []
};

export default config;
