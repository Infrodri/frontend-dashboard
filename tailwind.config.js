/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Para archivos en `app`
    "./pages/**/*.{js,ts,jsx,tsx}", // Para archivos en `pages`
    "./components/**/*.{js,ts,jsx,tsx}", // Para archivos en `components`
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};