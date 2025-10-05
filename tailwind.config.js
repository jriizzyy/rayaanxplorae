/** @type {import('tailwindcss').Config} */
    export default {
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: "#0066CC", // Primary Blue
              dark: "#0052A3",
              light: "#3385D6",
            },
            secondary: {
              DEFAULT: "#00BFA6", // Aqua
              dark: "#009682",
              light: "#33CCBA",
            },
            neutral: {
              dark: "#1A1A1A", // Charcoal
              medium: "#666666",
              light: "#E6E6E6",
              white: "#FFFFFF",
            },
            state: {
              success: "#28A745",
              warning: "#FFB300",
              error: "#E53935",
            },
          },
        },
      },
      plugins: [],
    };
