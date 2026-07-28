"use client";

import Image from "next/image";

import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  GlobalStyles,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { WHATSAPP_URL } from "@/lib/business";
import type { CatalogItem } from "@/types/catalog";

interface CatalogDialogProps {
  item: CatalogItem | null;
  open: boolean;
  onClose: () => void;
}

export default function CatalogDialog({
  item,
  open,
  onClose,
}: CatalogDialogProps) {
  if (!item) {
    return null;
  }

  const message = [
    "Hola Interiano Bloom Studio, deseo cotizar este arreglo.",
    "",
    `Arreglo: ${item.title}`,
    `Categoría: ${item.category}`,
  ].join("\n");

  const quoteHref = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;

return (
  <>
    {open && (
      <GlobalStyles
        styles={{
          ".floating-whatsapp-button": {
            display: "none !important",
          },
        }}
      />
    )}

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      aria-labelledby="catalog-dialog-title"
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(43, 33, 24, 0.58)",
          backdropFilter: "blur(4px)",
        },
      }}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "calc(100vw - 24px)",
              sm: "calc(100vw - 48px)",
              lg: 1120,
            },
            maxWidth: {
              xs: "calc(100vw - 24px)",
              sm: "calc(100vw - 48px)",
              lg: 1120,
            },
            maxHeight: {
              xs: "calc(100dvh - 24px)",
              sm: "calc(100dvh - 48px)",
            },
            m: {
              xs: 1.5,
              sm: 3,
            },
            overflow: "hidden",
            borderRadius: {
              xs: 3,
              sm: 4,
              md: 5,
            },
            backgroundColor: "background.default",
            boxShadow: "0 32px 90px rgba(43, 33, 24, 0.32)",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          position: "relative",
          p: 0,
          overflowX: "hidden",
          overflowY: "auto",
          backgroundColor: "background.default",
        }}
      >
        <IconButton
          type="button"
          aria-label="Cerrar detalles"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: {
              xs: 12,
              sm: 16,
              md: 18,
            },
            right: {
              xs: 12,
              sm: 16,
              md: 18,
            },
            zIndex: 4,
            width: {
              xs: 40,
              sm: 44,
            },
            height: {
              xs: 40,
              sm: 44,
            },
            color: "primary.dark",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "rgba(255, 253, 248, 0.94)",
            boxShadow: "0 8px 24px rgba(43, 33, 24, 0.12)",

            "&:hover": {
              backgroundColor: "background.paper",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "minmax(0, 1.08fr) minmax(0, 0.92fr)",
            },
            minWidth: 0,
            minHeight: {
              md: 620,
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              minWidth: 0,
              height: {
                xs: 220,
                sm: 350,
                md: "auto",
              },
              minHeight: {
                md: 620,
              },
              overflow: "hidden",
              backgroundColor: "primary.dark",
            }}
          >
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 599px) calc(100vw - 24px), (max-width: 899px) calc(100vw - 48px), 58vw"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            <Box
              aria-hidden="true"
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(145deg, rgba(216, 189, 139, 0.06), transparent 48%)",
                pointerEvents: "none",
              }}
            />
          </Box>

          <Stack
            spacing={4}
            sx={{
              minWidth: 0,
              minHeight: {
                md: 620,
              },
              justifyContent: "space-between",
              p: {
                xs: 2.5,
                sm: 4,
                md: 5,
              },
              pt: {
                xs: 3,
                sm: 4,
                md: 5,
              },
            }}
          >
            <Stack
              spacing={3}
              sx={{
                minWidth: 0,
              }}
            >
              <Stack
                spacing={1.25}
                sx={{
                  minWidth: 0,
                  pr: {
                    md: 6,
                  },
                }}
              >
                <Typography
                  component="p"
                  variant="body2"
                  sx={{
                    color: "secondary.dark",
                    fontSize: {
                      xs: "0.7rem",
                      sm: "0.78rem",
                    },
                    fontWeight: 700,
                    letterSpacing: {
                      xs: "0.18em",
                      sm: "0.28em",
                    },
                    textTransform: "uppercase",
                    overflowWrap: "break-word",
                  }}
                >
                  {item.category}
                </Typography>

                <Typography
                  id="catalog-dialog-title"
                  component="h2"
                  sx={{
                    minWidth: 0,
                    color: "text.primary",
                    fontFamily: "var(--font-display), Georgia, serif",
                    fontSize: {
                      xs: "2rem",
                      sm: "2.5rem",
                      md: "3rem",
                    },
                    fontWeight: 500,
                    lineHeight: 1.08,
                    overflowWrap: "break-word",
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: {
                      xs: "0.98rem",
                      md: "1.12rem",
                    },
                    lineHeight: 1.55,
                    overflowWrap: "break-word",
                  }}
                >
                  {item.subtitle}
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1rem",
                  },
                  lineHeight: 1.75,
                  overflowWrap: "break-word",
                }}
              >
                {item.description}
              </Typography>
            </Stack>

            <Button
              component="a"
              href={quoteHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<WhatsAppIcon />}
              sx={{
                width: {
                  xs: "100%",
                  sm: "fit-content",
                },
                minHeight: 54,
                mt: {
                  xs: 1,
                  md: 3,
                },
                px: 3,
                borderRadius: 999,
                color: "primary.contrastText",
                backgroundColor: "primary.main",
                boxShadow: "0 14px 30px rgba(73, 53, 36, 0.20)",
                transform: "none",

                "&:hover": {
                  backgroundColor: "primary.dark",
                  boxShadow: "0 18px 36px rgba(73, 53, 36, 0.26)",
                  transform: "none",
                },
              }}
            >
              Cotizar aquí
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  </>
  );
}