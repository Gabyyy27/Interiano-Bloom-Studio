"use server";

import { revalidatePath } from "next/cache";

import {
  isCatalogImagePath,
  MAX_CATALOG_IMAGES,
} from "@/lib/catalog/imageRules";
import { removeCatalogStoragePaths } from "@/lib/catalog/removeCatalogStoragePaths";
import { requireCatalogAdmin } from "@/lib/auth/requireCatalogAdmin";
import type {
  CatalogActionState,
  CreateCatalogItemInput,
  UpdateCatalogItemInput,
} from "@/types/admin";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeStringList(values: string[]) {
  return [
    ...new Set(
      values
        .filter((value) => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
}

function validateMetadata(
  titleValue: string,
  categoryIdValue: string,
) {
  const title = normalizeText(titleValue);
  const categoryId = categoryIdValue.trim();

  const fieldErrors: NonNullable<
    CatalogActionState["fieldErrors"]
  > = {};

  if (title.length < 2 || title.length > 120) {
    fieldErrors.title =
      "El título debe contener entre 2 y 120 caracteres.";
  }

  if (!UUID_PATTERN.test(categoryId)) {
    fieldErrors.categoryId =
      "Selecciona una categoría válida.";
  }

  return {
    title,
    categoryId,
    fieldErrors,
  };
}

function revalidateCatalogViews() {
  revalidatePath("/admin/catalogo");
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function createCatalogItemAction(
  input: CreateCatalogItemInput,
): Promise<CatalogActionState> {
  const { supabase } =
    await requireCatalogAdmin();

  const validation = validateMetadata(
    input.title,
    input.categoryId,
  );

  const imagePaths = normalizeStringList(
    input.imagePaths,
  );

  if (
    imagePaths.length < 1 ||
    imagePaths.length > MAX_CATALOG_IMAGES ||
    !imagePaths.every(isCatalogImagePath)
  ) {
    validation.fieldErrors.images =
      `Selecciona entre 1 y ${MAX_CATALOG_IMAGES} imágenes válidas.`;
  }

  if (
    Object.keys(validation.fieldErrors).length > 0
  ) {
    return {
      status: "error",
      message: "Revisa los campos del formulario.",
      fieldErrors: validation.fieldErrors,
    };
  }

  const {
    data: category,
    error: categoryError,
  } = await supabase
    .from("categories")
    .select("id")
    .eq("id", validation.categoryId)
    .maybeSingle();

  if (categoryError || !category) {
    await removeCatalogStoragePaths(
      supabase,
      imagePaths,
    );

    return {
      status: "error",
      message:
        "La categoría seleccionada no está disponible.",
      fieldErrors: {
        categoryId:
          "Selecciona otra categoría.",
      },
    };
  }

  /*
   * image_path todavía se conserva temporalmente
   * para mantener compatibilidad con el código público.
   */
  const {
    data: item,
    error: itemError,
  } = await supabase
    .from("catalog_items")
    .insert({
      category_id: validation.categoryId,
      title: validation.title,
      image_path: imagePaths[0],
    })
    .select("id")
    .single();

  if (itemError || !item) {
    console.error(
      "Error al crear el ítem:",
      itemError,
    );

    await removeCatalogStoragePaths(
      supabase,
      imagePaths,
    );

    return {
      status: "error",
      message:
        "No fue posible crear el ítem.",
    };
  }

  const imageRows = imagePaths.map(
    (imagePath, position) => ({
      catalog_item_id: item.id,
      image_path: imagePath,
      position,
    }),
  );

  const { error: imagesError } = await supabase
    .from("catalog_item_images")
    .insert(imageRows);

  if (imagesError) {
    console.error(
      "Error al guardar las imágenes:",
      imagesError,
    );

    await supabase
      .from("catalog_items")
      .delete()
      .eq("id", item.id);

    await removeCatalogStoragePaths(
      supabase,
      imagePaths,
    );

    return {
      status: "error",
      message:
        "No fue posible relacionar las imágenes con el ítem.",
    };
  }

  revalidateCatalogViews();

  return {
    status: "success",
    message: "Ítem agregado correctamente.",
  };
}

export async function updateCatalogItemAction(
  input: UpdateCatalogItemInput,
): Promise<CatalogActionState> {
  const { supabase } =
    await requireCatalogAdmin();

  if (!UUID_PATTERN.test(input.id)) {
    await removeCatalogStoragePaths(
      supabase,
      input.newImagePaths,
    );

    return {
      status: "error",
      message: "El ítem seleccionado no es válido.",
    };
  }

  const validation = validateMetadata(
    input.title,
    input.categoryId,
  );

  const newImagePaths = normalizeStringList(
    input.newImagePaths,
  );

  const removedImageIds = normalizeStringList(
    input.removedImageIds,
  );

  if (
    !newImagePaths.every(isCatalogImagePath) ||
    !removedImageIds.every((id) =>
      UUID_PATTERN.test(id),
    )
  ) {
    validation.fieldErrors.images =
      "La selección de imágenes no es válida.";
  }

  const [
    itemResult,
    imagesResult,
    categoryResult,
  ] = await Promise.all([
    supabase
      .from("catalog_items")
      .select(
        "id, category_id, title, image_path",
      )
      .eq("id", input.id)
      .maybeSingle(),

    supabase
      .from("catalog_item_images")
      .select(`
        id,
        catalog_item_id,
        image_path,
        position,
        created_at
      `)
      .eq("catalog_item_id", input.id)
      .order("position", {
        ascending: true,
      }),

    supabase
      .from("categories")
      .select("id")
      .eq("id", validation.categoryId)
      .maybeSingle(),
  ]);

  if (
    itemResult.error ||
    imagesResult.error ||
    !itemResult.data
  ) {
    await removeCatalogStoragePaths(
      supabase,
      newImagePaths,
    );

    return {
      status: "error",
      message:
        "No fue posible cargar el ítem seleccionado.",
    };
  }

  if (
    categoryResult.error ||
    !categoryResult.data
  ) {
    await removeCatalogStoragePaths(
      supabase,
      newImagePaths,
    );

    return {
      status: "error",
      message:
        "La categoría seleccionada no está disponible.",
      fieldErrors: {
        categoryId:
          "Selecciona otra categoría.",
      },
    };
  }

  const currentImages =
    imagesResult.data ?? [];

  const currentImageIds = new Set(
    currentImages.map((image) => image.id),
  );

  const containsUnknownImage =
    removedImageIds.some(
      (id) => !currentImageIds.has(id),
    );

  if (containsUnknownImage) {
    validation.fieldErrors.images =
      "Una de las imágenes seleccionadas ya no existe.";
  }

  const removedIdSet = new Set(
    removedImageIds,
  );

  const keptImages = currentImages.filter(
    (image) => !removedIdSet.has(image.id),
  );

  const removedImages = currentImages.filter(
    (image) => removedIdSet.has(image.id),
  );

  const finalImagePaths = [
    ...keptImages.map(
      (image) => image.image_path,
    ),
    ...newImagePaths,
  ];

  if (
    finalImagePaths.length < 1 ||
    finalImagePaths.length >
      MAX_CATALOG_IMAGES
  ) {
    validation.fieldErrors.images =
      `El ítem debe conservar entre 1 y ${MAX_CATALOG_IMAGES} imágenes.`;
  }

  if (
    Object.keys(validation.fieldErrors).length > 0
  ) {
    await removeCatalogStoragePaths(
      supabase,
      newImagePaths,
    );

    return {
      status: "error",
      message: "Revisa los campos del formulario.",
      fieldErrors: validation.fieldErrors,
    };
  }

  const highestPosition = currentImages.reduce(
    (maximum, image) =>
      Math.max(maximum, image.position),
    -1,
  );

  const newImageRows = newImagePaths.map(
    (imagePath, index) => ({
      catalog_item_id: input.id,
      image_path: imagePath,
      position:
        highestPosition + index + 1,
    }),
  );

  if (newImageRows.length > 0) {
    const { error } = await supabase
      .from("catalog_item_images")
      .insert(newImageRows);

    if (error) {
      console.error(
        "Error al agregar imágenes:",
        error,
      );

      await removeCatalogStoragePaths(
        supabase,
        newImagePaths,
      );

      return {
        status: "error",
        message:
          "No fue posible agregar las nuevas imágenes.",
      };
    }
  }

  if (removedImageIds.length > 0) {
    const { error } = await supabase
      .from("catalog_item_images")
      .delete()
      .eq("catalog_item_id", input.id)
      .in("id", removedImageIds);

    if (error) {
      console.error(
        "Error al retirar imágenes:",
        error,
      );

      if (newImagePaths.length > 0) {
        await supabase
          .from("catalog_item_images")
          .delete()
          .eq("catalog_item_id", input.id)
          .in(
            "image_path",
            newImagePaths,
          );
      }

      await removeCatalogStoragePaths(
        supabase,
        newImagePaths,
      );

      return {
        status: "error",
        message:
          "No fue posible actualizar las imágenes.",
      };
    }
  }

  const { error: updateError } = await supabase
    .from("catalog_items")
    .update({
      category_id: validation.categoryId,
      title: validation.title,

      /*
       * Mantiene sincronizada la columna temporal.
       * La primera imagen es la imagen principal.
       */
      image_path: finalImagePaths[0],
    })
    .eq("id", input.id);

  if (updateError) {
    console.error(
      "Error al actualizar el ítem:",
      updateError,
    );

    if (newImagePaths.length > 0) {
      await supabase
        .from("catalog_item_images")
        .delete()
        .eq("catalog_item_id", input.id)
        .in(
          "image_path",
          newImagePaths,
        );
    }

    if (removedImages.length > 0) {
      const { error: restoreError } =
        await supabase
          .from("catalog_item_images")
          .insert(
            removedImages.map((image) => ({
              id: image.id,
              catalog_item_id:
                image.catalog_item_id,
              image_path: image.image_path,
              position: image.position,
              created_at: image.created_at,
            })),
          );

      if (restoreError) {
        console.error(
          "No fue posible restaurar las imágenes:",
          restoreError,
        );
      }
    }

    await removeCatalogStoragePaths(
      supabase,
      newImagePaths,
    );

    return {
      status: "error",
      message:
        "No fue posible actualizar el ítem.",
    };
  }

  await removeCatalogStoragePaths(
    supabase,
    removedImages.map(
      (image) => image.image_path,
    ),
  );

  revalidateCatalogViews();

  return {
    status: "success",
    message: "Ítem actualizado correctamente.",
  };
}

export async function deleteCatalogItemAction(
  itemId: string,
): Promise<CatalogActionState> {
  const { supabase } =
    await requireCatalogAdmin();

  if (!UUID_PATTERN.test(itemId)) {
    return {
      status: "error",
      message: "El ítem seleccionado no es válido.",
    };
  }

  const [itemResult, imagesResult] =
    await Promise.all([
      supabase
        .from("catalog_items")
        .select("id, image_path")
        .eq("id", itemId)
        .maybeSingle(),

      supabase
        .from("catalog_item_images")
        .select("image_path")
        .eq("catalog_item_id", itemId),
    ]);

  if (
    itemResult.error ||
    imagesResult.error ||
    !itemResult.data
  ) {
    return {
      status: "error",
      message:
        "No fue posible cargar el ítem seleccionado.",
    };
  }

  const imagePaths = [
    itemResult.data.image_path,
    ...(imagesResult.data ?? []).map(
      (image) => image.image_path,
    ),
  ].filter(Boolean);

  const { error: deleteError } =
    await supabase
      .from("catalog_items")
      .delete()
      .eq("id", itemId);

  if (deleteError) {
    console.error(
      "Error al eliminar el ítem:",
      deleteError,
    );

    return {
      status: "error",
      message:
        "No fue posible eliminar el ítem.",
    };
  }

  await removeCatalogStoragePaths(
    supabase,
    imagePaths,
  );

  revalidateCatalogViews();

  return {
    status: "success",
    message: "Ítem eliminado correctamente.",
  };
}
