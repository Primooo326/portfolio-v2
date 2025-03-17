/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    './node_modules/flyonui/dist/js/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flyonui'),
    require('flyonui/plugin'),
    require('tailwindcss-motion')
  ],
  flyonui: {
    themes: [
      {
        mytheme: {
          "primary": "#151c25",
          "secondary": "#222831",
          "neutral": "#09101a",
          "base-100": "#02050a",
          "info": "#00a6ff",
          "success": "#55e6a5",
          "warning": "#ff8100",
          "error": "#ff093a",
          "base-content": "#fff",
          "secondary-content": "#55e6a5"

        },
      },
    ],
  },
}
