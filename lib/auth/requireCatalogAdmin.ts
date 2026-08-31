import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

export async function requireCatalogAdmin() {
  const supabase = await createClient();

  const {
    data: claimsData,
    error: claimsError,
  } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (
    claimsError ||
    typeof userId !== "string" ||
    userId.length === 0
  ) {
    redirect(ADMIN_LOGIN_PATH);
  }

  const {
    data: isAdmin,
    error: adminError,
  } = await supabase.rpc("is_catalog_admin");

  if (adminError || !isAdmin) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return {
    supabase,
    userId,
  };
}
