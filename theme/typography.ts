export const typography = {
  fontFamily: "var(--font-geist-sans), Arial, sans-serif",

  h1: {
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: 1.15,

    "@media (min-width:600px)": {
      fontSize: "3rem",
    },

    "@media (min-width:900px)": {
      fontSize: "3.5rem",
    },
  },

  h2: {
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.2,

    "@media (min-width:600px)": {
      fontSize: "2.35rem",
    },

    "@media (min-width:900px)": {
      fontSize: "2.75rem",
    },
  },

  h3: {
    fontSize: "1.75rem",
    fontWeight: 600,
    lineHeight: 1.3,

    "@media (min-width:900px)": {
      fontSize: "2rem",
    },
  },

  h4: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.4,

    "@media (min-width:900px)": {
      fontSize: "1.75rem",
    },
  },

  h5: {
    fontSize: "1.35rem",
    fontWeight: 600,
    lineHeight: 1.4,

    "@media (min-width:900px)": {
      fontSize: "1.5rem",
    },
  },

  h6: {
    fontSize: "1.15rem",
    fontWeight: 600,
    lineHeight: 1.5,

    "@media (min-width:900px)": {
      fontSize: "1.25rem",
    },
  },

  body1: {
    fontSize: "1rem",
    lineHeight: 1.8,
  },

  body2: {
    fontSize: "0.95rem",
    lineHeight: 1.7,
  },

  button: {
    textTransform: "none" as const,
    fontWeight: 600,
  },
};