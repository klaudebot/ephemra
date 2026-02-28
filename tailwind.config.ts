import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: "#0095f6",
        "accent-hover": "#1aa1f7",
        "accent-dark": "#0074cc",
        danger: "#ed4956",
        success: "#00c853",
        warning: "#ffab00",
        bg: {
          primary: "#000000",
          secondary: "#121212",
          tertiary: "#1a1a1a",
          elevated: "#262626",
        },
        border: {
          primary: "#262626",
          secondary: "#363636",
          hover: "#484848",
        },
        text: {
          primary: "#f5f5f5",
          secondary: "#a8a8a8",
          tertiary: "#737373",
          link: "#e0f1ff",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
