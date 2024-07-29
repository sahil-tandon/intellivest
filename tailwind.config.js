module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#120c24",
        primary: "#6366F1",
        secondary: "#F59E0B",
        text: {
          primary: "#E2E8F0",
          secondary: "#94A3B8",
        },
        profit: "#34D399",
        loss: "#F87171",
        card: "#1E1639",
        border: "#2D3748",
      },
      boxShadow: {
        glow: "0 0 10px rgba(99, 102, 241, 0.5)",
      },
      backdropFilter: {
        none: "none",
        blur: "blur(20px)",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["hover", "focus"],
      backdropFilter: ["hover", "focus"],
    },
  },
  plugins: [],
};
