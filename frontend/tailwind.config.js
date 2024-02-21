/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				background: "#F1EDF1",
				primary: { 100: "#4F2D7F", 200: "#3C265A" },
			},
			fontFamily: {
				sans: ["Poppins", "sans-serif"],
				roboto: ["Roboto", "sans-serif"],
			},
			gridTemplateColumns: {
				search: "repeat(2, minmax(0, 1fr))",
			},
			screens: {
				search: "1200px",
			},
		},
	},
	plugins: [],
};
