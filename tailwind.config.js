/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-teal": "#0d939f",
      },
      animation: {
        "slide-in-right": "slideInRight 0.3s ease-out",
      },
      keyframes: {
        slideInRight: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
