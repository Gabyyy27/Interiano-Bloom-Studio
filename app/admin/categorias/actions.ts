"use server";

import { revalidatePath } from "next/cache";

import { requireCatalogAdmin } from "@/lib/auth/requireCatalogAdmin";
import { removeCatalogStoragePaths } from "@/lib/catalog/removeCatalogStoragePaths";
import type { CategoryActionState } from "@/types/admin";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateName(formData: FormData) {
  const nameValue = formData.get("name");

  const name =
    typeof nameValue === "string"
      ? normalizeName(nameValue)
      : "";

  if (name.length < 2 || name.length > 60) {
    return {
      name,
      slug: "",
      error:
        "El nombre debe contener entre 2 y 60 caracteres.",
    };
  }

  const slug = createSlug(name);

  if (!slug) {
    return {
      name,
      slug,
      error:
        "El nombre debe contener al menos una letra o un número.",
    };
  }

  return {
    name,
    slug,
    error: null,
  };
}

function getDatabaseErrorMessage(
  code: string | undefined,
  fallback: string,
) {
  if (code === "23505") {
    return "Ya existe una categoría con ese nombre.";
  }

  if (code === "23503") {
    return "No fue posible eliminar la categoría porque la base de datos todavía no permite eliminación en cascada.";
  }

  return fallback;
}

function revalidateCategoryViews() {
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/catalogo");
  revalidatePath("/");
}

export async function createCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const validation = validateName(formData);

  if (validation.error) {
    return {
      status: "error",
      message: "Revisa el nombre de la categoría.",
      fieldErrors: {
        name: validation.error,
      },
    };
  }

  const { supabase } = await requireCatalogAdmin();

  const { error } = await supabase
    .from("categories")
    .insert({
      name: validation.name,
      slug: validation.slug,
    });

  if (error) {
    console.error("Error al crear la categoría:", error);

    return {
      status: "error",
      message: getDatabaseErrorMessage(
        error.code,
        "No fue posible crear la categoría.",
      ),
    };
  }

  revalidateCategoryViews();

  return {
    status: "success",
    message: "Categoría creada correctamente.",
  };
}

export async function updateCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const idValue = formData.get("id");

  if (
    typeof idValue !== "string" ||
    !UUID_PATTERN.test(idValue)
  ) {
    return {
      status: "error",
      message: "La categoría seleccionada no es válida.",
    };
  }

  const validation = validateName(formData);

  if (validation.error) {
    return {
      status: "error",
      message: "Revisa el nombre de la categoría.",
      fieldErrors: {
        name: validation.error,
      },
    };
  }

  const { supabase } = await requireCatalogAdmin();

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: validation.name,
      slug: validation.slug,
    })
    .eq("id", idValue)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error(
      "Error al actualizar la categoría:",
      error,
    );

    return {
      status: "error",
      message: getDatabaseErrorMessage(
        error.code,
        "No fue posible actualizar la categoría.",
      ),
    };
  }

  if (!data) {
    return {
      status: "error",
      message: "La categoría ya no existe.",
    };
  }

  revalidateCategoryViews();

  return {
    status: "success",
    message: "Categoría actualizada correctamente.",
  };
}

export async function deleteCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const { supabase } = await requireCatalogAdmin();

  const idValue = formData.get("id");

  if (
    typeof idValue !== "string" ||
    !UUID_PATTERN.test(idValue)
  ) {
    return {
      status: "error",
      message: "La categoría seleccionada no es válida.",
    };
  }

  const { data: items, error: itemsError } =
    await supabase
      .from("catalog_items")
      .select("id, image_path")
      .eq("category_id", idValue);

  if (itemsError) {
    console.error(
      "Error al cargar ítems de la categoría:",
      itemsError,
    );

    return {
      status: "error",
      message:
        "No fue posible cargar los ítems de la categoría.",
    };
  }

  const itemIds = (items ?? []).map(
    (item) => item.id,
  );

  let relatedImagePaths: string[] = [];

  if (itemIds.length > 0) {
    const { data: images, error: imagesError } =
      await supabase
        .from("catalog_item_images")
        .select("image_path")
        .in("catalog_item_id", itemIds);

    if (imagesError) {
      console.error(
        "Error al cargar imágenes de la categoría:",
        imagesError,
      );

      return {
        status: "error",
        message:
          "No fue posible cargar las imágenes de la categoría.",
      };
    }

    relatedImagePaths = (images ?? [])
      .map((image) => image.image_path)
      .filter(
        (path): path is string =>
          typeof path === "string" &&
          path.length > 0,
      );
  }

  const storagePaths = [
    ...(items ?? []).map((item) => item.image_path),
    ...relatedImagePaths,
  ].filter(
    (path): path is string =>
      typeof path === "string" && path.length > 0,
  );

  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", idValue)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error(
      "Error al eliminar la categoría:",
      error,
    );

    return {
      status: "error",
      message: getDatabaseErrorMessage(
        error.code,
        "No fue posible eliminar la categoría.",
      ),
    };
  }

  if (!data) {
    return {
      status: "error",
      message: "La categoría ya no existe.",
    };
  }

  await removeCatalogStoragePaths(
    supabase,
    storagePaths,
  );

  revalidateCategoryViews();

  return {
    status: "success",
    message: "Categoría eliminada correctamente.",
  };
}
