import Image from "next/image";

import EastRoundedIcon from "@mui/icons-material/EastRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Button, Stack, Typography } from "@mui/material";

import SectionContainer from "@/components/common/SectionContainer";
import { WHATSAPP_URL } from "@/lib/business";

export default function HeroSection() {
  return (
    <Box
      id="inicio"
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #FBF7F0 0%, #F7F1E7 52%, #FBF8F3 100%)",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(circle at 14% 18%, rgba(212, 183, 124, 0.14), transparent 24%),
            radial-gradient(circle at 88% 22%, rgba(184, 148, 95, 0.10), transparent 24%),
            radial-gradient(circle at 72% 78%, rgba(107, 81, 56, 0.08), transparent 22%)
          `,
        }}
      />

      <SectionContainer maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 0.88fr) minmax(420px, 1.12fr)",
            },
            gap: {
              xs: 6,
              md: 7,
              lg: 6,
            },
            alignItems: "center",
          }}
        >
          <Stack
            spacing={4}
            sx={{
              position: "relative",
              zIndex: 1,
              maxWidth: {
                xs: "100%",
                lg: 680,
              },
            }}
          >
            <Typography
              component="p"
              variant="body2"
              sx={{
                color: "secondary.dark",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              Hecho a mano con amor
            </Typography>

            <Typography
              component="h1"
              sx={{
                color: "#1F1915",
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: {
                  xs: "3.15rem",
                  sm: "4rem",
                  md: "5rem",
                  lg: "5.5rem",
                },
                fontWeight: 500,
                lineHeight: {
                  xs: 1.02,
                  md: 0.98,
                },
                letterSpacing: "-0.035em",
              }}
            >
              <Box component="span" sx={{ display: "block" }}>
                Detalles que
              </Box>

              <Box
                component="span"
                sx={{
                  display: "block",
                  mt: {
                    xs: 0.5,
                    md: 1,
                  },
                  fontFamily: "var(--font-script), cursive",
                  fontSize: {
                    xs: "0.8em",
                    md: "0.72em",
                  },
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: 0,
                  background:
                    "linear-gradient(135deg, #E3C992 0%, #B8945F 45%, #8C673A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                enamoran
              </Box>

              <Box
                component="span"
                sx={{
                  display: "block",
                  mt: {
                    xs: 1,
                    md: 1.5,
                  },
                }}
              >
                a primera vista.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 680,
                color: "text.secondary",
                fontSize: {
                  xs: "1.04rem",
                  sm: "1.16rem",
                  md: "1.24rem",
                },
                lineHeight: 1.7,
              }}
            >
              Cajas de rosas, desayunos sorpresa, rosas eternas, regalos
              personalizados y más. Cada arreglo es único, diseñado a mano y
              pensado para hacer sonreír a quien más quieres.
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <Button
                component="a"
                href="#catalogo"
                variant="contained"
                endIcon={<EastRoundedIcon />}
                sx={{
                  minHeight: 54,
                  px: 3.25,
                  borderRadius: 999,
                  color: "primary.contrastText",
                  backgroundColor: "primary.main",
                  boxShadow: "0 14px 30px rgba(73, 53, 36, 0.18)",
                  textTransform: "none",
                  fontWeight: 700,

                  "&:hover": {
                    backgroundColor: "primary.dark",
                    boxShadow: "0 18px 36px rgba(73, 53, 36, 0.24)",
                  },
                }}
              >
                Ver catálogo
              </Button>

              <Button
                component="a"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                sx={{
                  minHeight: 54,
                  px: 3.25,
                  borderRadius: 999,
                  borderColor: "rgba(184, 148, 95, 0.34)",
                  color: "primary.dark",
                  backgroundColor: "rgba(255, 253, 248, 0.55)",
                  textTransform: "none",
                  fontWeight: 600,

                  "&:hover": {
                    borderColor: "secondary.main",
                    backgroundColor: "rgba(184, 148, 95, 0.10)",
                  },
                }}
              >
                Escríbenos
              </Button>
                        </Stack>
          </Stack>

          <Box
            sx={{
              position: "relative",
              display: {
                xs: "none",
                lg: "block",
              },
              minHeight: {
                lg: 680,
                xl: 760,
              },
              overflow: "hidden",
              borderRadius: {
                lg: "48px",
                xl: "64px",
              },
              backgroundColor: "secondary.light",
              boxShadow: "0 30px 80px rgba(73, 53, 36, 0.14)",
            }}
          >
            <Image
              src="/images/hero-flowers.webp"
              alt="Arreglo floral de Interiano Bloom Studio"
              fill
              preload
              sizes="(max-width: 1199px) 100vw, 52vw"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                zIndex: 1,
              }}
            />

            <Box
              aria-hidden="true"
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                pointerEvents: "none",
                background:
                  "linear-gradient(145deg, rgba(216, 189, 139, 0.08), transparent 45%)",
              }}
            />
          </Box>
        </Box>
      </SectionContainer>
    </Box>
  );
}