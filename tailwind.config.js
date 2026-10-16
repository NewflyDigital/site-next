/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "#fd0c1c",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        industrial: "var(--industrial)",
        steel: "var(--steel)",
        "surface-contrast": "var(--surface-contrast)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
      },
      fontFamily: {
        sans: ["Hind", "sans-serif"],
        display: ['"Archivo Black"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
        body: ["Roboto", "sans-serif"],
      },
      zIndex: {
        9999: "9999",
      },
    },
  },
  plugins: [],
};
