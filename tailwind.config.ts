import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        page: "var(--color-bg)",
        line: "var(--color-border)",
        brand: "var(--color-brand)",
        "brand-soft": "var(--color-brand-soft)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        box: "12px",
      },
      minHeight: {
        btn: "56px",
      },
      fontSize: {
        body: ["17px", { lineHeight: "1.55" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
      },
    },
  },
  plugins: [],
};

export default config;
