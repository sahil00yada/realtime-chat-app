import daisyui from "daisyui";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JSX/TSX files
    "./src/index.css" // Explicitly include your CSS file
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}