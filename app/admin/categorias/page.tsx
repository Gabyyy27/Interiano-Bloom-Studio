import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import CategoryManager from "@/components/admin/CategoryManager";
import { requireCatalogAdmin } from "@/lib/auth/requireCatalogAdmin";
import type { AdminCategory } from "@/types/admin";

export const metadata: Metadata = {
  title: "Administrar categorías",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCategoriesPage() {
  const { supabase } = await requireCatalogAdmin();

  const [categoriesResult, itemCategoriesResult] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id, name, created_at")
        .order("name", {
          ascending: true,
        }),

      supabase
        .from("catalog_items")
        .select("category_id"),
    ]);

  if (categoriesResult.error) {
    console.error(
      "Error al cargar categorías:",
      categoriesResult.error,
    );
  }

  if (itemCategoriesResult.error) {
    console.error(
      "Error al cargar los contadores:",
      itemCategoriesResult.error,
    );
  }

  const hasError =
    categoriesResult.error !== null ||
    itemCategoriesResult.error !== null;

  const itemCounts = new Map<string, number>();

  for (const item of itemCategoriesResult.data ?? []) {
    const currentCount =
      itemCounts.get(item.category_id) ?? 0;

    itemCounts.set(
      item.category_id,
      currentCount + 1,
    );
  }

  const categories: AdminCategory[] = (
    categoriesResult.data ?? []
  ).map((category) => ({
    id: category.id,
    name: category.name,
    itemCount: itemCounts.get(category.id) ?? 0,
  }));

  return (
    <AdminShell activeSection="categorias">
      <CategoryManager
        categories={categories}
        hasError={hasError}
      />
    </AdminShell>
  );
}