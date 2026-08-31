"use client";

import Image from "next/image";

import EastRoundedIcon from "@mui/icons-material/EastRounded";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import type { CatalogItem } from "@/types/catalog";

interface CatalogCardProps {
  item: CatalogItem;
  onOpen: (item: CatalogItem) => void;
}

export default function CatalogCard({
  item,
  onOpen,
}: CatalogCardProps) {
  const primaryImage = item.images[0];

  if (!primaryImage) {
    return null;
  }

  return (
    <Paper
      component="article"
      elevation={0}
      sx={{
        position: "relative",
        minWidth: 0,

        minHeight: {
          xs: 285,
          sm: 390,
          md: 470,
          lg: 520,
        },

        overflow: "hidden",

        borderRadius: {
          xs: 3,
          sm: 4,
          md: 5,
        },

        backgroundColor: "primary.dark",

        boxShadow: {
          xs: "0 10px 26px rgba(43, 33, 24, 0.10)",
          md: "0 18px 44px rgba(43, 33, 24, 0.12)",
        },

        transition:
          "transform 220ms ease, box-shadow 220ms ease",

        "@media (hover: hover) and (pointer: fine)": {
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow:
              "0 28px 64px rgba(43, 33, 24, 0.18)",
          },

          "&:hover .catalog-card-image": {
            transform: "scale(1.035)",
          },
        },
      }}
    >
      <Box
        component="button"
        type="button"
        aria-label={`Ver detalle de ${item.title}`}
        onClick={() => onOpen(item)}
        sx={{
          position: "relative",
          minHeight: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          p: 0,
          overflow: "hidden",
          border: 0,
          cursor: "pointer",
          color: "common.white",
          backgroundColor: "transparent",
          textAlign: "left",

          "&:focus-visible": {
            outline:
              "3px solid rgba(216, 189, 139, 0.92)",
            outlineOffset: -6,
          },
        }}
      >
        <Image
          className="catalog-card-image"
          src={primaryImage.imageUrl}
          alt={item.title}
          fill
          sizes="
            (max-width: 599px) calc((100vw - 44px) / 2),
            (max-width: 899px) calc((100vw - 64px) / 2),
            (max-width: 1199px) calc((100vw - 88px) / 2),
            31vw
          "
          style={{
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 360ms ease",
          }}
        />

        <Box
          component="span"
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,

            background: `
              linear-gradient(
                180deg,
                rgba(43, 33, 24, 0.01) 0%,
                rgba(43, 33, 24, 0.10) 40%,
                rgba(43, 33, 24, 0.86) 100%
              )
            `,
          }}
        />

        <Box
          component="span"
          sx={{
            position: "relative",
            zIndex: 1,
            display: "block",
            width: "100%",

            p: {
              xs: 1.35,
              sm: 2.25,
              md: 3,
              lg: 3.5,
            },
          }}
        >
          <Typography
            component="span"
            sx={{
              display: "block",

              mb: {
                xs: 0.55,
                sm: 0.8,
              },

              color: "common.white",

              fontSize: {
                xs: "0.52rem",
                sm: "0.65rem",
                md: "0.72rem",
              },

              fontWeight: 800,

              letterSpacing: {
                xs: "0.11em",
                sm: "0.16em",
                md: "0.18em",
              },

              lineHeight: 1.25,
              textTransform: "uppercase",
              overflowWrap: "anywhere",
            }}
          >
            {item.categoryName}
          </Typography>

          <Typography
            component="span"
            sx={{
              display: "block",
              width: "100%",
              maxWidth: 360,

              color: "common.white",

              fontFamily:
                "var(--font-display), Georgia, serif",

              fontSize: {
                xs: "1.22rem",
                sm: "1.75rem",
                md: "2.15rem",
                lg: "2.45rem",
              },

              fontWeight: 500,

              lineHeight: {
                xs: 1,
                sm: 1.02,
              },

              textWrap: "balance",
              overflowWrap: "anywhere",
            }}
          >
            {item.title}
          </Typography>

          <Box
            component="span"
            sx={{
              mt: {
                xs: 1.15,
                sm: 1.75,
                md: 2.25,
              },

              display: "inline-flex",
              alignItems: "center",

              gap: {
                xs: 0.45,
                sm: 0.8,
              },

              color: "secondary.light",

              fontSize: {
                xs: "0.55rem",
                sm: "0.68rem",
                md: "0.78rem",
              },

              fontWeight: 800,

              letterSpacing: {
                xs: "0.08em",
                sm: "0.13em",
                md: "0.16em",
              },

              lineHeight: 1,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Ver más

            <EastRoundedIcon
              aria-hidden="true"
              sx={{
                fontSize: {
                  xs: 14,
                  sm: 17,
                  md: 19,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}