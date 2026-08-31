"use client";

import {
  getCatalogImageExtension,
  isAllowedCatalogImageType,
  MAX_CATALOG_IMAGE_SIZE,
} from "@/lib/catalog/imageRules";
import { createClient } from "@/lib/supabase/client";

export async function uploadCatalogImages(
  files: File[],
): Promise<string[]> {
  const supabase = createClient();
  const uploadedPaths: string[] = [];

  try {
    for (const file of files) {
      if (!isAllowedCatalogImageType(file.type)) {
        throw new Error(
          "Una de las imágenes tiene un formato inválido.",
        );
      }

      if (file.size > MAX_CATALOG_IMAGE_SIZE) {
        throw new Error(
          "Una de las imágenes supera los 5 MB.",
        );
      }

      const extension =
        getCatalogImageExtension(file.type);

      if (!extension) {
        throw new Error(
          "No fue posible identificar el formato de una imagen.",
        );
      }

      const imagePath =
        `catalog/${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from("catalog-images")
        .upload(imagePath, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(
          "Error al subir imagen:",
          error,
        );

        throw new Error(
          "No fue posible subir una de las imágenes.",
        );
      }

      uploadedPaths.push(imagePath);
    }

    return uploadedPaths;
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await removeCatalogImages(uploadedPaths);
    }

    throw error;
  }
}

export async function removeCatalogImages(
  paths: string[],
) {
  const uniquePaths = [...new Set(paths)];

  if (uniquePaths.length === 0) {
    return;
  }

  const supabase = createClient();

  const { error } = await supabase.storage
    .from("catalog-images")
    .remove(uniquePaths);

  if (error) {
    console.error(
      "No fue posible limpiar las imágenes:",
      error,
    );
  }
}