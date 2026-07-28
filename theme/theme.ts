import { createTheme } from "@mui/material/styles";

import { breakpoints } from "./breakpoints";
import { palette } from "./palette";
import { typography } from "./typography";

export const theme = createTheme({
  palette,
  typography,
  breakpoints,

  shape: {
    borderRadius: 12,
  },

  spacing: 8,

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          minHeight: 48,
          paddingInline: 24,
          borderRadius: 999,
          fontSize: "1rem",

          transition:
            "background-color .2s ease, border-color .2s ease, transform .2s ease",

          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
      },
    },
  },
});