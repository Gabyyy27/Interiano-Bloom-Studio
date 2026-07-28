export const catalogCategories = [
  "Todos",
  "Cumpleaños",
  "Aniversarios",
  "Bodas",
  "Detalles",
] as const;

export type CatalogCategory =
  (typeof catalogCategories)[number];

export interface CatalogItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: Exclude<CatalogCategory, "Todos">;
  imageSrc: string;
  imageAlt: string;
}