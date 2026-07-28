import {
  Box,
  GlobalStyles,
  Typography,
} from "@mui/material";

const tickerItems = [
  "Globos",
  "Bouquets",
  "Detalles a Medida",
  "Cajas de Rosas",
  "Desayunos Sorpresa",
  "Rosas Eternas",
] as const;

function TickerGroup() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        display: "flex",
        flexShrink: 0,
        alignItems: "center",
      }}
    >
      {tickerItems.map((item) => (
        <Box
          key={item}
          sx={{
            display: "flex",
            flexShrink: 0,
            alignItems: "center",
            gap: {
              xs: 2.5,
              sm: 3.5,
              md: 4,
            },
            mr: {
              xs: 4,
              sm: 6,
              md: 8,
            },
          }}
        >
          <Typography
            component="span"
            sx={{
              color: "rgba(255, 253, 248, 0.86)",
              fontFamily:
                "var(--font-display), Georgia, serif",
              fontSize: {
                xs: "0.98rem",
                sm: "1.05rem",
                md: "1.15rem",
              },
              fontWeight: 500,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </Typography>

          <Box
            component="span"
            sx={{
              color: "secondary.main",
              fontSize: {
                xs: "0.9rem",
                md: "1.1rem",
              },
              lineHeight: 1,
            }}
          >
            ✦
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default function ServicesTicker() {
  return (
    <>
      <GlobalStyles
        styles={{
          "@keyframes servicesTickerMovement": {
            "0%": {
              transform: "translate3d(0, 0, 0)",
            },
            "100%": {
              transform: "translate3d(-50%, 0, 0)",
            },
          },
        }}
      />

      <Box
        aria-label="Servicios de Interiano Bloom Studio"
        sx={{
          width: "100%",
          overflow: "hidden",
          backgroundColor: "primary.dark",
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "rgba(216, 183, 124, 0.16)",

          "&:hover .services-ticker-track": {
            animationPlayState: "paused",
          },
        }}
      >
        <Box
          className="services-ticker-track"
          sx={{
            display: "flex",
            width: "max-content",
            py: {
              xs: 2.25,
              md: 2.75,
            },
            animationName: "servicesTickerMovement",
            animationDuration: {
              xs: "18s",
              sm: "23s",
              md: "30s",
            },
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            willChange: "transform",
          }}
        >
          <TickerGroup />
          <TickerGroup />
        </Box>
      </Box>
    </>
  );
}