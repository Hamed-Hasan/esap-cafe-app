/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Coffee theme colors
        primary: {
          DEFAULT: "#6B4423",
          dark: "#8B6F47",
        },
        secondary: {
          DEFAULT: "#2C5F2D",
          dark: "#45A049",
        },
        accent: {
          DEFAULT: "#E74C3C",
          dark: "#FF6B6B",
        },
        bg: {
          light: "#F5F5DC",
          dark: "#1A1A1A",
          card: {
            light: "#FFFFFF",
            dark: "#2A2A2A",
          },
        },
        text: {
          primary: {
            DEFAULT: "#1A1A1A",
            dark: "#FFFFFF",
          },
          secondary: {
            DEFAULT: "#8B6F47",
            dark: "#B8956A",
          },
          muted: {
            DEFAULT: "#989898",
            dark: "#6B6B6B",
          },
        },
        border: {
          light: "#E0E0E0",
          dark: "#3A3A3A",
        },
      },
      fontFamily: {
        regular: ["System"],
        medium: ["System"],
        semibold: ["System"],
        bold: ["System"],
      },
    },
  },
  plugins: [],
};

