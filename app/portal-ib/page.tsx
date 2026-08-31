import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { ADMIN_DEFAULT_PATH } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Acceso administrativo",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  if (claimsData?.claims?.sub) {
    const { data: isAdmin } =
      await supabase.rpc("is_catalog_admin");

    if (isAdmin) {
      redirect(ADMIN_DEFAULT_PATH);
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        p: {
          xs: 2,
          sm: 3,
        },
        background: `
          radial-gradient(
            circle at 15% 15%,
            rgba(216, 189, 139, 0.22),
            transparent 28%
          ),
          radial-gradient(
            circle at 85% 85%,
            rgba(107, 81, 56, 0.12),
            transparent 30%
          ),
          linear-gradient(
            135deg,
            #FBF7F0 0%,
            #F7F1E7 100%
          )
        `,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: {
            xs: 3,
            sm: 5,
          },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: {
            xs: 4,
            sm: 5,
          },
          backgroundColor:
            "rgba(255, 253, 248, 0.88)",
          backdropFilter: "blur(16px)",
          boxShadow:
            "0 28px 70px rgba(73, 53, 36, 0.12)",
        }}
      >
        <Stack spacing={4}>
          <Stack
            spacing={1}
            sx={{
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <Typography
              component="p"
              sx={{
                color: "primary.dark",
                fontFamily:
                  "var(--font-display), Georgia, serif",
                fontSize: {
                  xs: "2rem",
                  sm: "2.35rem",
                },
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              Interiano{" "}
              <Box
                component="span"
                sx={{
                  color: "secondary.dark",
                  fontFamily:
                    "var(--font-script), cursive",
                  fontSize: "0.72em",
                }}
              >
                Bloom Studio
              </Box>
            </Typography>

            <Typography
              component="p"
              variant="body2"
              sx={{
                color: "secondary.dark",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Panel administrativo
            </Typography>
          </Stack>

          <Stack
            spacing={1}
            sx={{
              textAlign: "center",
            }}
          >

          </Stack>

          <LoginForm />

          <Typography
            component="a"
            href="/"
            variant="body2"
            sx={{
              width: "fit-content",
              mx: "auto",
              color: "primary.main",
              textDecoration: "underline",

              "&:hover": {
                textDecoration: "underline",
                icon: {
                  color: "primary.main",
                },
              },
            }}
          >
            Volver al sitio público
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
