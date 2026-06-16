import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f6f7fb",
        "bg-alt": "#ffffff",
        ink: "#0f1f3a",
        "ink-2": "#1a2a4a",
        muted: "#5b6b87",
        "muted-2": "#8390a8",
        line: "#e6e9f1",
        "line-2": "#d8dde8",
        primary: { DEFAULT: "#1a3a5c", 2: "#244a73" },
        accent: { DEFAULT: "#ff6b3d", 2: "#ff8c66", soft: "#fff1ec" },
        x: "#1a3a5c",
        y: "#6b46c1",
        calc: "#ff6b3d",
        vga: "#14b8a6",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(15,31,58,.05)",
        md: "0 4px 12px rgba(15,31,58,.06), 0 2px 4px rgba(15,31,58,.04)",
        lg: "0 16px 40px rgba(15,31,58,.10), 0 4px 10px rgba(15,31,58,.05)",
      },
      borderRadius: { sm: "8px", DEFAULT: "14px", lg: "22px" },
    },
  },
  plugins: [],
};
export default config;
