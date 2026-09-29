import { unstable_cache } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public";
import type {
  CatalogCategory,
  CatalogImage,
  CatalogItem,
  PublicCatalogPageData,
  PublicCatalogQuery,
} from "@/types/catalog";

export const PUBLIC_CATALOG_CACHE_TAG =
  "public-catalog";

const PUBLIC_CATALOG_PAGE_SIZE = 10;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Normaliza el número de página recibido.
 */
function normalizePage(page?: number) {
  if (
    typeof page !== "number" ||
    !Number.isInteger(page) ||
    page < 1
  ) {
    return 1;
  }

  return page;
}

/**
 * Solo permite IDs de categoría válidos.
 *
 * null representa la opción "Todos".
 */
function normalizeCategoryId(
  categoryId?: string | null,
) {
  if (!categoryId) {
    return null;
  }

  const normalizedCategoryId =
    categoryId.trim();

  if (!UUID_PATTERN.test(normalizedCategoryId)) {
    return null;
  }

  return normalizedCategoryId;
}

/*
 * =========================================================
 * CATÁLOGO PAGINADO
 * =========================================================
 *
 * Esta será la función que utilizará la landing una vez
 * conectemos page.tsx y CatalogSection.
 *
 * Importante:
 *
 * - Solo consulta 10 productos.
 * - El filtro por categoría ocurre en Supabase.
 * - Solo consulta imágenes pertenecientes a esos productos.
 * - Supabase devuelve también el COUNT total.
 */
const getCachedPublicCatalogPage =
  unstable_cache(
    async (
      page: number,
      categoryId: string | null,
    ): Promise<PublicCatalogPageData> => {
      const supabase =
        createPublicClient();

      /*
       * Primero cargamos las categorías disponibles.
       *
       * Esto nos permite validar también que una
       * categoría recibida en la URL realmente exista.
       */
      const categoriesResult =
        await supabase
          .from("categories")
          .select(`
      id,
      name,
      slug,
      catalog_items()
    `)
          .not(
            "catalog_items",
            "is",
            null,
          )
          .order("name", {
            ascending: true,
          });

      if (categoriesResult.error) {
        console.error(
          "Error al cargar categorías públicas paginadas:",
          categoriesResult.error,
        );

        return {
          categories: [],
          items: [],
          hasError: true,

          page: 1,
          pageSize:
            PUBLIC_CATALOG_PAGE_SIZE,

          totalItems: 0,
          totalPages: 0,

          categoryId: null,
        };
      }

      const categories:
        CatalogCategory[] =
        (
          categoriesResult.data ?? []
        ).map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
        }));

      /*
       * Si alguien escribe manualmente una categoría
       * que no existe, la tratamos como "Todos".
       */
      const effectiveCategoryId =
        categoryId &&
          categories.some(
            (category) =>
              category.id === categoryId,
          )
          ? categoryId
          : null;

      /*
       * IMPORTANTE:
       *
       * Primero obtenemos solamente el COUNT.
       *
       * Así sabemos cuántas páginas existen antes
       * de ejecutar .range(), evitando PGRST103
       * cuando alguien escribe ?page=999.
       */
      let countQuery =
        supabase
          .from("catalog_items")
          .select("id", {
            count: "exact",
            head: true,
          });

      if (effectiveCategoryId) {
        countQuery =
          countQuery.eq(
            "category_id",
            effectiveCategoryId,
          );
      }

      const countResult =
        await countQuery;

      if (countResult.error) {
        console.error(
          "Error al contar productos públicos:",
          countResult.error,
        );

        return {
          categories,
          items: [],
          hasError: true,

          page: 1,
          pageSize:
            PUBLIC_CATALOG_PAGE_SIZE,

          totalItems: 0,
          totalPages: 0,

          categoryId:
            effectiveCategoryId,
        };
      }

      const totalItems =
        countResult.count ?? 0;

      const totalPages =
        Math.ceil(
          totalItems /
          PUBLIC_CATALOG_PAGE_SIZE,
        );

      /*
       * Una página solicitada nunca puede superar
       * la última página existente.
       */
      const safePage =
        totalPages === 0
          ? 1
          : Math.min(
            page,
            totalPages,
          );

      /*
       * Si no existen productos, terminamos aquí.
       *
       * No hacemos consultas innecesarias.
       */
      if (totalItems === 0) {
        return {
          categories,
          items: [],
          hasError: false,

          page: 1,
          pageSize:
            PUBLIC_CATALOG_PAGE_SIZE,

          totalItems: 0,
          totalPages: 0,

          categoryId:
            effectiveCategoryId,
        };
      }

      const from =
        (safePage - 1) *
        PUBLIC_CATALOG_PAGE_SIZE;

      const to =
        from +
        PUBLIC_CATALOG_PAGE_SIZE -
        1;

      /*
       * Ahora sí hacemos el RANGE, porque ya sabemos
       * que safePage está dentro de un rango válido.
       */
      let itemsQuery =
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
          })
          .range(from, to);

      if (effectiveCategoryId) {
        itemsQuery =
          itemsQuery.eq(
            "category_id",
            effectiveCategoryId,
          );
      }

      const itemsResult =
        await itemsQuery;

      if (itemsResult.error) {
        console.error(
          "Error al cargar catálogo público paginado:",
          itemsResult.error,
        );

        return {
          categories,
          items: [],
          hasError: true,

          page: safePage,
          pageSize:
            PUBLIC_CATALOG_PAGE_SIZE,

          totalItems,
          totalPages,

          categoryId:
            effectiveCategoryId,
        };
      }

      const itemRows =
        itemsResult.data ?? [];

      const itemIds =
        itemRows.map(
          (item) => item.id,
        );

      let imageRows: {
        id: string;
        catalog_item_id: string;
        image_path: string;
        position: number;
        created_at: string;
      }[] = [];

      if (itemIds.length > 0) {
        const imagesResult =
          await supabase
            .from(
              "catalog_item_images",
            )
            .select(`
          id,
          catalog_item_id,
          image_path,
          position,
          created_at
        `)
            .in(
              "catalog_item_id",
              itemIds,
            )
            .order("position", {
              ascending: true,
            })
            .order("created_at", {
              ascending: true,
            });

        if (imagesResult.error) {
          console.error(
            "Error al cargar imágenes de la página pública:",
            imagesResult.error,
          );

          return {
            categories,
            items: [],
            hasError: true,

            page: safePage,
            pageSize:
              PUBLIC_CATALOG_PAGE_SIZE,

            totalItems,
            totalPages,

            categoryId:
              effectiveCategoryId,
          };
        }

        imageRows =
          imagesResult.data ?? [];
      }

      const categoryNames =
        new Map(
          categories.map(
            (category) => [
              category.id,
              category.name,
            ],
          ),
        );

      const imagesByItem =
        new Map<
          string,
          CatalogImage[]
        >();

      for (
        const image of imageRows
      ) {
        const {
          data: publicUrlData,
        } =
          supabase.storage
            .from(
              "catalog-images",
            )
            .getPublicUrl(
              image.image_path,
            );

        const catalogImage:
          CatalogImage = {
          id: image.id,
          imageUrl:
            publicUrlData.publicUrl,
          position:
            image.position,
        };

        const currentImages =
          imagesByItem.get(
            image.catalog_item_id,
          ) ?? [];

        currentImages.push(
          catalogImage,
        );

        imagesByItem.set(
          image.catalog_item_id,
          currentImages,
        );
      }

      const items: CatalogItem[] =
        itemRows
          .map((item) => ({
            id: item.id,

            categoryId:
              item.category_id,

            categoryName:
              categoryNames.get(
                item.category_id,
              ) ??
              "Sin categoría",

            title:
              item.title,

            images:
              imagesByItem.get(
                item.id,
              ) ?? [],
          }))
          .filter(
            (item) =>
              item.images.length > 0,
          );

      return {
        categories,
        items,
        hasError: false,

        page: safePage,
        pageSize:
          PUBLIC_CATALOG_PAGE_SIZE,

        totalItems,
        totalPages,

        categoryId:
          effectiveCategoryId,
      };
    },
    ["public-catalog-page"],
    {
      tags: [
        PUBLIC_CATALOG_CACHE_TAG,
      ],
      revalidate: 3600,
    },
  );

/**
 * Consulta pública paginada del catálogo.
 *
 * La landing utiliza esta función para obtener
 * únicamente la página y categoría solicitadas.
 */
export async function getPublicCatalogPage(
  query: PublicCatalogQuery = {},
): Promise<PublicCatalogPageData> {
  const page =
    normalizePage(query.page);

  const categoryId =
    normalizeCategoryId(
      query.categoryId,
    );

  return getCachedPublicCatalogPage(
    page,
    categoryId,
  );
}