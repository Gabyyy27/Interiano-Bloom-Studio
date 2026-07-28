"use client";

import Image from "next/image";

import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
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

  const quoteHref =
    `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      aria-labelledby="catalog-dialog-title"
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(18, 16, 14, 0.78)",
          backdropFilter: "blur(6px)",
        },
      }}
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            m: {
              xs: 1.5,
              sm: 3,
            },
            maxHeight: {
              xs: "calc(100% - 24px)",
              sm: "calc(100% - 48px)",
            },
            overflow: "hidden",
            borderRadius: {
              xs: 3,
              md: 4,
            },
            backgroundColor: "#FBF7F0",
            boxShadow: "0 32px 90px rgba(0, 0, 0, 0.32)",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.08fr) minmax(360px, 0.92fr)",
            },
            minHeight: {
              md: 620,
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              minHeight: {
                xs: 330,
                sm: 480,
                md: "100%",
              },
              aspectRatio: {
                xs: "4 / 3",
                md: "auto",
              },
              backgroundColor: "#171310",
            }}
          >
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 899px) 100vw, 58vw"
              style={{
                objectFit: "cover",
              }}
            />
          </Box>

          <Stack
            spacing={4}
            sx={{
              position: "relative",
              minHeight: {
                md: 620,
              },
              justifyContent: "space-between",
              p: {
                xs: 3,
                sm: 4,
                md: 5,
              },
            }}
          >
            <IconButton
              type="button"
              aria-label="Cerrar detalles"
              onClick={onClose}
              sx={{
                position: "absolute",
                top: {
                  xs: 16,
                  md: 18,
                },
                right: {
                  xs: 16,
                  md: 18,
                },
                zIndex: 1,
                width: 44,
                height: 44,
                border: "1px solid",
                borderColor: "rgba(125, 79, 80, 0.18)",
                backgroundColor: "rgba(251, 247, 240, 0.90)",

                "&:hover": {
                  backgroundColor: "background.paper",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Stack spacing={3}>
              <Stack
                spacing={1.5}
                sx={{
                  pr: 6,
                }}
              >
                <Typography
                  component="p"
                  variant="body2"
                  sx={{
                    color: "secondary.dark",
                    fontWeight: 700,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.category}
                </Typography>

                <Typography
                  id="catalog-dialog-title"
                  component="h2"
                  sx={{
                    color: "#201A17",
                    fontFamily:
                      "var(--font-display), Georgia, serif",
                    fontSize: {
                      xs: "2.1rem",
                      sm: "2.6rem",
                      md: "3rem",
                    },
                    fontWeight: 500,
                    lineHeight: 1.05,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: {
                      xs: "1rem",
                      md: "1.12rem",
                    },
                    lineHeight: 1.6,
                  }}
                >
                  {item.subtitle}
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.75,
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
                px: 3,
                color: "primary.contrastText",
backgroundColor: "primary.main",
boxShadow: "0 14px 30px rgba(73, 53, 36, 0.20)",

"&:hover": {
  backgroundColor: "primary.dark",
  boxShadow: "0 18px 36px rgba(73, 53, 36, 0.26)",
  transform: "none",
},
              }}
            >
              Cotizar este
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}