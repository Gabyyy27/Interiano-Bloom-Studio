"use server";

import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

export async function logoutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect(ADMIN_LOGIN_PATH);
}
