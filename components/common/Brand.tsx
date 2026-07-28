import Image from "next/image";
import Link from "next/link";

import { Box, Typography } from "@mui/material";

interface BrandProps {
  inverse?: boolean;
  compact?: boolean;
}

export default function Brand({
  inverse = false,
  compact = false,
}: BrandProps) {
  return (
    <Link
      href="#inicio"
      aria-label="Ir al inicio de Interiano Bloom Studio"
      style={{
        display: "inline-block",
        color: "inherit",
        textDecoration: "none",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: {
            xs: 1,
            sm: 1.5,
          },
          whiteSpace: "nowrap",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: compact
              ? {
                  xs: 38,
                  sm: 42,
                }
              : {
                  xs: 48,
                  sm: 56,
                },
            height: compact
              ? {
                  xs: 38,
                  sm: 42,
                }
              : {
                  xs: 48,
                  sm: 56,
                },
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: "50%",
            backgroundColor: "background.default",
          }}
        >
          <Image
            src="/images/logo-icon-2.svg"
            alt="Logo de Interiano Bloom Studio"
            fill
            sizes={compact ? "42px" : "56px"}
            quality={100}
            style={{
              objectFit: "contain",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: {
              xs: 0.5,
              sm: 0.75,
            },
            whiteSpace: "nowrap",
          }}
        >
          <Typography
            component="span"
            sx={{
              color: inverse
                ? "common.white"
                : "primary.dark",
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: {
                xs: "1.3rem",
                sm: "1.65rem",
              },
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "0.025em",
            }}
          >
            Interiano
          </Typography>

          <Typography
            component="span"
            sx={{
              color: inverse
                ? "secondary.light"
                : "secondary.dark",
              fontFamily: "var(--font-script), cursive",
              fontSize: {
                xs: "0.95rem",
                sm: "1.15rem",
              },
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            Bloom Studio
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}