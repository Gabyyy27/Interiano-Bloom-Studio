import type { ReactNode } from "react";

import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import { logoutAction } from "@/app/admin/actions";

type AdminSection = "catalogo" | "categorias";

interface AdminShellProps {
  children: ReactNode;
  activeSection: AdminSection;
}

const navigationItems = [
  {
    label: "Catálogo",
    href: "/admin/catalogo",
    value: "catalogo",
    icon: <CollectionsOutlinedIcon />,
  },
  {
    label: "Categorías",
    href: "/admin/categorias",
    value: "categorias",
    icon: <CategoryOutlinedIcon />,
  },
] as const;

export default function AdminShell({
  children,
  activeSection,
}: AdminShellProps) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        backgroundColor: "background.default",
      }}
    >
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: "appBar",
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "rgba(255, 253, 248, 0.94)",
          backdropFilter: "blur(14px)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr) auto",
              lg: "minmax(0, 1fr) auto auto",
            },
            gridTemplateAreas: {
              xs: `
                "brand logout"
                "nav nav"
              `,
              lg: `"brand nav logout"`,
            },
            columnGap: {
              xs: 1.5,
              md: 2,
            },
            rowGap: 2,
            alignItems: {
              xs: "start",
              lg: "center",
            },
          }}
        >
          <Box
            sx={{
              gridArea: "brand",
              minWidth: 0,
              flexGrow: 1,
            }}
          >
            <Typography
              component="p"
              sx={{
                color: "primary.dark",
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.8rem",
                },
                fontWeight: 500,
                lineHeight: 1.1,
                overflowWrap: "anywhere",
              }}
            >
              Interiano{" "}
              <Box
                component="span"
                sx={{
                  color: "secondary.dark",
                  fontFamily: "var(--font-script), cursive",
                  fontSize: "0.74em",
                }}
              >
                Bloom Studio
              </Box>
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: {
                  xs: "0.82rem",
                  sm: "0.95rem",
                },
                lineHeight: 1.35,
              }}
            >
              Administración del catálogo
            </Typography>
          </Box>

          <Stack
            component="nav"
            aria-label="Navegación administrativa"
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              gridArea: "nav",
              width: {
                xs: "100%",
                lg: "auto",
              },
              flexWrap: "wrap",
              justifyContent: {
                xs: "center",
                lg: "flex-start",
              },
            }}
          >
            {navigationItems.map((item) => {
              const isActive = item.value === activeSection;

              return (
                <Button
                  key={item.value}
                  component="a"
                  href={item.href}
                  variant={isActive ? "contained" : "text"}
                  color="primary"
                  startIcon={item.icon}
                  aria-current={isActive ? "page" : undefined}
                  sx={{
                    flexGrow: {
                      xs: 1,
                      sm: 0,
                    },
                    transform: "none",

                    "&:hover": {
                      transform: "none",
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          <Box
            sx={{
              gridArea: "logout",
              display: "flex",
              flexShrink: 0,
              justifyContent: "flex-end",
            }}
          >
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                startIcon={<LogoutOutlinedIcon />}
                sx={{
                  width: "auto",
                  minWidth: 0,
                  minHeight: {
                    xs: 42,
                    sm: 44,
                  },
                  flexShrink: 0,
                  px: {
                    xs: 1.25,
                    sm: 2,
                    lg: 3,
                  },
                  fontSize: {
                    xs: "0.78rem",
                    sm: "0.875rem",
                    lg: "1rem",
                  },
                  whiteSpace: "nowrap",

                  "& .MuiButton-startIcon": {
                    mr: {
                      xs: 0.5,
                      sm: 1,
                    },

                    "& svg": {
                      fontSize: {
                        xs: 18,
                        sm: 20,
                      },
                    },
                  },
                }}
              >
                Cerrar sesión
              </Button>
            </form>
          </Box>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          py: {
            xs: 4,
            md: 6,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
