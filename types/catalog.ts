export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogImage {
  id: string;
  imageUrl: string;
  position: number;
}

export interface CatalogItem {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  images: CatalogImage[];
}

/**
 * Parámetros que podrá recibir la consulta
 * paginada del catálogo público.
 *
 * categoryId = null significa "Todos".
 */
export interface PublicCatalogQuery {
  page?: number;
  categoryId?: string | null;
}

/**
 * Resultado paginado que recibirá la landing
 * una vez terminemos la migración.
 */
export interface PublicCatalogPageData {
  categories: CatalogCategory[];
  items: CatalogItem[];
  hasError: boolean;

  page: number;
  pageSize: number;

  totalItems: number;
  totalPages: number;

  categoryId: string | null;
}