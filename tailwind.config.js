module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#161029",
        primary: "#007BFF",
        secondary: "#FF8C00",
        text: {
          primary: "#E2E8F0",
          secondary: "#94A3B8",
        },
        profit: "#50C878",
        loss: "#DC143C",
        chart: {
          line: "#87CEEB",
          gain: "#32CD32",
          loss: "#FF6347",
        },
        highlight: "#FFD700",
        button: {
          primary: "#008080",
          secondary: "#FF8C00",
        },
        hover: "#EE82EE",
      },
      boxShadow: {
        glow: "0 0 10px rgba(0, 123, 255, 0.5)",
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
