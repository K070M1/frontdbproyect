// tailwind.config.js
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};