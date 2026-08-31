"use server";

import { redirect } from "next/navigation";

import { ADMIN_DEFAULT_PATH } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

export interface LoginState {
  error: string | null;
}

const LOGIN_ERROR_MESSAGE =
  "Correo o contraseña incorrectos.";

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  if (
    typeof emailValue !== "string" ||
    typeof passwordValue !== "string"
  ) {
    return {
      error: "Completa todos los campos.",
    };
  }

  const email = emailValue.trim().toLowerCase();
  const password = passwordValue;

  if (!email || !password) {
    return {
      error: "Completa el correo y la contraseña.",
    };
  }

  const isValidEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail) {
    return {
      error: "Escribe un correo electrónico válido.",
    };
  }

  const supabase = await createClient();

  const { error: loginError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (loginError) {
    return {
      error: LOGIN_ERROR_MESSAGE,
    };
  }

  const {
    data: isAdmin,
    error: adminError,
  } = await supabase.rpc("is_catalog_admin");

  if (adminError || !isAdmin) {
    await supabase.auth.signOut();

    return {
      error: LOGIN_ERROR_MESSAGE,
    };
  }

  redirect(ADMIN_DEFAULT_PATH);
}
