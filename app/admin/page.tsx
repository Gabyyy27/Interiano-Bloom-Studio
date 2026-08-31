import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ADMIN_DEFAULT_PATH } from "@/lib/auth/routes";
import { requireCatalogAdmin } from "@/lib/auth/requireCatalogAdmin";

export const metadata: Metadata = {
  title: "Panel administrativo",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  await requireCatalogAdmin();

  redirect(ADMIN_DEFAULT_PATH);
}
