export interface AdminCategory {
  id: string;
  name: string;
  itemCount: number;
}

export interface CategoryActionState {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: {
    name?: string;
  };
}

export interface AdminCategoryOption {
  id: string;
  name: string;
}

export interface AdminCatalogImage {
  id: string;
  imagePath: string;
  imageUrl: string;
  position: number;
}

export interface AdminCatalogItem {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  images: AdminCatalogImage[];
}

export interface CatalogActionState {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: {
    images?: string;
    categoryId?: string;
    title?: string;
  };
}

export interface CreateCatalogItemInput {
  categoryId: string;
  title: string;
  imagePaths: string[];
}

export interface UpdateCatalogItemInput {
  id: string;
  categoryId: string;
  title: string;
  newImagePaths: string[];
  removedImageIds: string[];
}