import type { SupabaseClient } from "@supabase/supabase-js";

import { isCatalogImagePath } from "@/lib/catalog/imageRules";

export async function removeCatalogStoragePaths(
  supabase: Pick<SupabaseClient, "storage">,
  paths: string[],
) {
  const validPaths = [
    ...new Set(
      paths.filter((path) =>
        isCatalogImagePath(path),
      ),
    ),
  ];

  if (validPaths.length === 0) {
    return true;
  }

  const { error } = await supabase.storage
    .from("catalog-images")
    .remove(validPaths);

  if (error) {
    console.error(
      "No fue posible eliminar imágenes de Storage:",
      error,
    );

    return false;
  }

  return true;
}
