"use client";

import { useActionState } from "react";

import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";

import {
  loginAction,
  type LoginState,
} from "./actions";

const initialState: LoginState = {
  error: null,
};

export default function LoginForm() {
  const [state, formAction, isPending] =
    useActionState(loginAction, initialState);

  return (
    <form action={formAction} noValidate>
      <Stack spacing={2.5}>
        {state.error ? (
          <Alert severity="error">
            {state.error}
          </Alert>
        ) : null}

        <TextField
          id="admin-email"
          name="email"
          type="email"
          label="Correo electrónico"
          placeholder="admin@correo.com"
          autoComplete="email"
          required
          fullWidth
          disabled={isPending}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            htmlInput: {
              maxLength: 180,
            },
          }}
        />

        <TextField
          id="admin-password"
          name="password"
          type="password"
          label="Contraseña"
          autoComplete="current-password"
          required
          fullWidth
          disabled={isPending}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            htmlInput: {
              maxLength: 200,
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isPending}
          startIcon={
            isPending ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : undefined
          }
          sx={{
            minHeight: 54,
            mt: 1,
          }}
        >
          {isPending
            ? "Verificando..."
            : "Ingresar al panel"}
        </Button>
      </Stack>
    </form>
  );
}
