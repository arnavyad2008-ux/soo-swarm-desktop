import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        swarm: {
          dark: "#0b0f19",
          card: "#111827",
          border: "#1f2937",
          accent: "#38bdf8",
          secondary: "#818cf8",
          success: "#34d399",
          warning: "#fbbf24",
        },
      },
    },
  },
  plugins: [],
};
export default config;
