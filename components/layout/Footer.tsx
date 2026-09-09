import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelephoneIcon from "@mui/icons-material/Phone";
import { WHATSAPP_URL } from "@/lib/business";
import Brand from "@/components/common/Brand";

import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

const navigationItems = [
  {
    label: "Inicio",
    href: "#inicio",
  },
   {
    label: "Catálogo",
    href: "#catalogo",
  },
  {
    label: "Servicios",
    href: "#servicios",
  },
  {
    label: "Contacto",
    href: "#contacto",
  },
] as const;

const socialItems = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/interiano_bloom_studio/",
    icon: <InstagramIcon />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61574277849076",
    icon: <FacebookIcon />,
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    icon: <WhatsAppIcon />,
  },
  {
    label: "+504 3321-9649",
    href: "tel:+50433219649",
    icon: <TelephoneIcon />,
    newTab: false,
  },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.dark",
        color: "common.white",
      }}
    >
        <Container
    maxWidth={false}
    disableGutters
    sx={{
      px: {
        xs: 2,
        sm: 3,
        md: 4,
        lg: 6,
      },
    }}
  >
        <Stack
          spacing={5}
          sx={{
            py: {
              xs: 6,
              md: 8,
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(0, 1.4fr) repeat(2, minmax(160px, 0.5fr))",
              },
              gap: {
                xs: 5,
                md: 8,
              },
            }}
          >
            <Stack
              spacing={2}
              sx={{
                maxWidth: 440,
              }}
            >
              <Brand inverse />

              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.68)",
                  lineHeight: 1.7,
                }}
              >
                Detalles únicos para momentos que merecen recordarse.
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <Typography
                component="h2"
                sx={{
                  color: "#D8B77C",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Navegación
              </Typography>

              <Stack
  component="nav"
  aria-label="Navegación del pie de página"
  spacing={1.75}
>
  {navigationItems.map((item) => (
    <Box
      key={item.href}
      component="a"
      href={item.href}
      sx={{
        width: "fit-content",
        color: "rgba(255, 255, 255, 0.76)",
        textDecoration: "none",
        transition:
          "color 180ms ease, transform 180ms ease",

        "&:hover": {
          color: "common.white",
          transform: "translateX(3px)",
        },
      }}
    >
      {item.label}
    </Box>
  ))}
</Stack>
            </Stack>

            <Stack spacing={2}>
              <Typography
                component="h2"
                sx={{
                  color: "#D8B77C",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Contacto y redes
              </Typography>

              <Stack spacing={1.75}>
                {socialItems.map((item) => (
                  <Box
                    key={item.label}
                    component="a"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${item.label}`}
                    sx={{
                      width: "fit-content",
                      color: "rgba(255, 255, 255, 0.76)",
                      textDecoration: "none",
                      transition:
                        "color 180ms ease, transform 180ms ease",

                      "&:hover": {
                        color: "common.white",
                        transform: "translateX(3px)",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{
                        alignItems: "center",

                        "& svg": {
                          color: "#D8B77C",
                          fontSize: 21,
                        },
                      }}
                    >
                      {item.icon}

                      <Box component="span">{item.label}</Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>

          <Divider
            sx={{
              borderColor: "rgba(255, 255, 255, 0.12)",
            }}
          />

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
            sx={{
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.56)",
              }}
            >
              © {currentYear} Interiano Bloom Studio. Todos los derechos
              reservados.
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.56)",
              }}
            >
              San Pedro Sula, Honduras
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}