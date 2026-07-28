import { Box, Stack, Typography } from "@mui/material";

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
    <Stack
      direction="row"
      aria-hidden="true"
      sx={{
        flexShrink: 0,
        alignItems: "center",
        gap: {
          xs: 4,
          sm: 6,
          md: 8,
        },
        pr: {
          xs: 4,
          sm: 6,
          md: 8,
        },
      }}
    >
      {tickerItems.map((item) => (
        <Stack
          key={item}
          direction="row"
          sx={{
            flexShrink: 0,
            alignItems: "center",
            gap: {
              xs: 4,
              sm: 6,
              md: 8,
            },
          }}
        >
          <Typography
            component="span"
            sx={{
              color: "rgba(255, 255, 255, 0.82)",
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: {
                xs: "1rem",
                md: "1.15rem",
              },
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </Typography>

          <Box
            component="span"
            aria-hidden="true"
            sx={{
              color: "#D8B77C",
              fontSize: {
                xs: "1rem",
                md: "1.2rem",
              },
              lineHeight: 1,
            }}
          >
            ✦
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}

export default function ServicesTicker() {
  return (
    <Box
      aria-label="Servicios de Interiano Bloom Studio"
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: "primary.dark",
        borderTop: "1px solid rgba(216, 183, 124, 0.12)",
        borderBottom: "1px solid rgba(216, 183, 124, 0.12)",

        "@keyframes servicesTicker": {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(-50%)",
          },
        },

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
          animation: "servicesTicker 28s linear infinite",
          willChange: "transform",

          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
            transform: "translateX(0)",
          },
        }}
      >
        <TickerGroup />
        <TickerGroup />
      </Box>
    </Box>
  );
}