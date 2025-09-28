import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        5: "5px",
      },
      width: {
        "32rem": "32rem",
      },
    },
  },
  plugins: [require("daisyui")],
};


