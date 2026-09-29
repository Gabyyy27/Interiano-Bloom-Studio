"use client";

import {
  isAllowedCatalogImageType,
  MAX_CATALOG_IMAGE_SIZE,
} from "@/lib/catalog/imageRules";
import { createClient } from "@/lib/supabase/client";

const TARGET_IMAGE_SIZE_BYTES = 300 * 1024;

const MAX_IMAGE_DIMENSION = 1920;
const MIN_IMAGE_DIMENSION = 1080;

const INITIAL_WEBP_QUALITY = 0.86;
const MIN_WEBP_QUALITY = 0.64;
const QUALITY_STEP = 0.05;

const RESIZE_STEP = 0.88;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.decoding = "async";

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      reject(
        new Error(
          "No fue posible leer una de las imágenes seleccionadas.",
        ),
      );
    };

    image.src = objectUrl;
  });
}

function createCanvas(
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "El navegador no pudo preparar la imagen para optimizarla.",
    );
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    0,
    0,
    width,
    height,
  );

  return canvas;
}

function canvasToWebp(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new Error(
              "No fue posible optimizar una de las imágenes.",
            ),
          );

          return;
        }

        if (blob.type !== "image/webp") {
          reject(
            new Error(
              "Tu navegador no pudo convertir la imagen a WebP.",
            ),
          );

          return;
        }

        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

function getInitialDimensions(
  width: number,
  height: number,
) {
  const largestDimension = Math.max(
    width,
    height,
  );

  if (largestDimension <= MAX_IMAGE_DIMENSION) {
    return {
      width,
      height,
    };
  }

  const scale =
    MAX_IMAGE_DIMENSION / largestDimension;

  return {
    width: Math.max(
      1,
      Math.round(width * scale),
    ),
    height: Math.max(
      1,
      Math.round(height * scale),
    ),
  };
}

function getNextDimensions(
  width: number,
  height: number,
) {
  const largestDimension = Math.max(
    width,
    height,
  );

  const nextLargestDimension = Math.max(
    MIN_IMAGE_DIMENSION,
    Math.floor(
      largestDimension * RESIZE_STEP,
    ),
  );

  const scale =
    nextLargestDimension / largestDimension;

  return {
    width: Math.max(
      1,
      Math.round(width * scale),
    ),
    height: Math.max(
      1,
      Math.round(height * scale),
    ),
  };
}

function getWebpFileName(fileName: string) {
  const baseName =
    fileName.replace(/\.[^.]+$/, "").trim() ||
    "catalog-image";

  return `${baseName}.webp`;
}

async function optimizeCatalogImage(
  file: File,
): Promise<File> {
  const image = await loadImage(file);

  if (
    !image.naturalWidth ||
    !image.naturalHeight
  ) {
    throw new Error(
      "Una de las imágenes no tiene dimensiones válidas.",
    );
  }

  /*
   * Si ya es WebP, pesa menos de 300 KB
   * y no supera 1920 px, no la volvemos
   * a comprimir para evitar pérdida innecesaria.
   */
  if (
    file.type === "image/webp" &&
    file.size <= TARGET_IMAGE_SIZE_BYTES &&
    Math.max(
      image.naturalWidth,
      image.naturalHeight,
    ) <= MAX_IMAGE_DIMENSION
  ) {
    return file;
  }

  let {
    width,
    height,
  } = getInitialDimensions(
    image.naturalWidth,
    image.naturalHeight,
  );

  while (true) {
    const canvas = createCanvas(
      image,
      width,
      height,
    );

    let quality = INITIAL_WEBP_QUALITY;

    while (
      quality >= MIN_WEBP_QUALITY
    ) {
      const blob = await canvasToWebp(
        canvas,
        quality,
      );

      if (
        blob.size <= TARGET_IMAGE_SIZE_BYTES
      ) {
        return new File(
          [blob],
          getWebpFileName(file.name),
          {
            type: "image/webp",
            lastModified: file.lastModified,
          },
        );
      }

      quality = Number(
        (quality - QUALITY_STEP).toFixed(2),
      );
    }

    const largestDimension = Math.max(
      width,
      height,
    );

    if (
      largestDimension <= MIN_IMAGE_DIMENSION
    ) {
      break;
    }

    const nextDimensions =
      getNextDimensions(
        width,
        height,
      );

    width = nextDimensions.width;
    height = nextDimensions.height;
  }

  throw new Error(
    "No fue posible reducir una imagen a menos de 300 KB sin perder demasiada calidad. Prueba con otra fotografía.",
  );
}

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

      /*
       * La fotografía se optimiza localmente
       * antes de enviarla a Supabase.
       */
      const optimizedFile =
        await optimizeCatalogImage(file);

      const imagePath =
        `catalog/${crypto.randomUUID()}.webp`;

      const { error } = await supabase.storage
        .from("catalog-images")
        .upload(
          imagePath,
          optimizedFile,
          {
            contentType: "image/webp",
            cacheControl: "31536000",
            upsert: false,
          },
        );

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
      await removeCatalogImages(
        uploadedPaths,
      );
    }

    throw error;
  }
}

export async function removeCatalogImages(
  paths: string[],
) {
  const uniquePaths = [
    ...new Set(paths),
  ];

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