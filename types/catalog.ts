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

export interface PublicCatalogData {
  categories: CatalogCategory[];
  items: CatalogItem[];
  hasError: boolean;
}