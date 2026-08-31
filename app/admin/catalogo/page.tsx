import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import CatalogManager from "@/components/admin/CatalogManager";
import { requireCatalogAdmin } from "@/lib/auth/requireCatalogAdmin";
import type {
  AdminCatalogImage,
  AdminCatalogItem,
  AdminCategoryOption,
} from "@/types/admin";

export const metadata: Metadata = {
  title: "Administrar catálogo",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCatalogPage() {
  const { supabase } =
    await requireCatalogAdmin();

  const [
    categoriesResult,
    itemsResult,
    imagesResult,
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name")
      .order("name", {
        ascending: true,
      }),

    supabase
      .from("catalog_items")
      .select(`
        id,
        category_id,
        title,
        created_at
      `)
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("catalog_item_images")
      .select(`
        id,
        catalog_item_id,
        image_path,
        position,
        created_at
      `)
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      }),
  ]);

  if (categoriesResult.error) {
    console.error(
      "Error al cargar categorías:",
      categoriesResult.error,
    );
  }

  if (itemsResult.error) {
    console.error(
      "Error al cargar ítems:",
      itemsResult.error,
    );
  }

  if (imagesResult.error) {
    console.error(
      "Error al cargar imágenes:",
      imagesResult.error,
    );
  }

  const hasError =
    categoriesResult.error !== null ||
    itemsResult.error !== null ||
    imagesResult.error !== null;

  const categories: AdminCategoryOption[] =
    (categoriesResult.data ?? []).map(
      (category) => ({
        id: category.id,
        name: category.name,
      }),
    );

  const categoryNames = new Map(
    categories.map((category) => [
      category.id,
      category.name,
    ]),
  );

  const imagesByItem = new Map<
    string,
    AdminCatalogImage[]
  >();

  for (const image of imagesResult.data ?? []) {
    const { data: publicUrlData } =
      supabase.storage
        .from("catalog-images")
        .getPublicUrl(image.image_path);

    const mappedImage: AdminCatalogImage = {
      id: image.id,
      imagePath: image.image_path,
      imageUrl: publicUrlData.publicUrl,
      position: image.position,
    };

    const currentImages =
      imagesByItem.get(
        image.catalog_item_id,
      ) ?? [];

    currentImages.push(mappedImage);

    imagesByItem.set(
      image.catalog_item_id,
      currentImages,
    );
  }

  const catalogItems: AdminCatalogItem[] =
    (itemsResult.data ?? []).map((item) => ({
      id: item.id,
      categoryId: item.category_id,
      categoryName:
        categoryNames.get(item.category_id) ??
        "Categoría desconocida",
      title: item.title,
      images:
        imagesByItem.get(item.id) ?? [],
    }));

  return (
    <AdminShell activeSection="catalogo">
      <CatalogManager
        categories={categories}
        catalogItems={catalogItems}
        hasError={hasError}
      />
    </AdminShell>
  );
}