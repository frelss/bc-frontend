/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBackgroundColor: "#0D1117",
        columnBackgroundColor: "#161C22",
      },
      boxShadow: {
        custom: "0 0 0 1px #e8ecee, 0 5px 20px 0 rgba(21, 7, 38, 0.08)",
      },
      screens: {
        lg: "1024px",
      },
    },
  },
  plugins: [],
};
