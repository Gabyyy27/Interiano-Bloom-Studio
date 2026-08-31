import { createClient } from "@/lib/supabase/server";
import type {
  CatalogCategory,
  CatalogImage,
  CatalogItem,
  PublicCatalogData,
} from "@/types/catalog";

export async function getPublicCatalog(): Promise<PublicCatalogData> {
  const supabase = await createClient();

  const [
    categoriesResult,
    itemsResult,
    imagesResult,
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug")
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
      "Error al cargar categorías públicas:",
      categoriesResult.error,
    );
  }

  if (itemsResult.error) {
    console.error(
      "Error al cargar el catálogo público:",
      itemsResult.error,
    );
  }

  if (imagesResult.error) {
    console.error(
      "Error al cargar imágenes públicas:",
      imagesResult.error,
    );
  }

  const hasError =
    categoriesResult.error !== null ||
    itemsResult.error !== null ||
    imagesResult.error !== null;

  if (hasError) {
    return {
      categories: [],
      items: [],
      hasError: true,
    };
  }

  const categoryNames = new Map(
    (categoriesResult.data ?? []).map((category) => [
      category.id,
      category.name,
    ]),
  );

  const imagesByItem = new Map<
    string,
    CatalogImage[]
  >();

  for (const image of imagesResult.data ?? []) {
    const { data: publicUrlData } =
      supabase.storage
        .from("catalog-images")
        .getPublicUrl(image.image_path);

    const catalogImage: CatalogImage = {
      id: image.id,
      imageUrl: publicUrlData.publicUrl,
      position: image.position,
    };

    const currentImages =
      imagesByItem.get(
        image.catalog_item_id,
      ) ?? [];

    currentImages.push(catalogImage);

    imagesByItem.set(
      image.catalog_item_id,
      currentImages,
    );
  }

  const items: CatalogItem[] = (
    itemsResult.data ?? []
  )
    .map((item) => ({
      id: item.id,
      categoryId: item.category_id,
      categoryName:
        categoryNames.get(item.category_id) ??
        "Sin categoría",
      title: item.title,
      images:
        imagesByItem.get(item.id) ?? [],
    }))
    .filter((item) => item.images.length > 0);

  /*
   * No mostramos categorías vacías en la landing.
   * "Todos" seguirá siendo una opción exclusiva de la interfaz.
   */
  const categoryIdsWithItems = new Set(
    items.map((item) => item.categoryId),
  );

  const categories: CatalogCategory[] = (
    categoriesResult.data ?? []
  )
    .filter((category) =>
      categoryIdsWithItems.has(category.id),
    )
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));

  return {
    categories,
    items,
    hasError: false,
  };
}