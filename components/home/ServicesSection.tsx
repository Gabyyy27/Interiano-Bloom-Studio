import type { ReactNode } from "react";

import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import BreakfastDiningOutlinedIcon from "@mui/icons-material/BreakfastDiningOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import { Box, Stack, Typography } from "@mui/material";

import SectionContainer from "@/components/common/SectionContainer";

interface Service {
  title: string;
  description: string;
  icon: ReactNode;
  featured?: boolean;
}

const services: Service[] = [
  {
    title: "Cajas de Rosas",
    description:
      "Rosas de satín en cajas premium con chocolates.",
    icon: <LocalFloristOutlinedIcon />,
  },
  {
    title: "Desayunos Sorpresa",
    description:
      "Pancakes, jugo, café y rosas para comenzar un día especial.",
    icon: <BreakfastDiningOutlinedIcon />,
    featured: true,
  },
  {
    title: "Rosas Eternas",
    description:
      "Diseños especiales que conservan su belleza por mucho más tiempo.",
    icon: <DiamondOutlinedIcon />,
  },
  {
    title: "Globos & Bouquets",
    description:
      "Detalles para cumpleaños, aniversarios y celebraciones.",
    icon: <CelebrationOutlinedIcon />,
  },
  {
    title: "Diseños a Medida",
    description:
      "Cuéntanos tu idea y crearemos un detalle pensado especialmente para ti.",
    icon: <AutoAwesomeOutlinedIcon />,
  },
];

export default function ServicesSection() {
  return (
    <Box
      sx={{
        backgroundColor: "#FBF7F0",
      }}
    >
      <SectionContainer id="servicios">
        <Stack spacing={{ xs: 5, md: 7 }}>
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              component="p"
              variant="body2"
              sx={{
                color: "secondary.dark",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              Servicios
            </Typography>

            <Typography
              component="h2"
              sx={{
                color: "#201A17",
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: {
                  xs: "2.7rem",
                  sm: "3.5rem",
                  md: "4rem",
                },
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
              }}
            >
              Todo lo que creamos para ti
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            {services.map((service) => (
              <Box
                key={service.title}
                component="article"
                sx={{
                  minHeight: {
                    xs: 250,
                    md: 260,
                  },
                  p: {
                    xs: 3.5,
                    sm: 4,
                    md: 5,
                  },
                  border: "1px solid",
                  borderColor: service.featured
                    ? "rgba(176, 122, 53, 0.28)"
                    : "rgba(125, 79, 80, 0.16)",
                  borderRadius: {
                    xs: 4,
                    md: 5,
                  },
                  background: service.featured
                    ? `
                      radial-gradient(
                        circle at 88% 8%,
                        rgba(212, 163, 115, 0.18),
                        transparent 38%
                      ),
                      rgba(255, 255, 255, 0.42)
                    `
                    : "rgba(255, 255, 255, 0.22)",
                  boxShadow: service.featured
                    ? "0 24px 50px rgba(43, 43, 43, 0.10)"
                    : "none",
                  transition:
                    "transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease",

                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "rgba(176, 122, 53, 0.38)",
                    boxShadow:
                      "0 20px 44px rgba(43, 43, 43, 0.08)",
                  },

                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "none",

                    "&:hover": {
                      transform: "none",
                    },
                  },
                }}
              >
                <Stack
                  spacing={4}
                  sx={{
                    height: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 62,
                      height: 62,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 2.5,
                      color: "common.white",
                      background:
                        "linear-gradient(145deg, #E4C58A 0%, #A97532 100%)",
                      boxShadow:
                        "0 14px 28px rgba(176, 122, 53, 0.20)",

                      "& svg": {
                        fontSize: 29,
                      },
                    }}
                  >
                    {service.icon}
                  </Box>

                  <Stack spacing={1.25}>
                    <Typography
                      component="h3"
                      sx={{
                        color: "#201A17",
                        fontFamily:
                          "var(--font-display), Georgia, serif",
                        fontSize: {
                          xs: "1.75rem",
                          md: "1.9rem",
                        },
                        fontWeight: 500,
                        lineHeight: 1.15,
                      }}
                    >
                      {service.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: {
                          xs: "0.98rem",
                          md: "1.05rem",
                        },
                        lineHeight: 1.65,
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Box>
        </Stack>
      </SectionContainer>
    </Box>
  );
}
