module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: ['retro', 'synthwave'],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    darkTheme: "synthwave",
  },
}
