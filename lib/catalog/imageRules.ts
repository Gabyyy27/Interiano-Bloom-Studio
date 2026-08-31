export const MAX_CATALOG_IMAGES = 6;

export const MAX_CATALOG_IMAGE_SIZE =
  5 * 1024 * 1024;

export const CATALOG_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const CATALOG_IMAGE_PATH_PATTERN =
  /^catalog\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/i;

export function isAllowedCatalogImageType(
  mimeType: string,
) {
  return ALLOWED_IMAGE_TYPES.has(mimeType);
}

export function getCatalogImageExtension(
  mimeType: string,
) {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";

    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    default:
      return null;
  }
}

export function isCatalogImagePath(path: string) {
  return CATALOG_IMAGE_PATH_PATTERN.test(path);
}