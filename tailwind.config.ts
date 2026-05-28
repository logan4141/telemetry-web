import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 500: "#f97316", 600: "#ea580c" },
      },
    },
  },
  plugins: [],
};
export default config;
