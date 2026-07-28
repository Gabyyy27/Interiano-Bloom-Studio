import Image from "next/image";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import type { CatalogItem } from "@/types/catalog";

interface CatalogCardProps {
  item: CatalogItem;
  onViewDetails: () => void;
}

export default function CatalogCard({
  item,
  onViewDetails,
}: CatalogCardProps) {
  return (
    <Box
      component="article"
      sx={{
        position: "relative",
        aspectRatio: {
          xs: "4 / 5",
          sm: "3 / 4",
        },
        overflow: "hidden",
        borderRadius: {
          xs: 4,
          md: 5,
        },
        backgroundColor: "primary.dark",
        boxShadow: "0 16px 38px rgba(43, 43, 43, 0.10)",

        "& img": {
          transition: "transform 450ms ease",
        },

        "&:hover img": {
          transform: "scale(1.045)",
        },

        "@media (prefers-reduced-motion: reduce)": {
          "& img": {
            transition: "none",
          },

          "&:hover img": {
            transform: "none",
          },
        },
      }}
    >
      <Image
        src={item.imageSrc}
        alt={item.imageAlt}
        fill
        sizes="(max-width: 599px) 100vw, (max-width: 1199px) 50vw, 33vw"
        style={{
          objectFit: "cover",
        }}
      />

      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(10, 8, 7, 0.94) 0%, rgba(10, 8, 7, 0.30) 42%, transparent 70%)",
        }}
      />

      <Stack
        spacing={1}
        sx={{
          position: "absolute",
          inset: 0,
          justifyContent: "flex-end",
          p: {
            xs: 3,
            md: 3.5,
          },
        }}
      >
        <Typography
          component="h3"
          sx={{
            color: "common.white",
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: {
              xs: "1.65rem",
              md: "1.85rem",
            },
            fontWeight: 500,
            lineHeight: 1.15,
          }}
        >
          {item.title}
        </Typography>

        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.82)",
            lineHeight: 1.5,
          }}
        >
          {item.subtitle}
        </Typography>

        <Button
          type="button"
          variant="text"
          endIcon={<ArrowForwardIcon />}
          aria-haspopup="dialog"
          aria-label={`Ver detalles de ${item.title}`}
          onClick={onViewDetails}
          sx={{
            width: "fit-content",
            minHeight: "auto",
            mt: 1,
            p: 0,
            borderRadius: 0,
            color: "#E4C58A",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            transform: "none",

            "&:hover": {
              backgroundColor: "transparent",
              transform: "translateX(4px)",
            },
          }}
        >
          Ver detalle
        </Button>
      </Stack>
    </Box>
  );
}