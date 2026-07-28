"use client";

import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";

import Brand from "@/components/common/Brand";

const navigationItems = [
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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <AppBar
  position="sticky"
  color="transparent"
  elevation={0}
  sx={{
    backgroundColor: "rgba(247, 241, 231, 0.94)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid",
    borderColor: "divider",
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
    <Toolbar
      disableGutters
      sx={{
        minHeight: {
          xs: 64,
          md: 76,
        },
      }}
    >
      <Brand compact />

      <Box sx={{ flexGrow: 1 }} />

      <Box
        component="nav"
        aria-label="Navegación principal"
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
          alignItems: "center",
          gap: 1,
        }}
      >
        {navigationItems.map((item) => (
          <Button
            key={item.href}
            component="a"
            href={item.href}
            color="inherit"
            sx={{
              color: "text.primary",
              fontWeight: 500,
              textTransform: "none",
              transform: "none",

              "&:hover": {
                color: "primary.main",
                backgroundColor: "rgba(184, 148, 95, 0.12)",
                transform: "none",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      <IconButton
        type="button"
        aria-label="Abrir menú de navegación"
        aria-controls="mobile-navigation"
        aria-expanded={isMenuOpen}
        onClick={openMenu}
        sx={{
          display: {
            xs: "inline-flex",
            md: "none",
          },
          ml: 1,
          color: "primary.main",
        }}
      >
        <MenuIcon />
      </IconButton>
    </Toolbar>
  </Container>
</AppBar>
      <Drawer
        id="mobile-navigation"
        anchor="right"
        open={isMenuOpen}
        onClose={closeMenu}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "background.default",
            },
          },
        }}
      >
        <Box
          component="nav"
          aria-label="Navegación móvil"
          sx={{
            width: {
              xs: 320,
              sm: 380,
            },
            maxWidth: "100vw",
            minHeight: "100%",
            p: {
              xs: 2.5,
              sm: 3,
            },
            backgroundColor: "background.default",
          }}
        >
          <Stack spacing={4}>
            <Box
              sx={{
                position: "relative",
                minHeight: 48,
                display: "flex",
                alignItems: "center",
                pr: 6,
              }}
            >
              <Box
                onClick={closeMenu}
                sx={{
                  minWidth: 0,
                  maxWidth: "100%",
                  cursor: "pointer",
                }}
              >
                <Brand compact />
              </Box>

              <IconButton
                type="button"
                aria-label="Cerrar menú de navegación"
                onClick={closeMenu}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 0,
                  width: 40,
                  height: 40,
                  color: "primary.main",
                  transform: "translateY(-50%)",

                  "&:hover": {
                    backgroundColor: "rgba(184, 148, 95, 0.14)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Stack spacing={1.25}>
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  component="a"
                  href={item.href}
                  variant="text"
                  color="primary"
                  onClick={closeMenu}
                  sx={{
                    minHeight: 48,
                    justifyContent: "flex-start",
                    px: 2.5,
                    borderRadius: 999,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    transform: "none",

                    "&:hover": {
                      backgroundColor: "rgba(184, 148, 95, 0.12)",
                      transform: "translateX(3px)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}