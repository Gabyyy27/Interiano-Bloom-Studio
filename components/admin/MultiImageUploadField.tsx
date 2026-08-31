"use client";

import {
  type ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  CATALOG_IMAGE_ACCEPT,
  isAllowedCatalogImageType,
  MAX_CATALOG_IMAGES,
  MAX_CATALOG_IMAGE_SIZE,
} from "@/lib/catalog/imageRules";
import type { AdminCatalogImage } from "@/types/admin";

interface MultiImageUploadFieldProps {
  existingImages: AdminCatalogImage[];
  selectedFiles: File[];
  removedImageIds: string[];
  error?: string;
  disabled?: boolean;
  onSelectedFilesChange: (
    files: File[],
  ) => void;
  onRemovedImageIdsChange: (
    imageIds: string[],
  ) => void;
}

export default function MultiImageUploadField({
  existingImages,
  selectedFiles,
  removedImageIds,
  error,
  disabled = false,
  onSelectedFilesChange,
  onRemovedImageIdsChange,
}: MultiImageUploadFieldProps) {
  const [selectionError, setSelectionError] =
    useState<string | null>(null);

  const filePreviews = useMemo(
    () =>
      selectedFiles.map(
        (file) => ({
          file,
          url: URL.createObjectURL(file),
        }),
      ),
    [selectedFiles],
  );

  useEffect(() => {
    return () => {
      filePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [filePreviews]);

  const removedIdSet = new Set(
    removedImageIds,
  );

  const activeExistingImages =
    existingImages.filter(
      (image) => !removedIdSet.has(image.id),
    );

  const totalImages =
    activeExistingImages.length +
    selectedFiles.length;

  const handleFilesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const incomingFiles = Array.from(
      event.target.files ?? [],
    );

    event.target.value = "";

    if (incomingFiles.length === 0) {
      return;
    }

    const hasInvalidType =
      incomingFiles.some(
        (file) =>
          !isAllowedCatalogImageType(
            file.type,
          ),
      );

    if (hasInvalidType) {
      setSelectionError(
        "Solo se permiten imágenes JPG, PNG o WebP.",
      );
      return;
    }

    const hasOversizedFile =
      incomingFiles.some(
        (file) =>
          file.size >
          MAX_CATALOG_IMAGE_SIZE,
      );

    if (hasOversizedFile) {
      setSelectionError(
        "Cada imagen debe pesar 5 MB o menos.",
      );
      return;
    }

    const availableSpaces =
      MAX_CATALOG_IMAGES - totalImages;

    if (availableSpaces <= 0) {
      setSelectionError(
        `Puedes seleccionar hasta ${MAX_CATALOG_IMAGES} imágenes.`,
      );
      return;
    }

    const acceptedFiles =
      incomingFiles.slice(
        0,
        availableSpaces,
      );

    onSelectedFilesChange([
      ...selectedFiles,
      ...acceptedFiles,
    ]);

    if (
      incomingFiles.length >
      availableSpaces
    ) {
      setSelectionError(
        `Solo se agregaron ${availableSpaces} imágenes para respetar el máximo de ${MAX_CATALOG_IMAGES}.`,
      );
    } else {
      setSelectionError(null);
    }
  };

  const removeExistingImage = (
    imageId: string,
  ) => {
    onRemovedImageIdsChange([
      ...removedImageIds,
      imageId,
    ]);

    setSelectionError(null);
  };

  const removeSelectedFile = (
    index: number,
  ) => {
    onSelectedFilesChange(
      selectedFiles.filter(
        (_, fileIndex) =>
          fileIndex !== index,
      ),
    );

    setSelectionError(null);
  };

  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        minWidth: 0,
        overflowX: "hidden",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        <Typography
          component="h3"
          sx={{
            color: "text.primary",
            fontWeight: 700,
            minWidth: 0,
          }}
        >
          Imágenes
        </Typography>

        <Chip
          label={`${totalImages}/${MAX_CATALOG_IMAGES}`}
          size="small"
          variant="outlined"
          color={
            totalImages > 0
              ? "primary"
              : "default"
          }
        />
      </Stack>

      {error || selectionError ? (
        <Alert severity="error">
          {error ?? selectionError}
        </Alert>
      ) : null}

      {totalImages === 0 ? (
        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            minHeight: {
              xs: 180,
              sm: 230,
            },
            display: "grid",
            placeItems: "center",
            px: 3,
            border: "1px dashed",
            borderColor: error
              ? "error.main"
              : "divider",
            borderRadius: 4,
            backgroundColor:
              "rgba(184, 148, 95, 0.08)",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <Stack
            spacing={1.5}
            sx={{
              alignItems: "center",
            }}
          >
            <AddPhotoAlternateOutlinedIcon
              sx={{
                color: "primary.main",
                fontSize: {
                  xs: 42,
                  sm: 50,
                },
              }}
            />

            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              Selecciona una o varias fotografías
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          {activeExistingImages.map(
            (image, index) => (
              <ImagePreview
                key={image.id}
                src={image.imageUrl}
                label={
                  index === 0
                    ? "Principal"
                    : "Actual"
                }
                disabled={disabled}
                onRemove={() =>
                  removeExistingImage(
                    image.id,
                  )
                }
              />
            ),
          )}

          {filePreviews.map(
            (preview, index) => (
              <ImagePreview
                key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                src={preview.url}
                label={
                  activeExistingImages.length ===
                    0 &&
                  index === 0
                    ? "Principal"
                    : "Nueva"
                }
                disabled={disabled}
                onRemove={() =>
                  removeSelectedFile(index)
                }
              />
            ),
          )}
        </Box>
      )}

      <Button
        component="label"
        variant="outlined"
        startIcon={
          <CloudUploadOutlinedIcon />
        }
        disabled={
          disabled ||
          totalImages >=
            MAX_CATALOG_IMAGES
        }
        sx={{
          width: "100%",
          minWidth: 0,
          minHeight: 44,
          px: {
            xs: 1.5,
            sm: 2,
          },
          whiteSpace: "normal",

          "& .MuiButton-startIcon": {
            flexShrink: 0,
          },
        }}
      >
        {totalImages === 0
          ? "Seleccionar imágenes"
          : "Agregar más imágenes"}

        <input
          hidden
          multiple
          type="file"
          accept={CATALOG_IMAGE_ACCEPT}
          disabled={disabled}
          onChange={handleFilesChange}
        />
      </Button>

      {removedImageIds.length > 0 ? (
        <Alert
          severity="warning"
          action={
            <Button
              type="button"
              size="small"
              startIcon={<UndoOutlinedIcon />}
              disabled={disabled}
              onClick={() =>
                onRemovedImageIdsChange([])
              }
            >
              Deshacer
            </Button>
          }
        >
          {removedImageIds.length === 1
            ? "Se eliminará 1 imagen."
            : `Se eliminarán ${removedImageIds.length} imágenes.`}
        </Alert>
      ) : null}

      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
        }}
      >
        Máximo {MAX_CATALOG_IMAGES} imágenes. Cada
        archivo puede pesar hasta 5 MB.
      </Typography>
    </Stack>
  );
}

function ImagePreview({
  src,
  label,
  disabled,
  onRemove,
}: {
  src: string;
  label: string;
  disabled: boolean;
  onRemove: () => void;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        minWidth: 0,
        aspectRatio: "1 / 1",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        backgroundColor:
          "rgba(184, 148, 95, 0.08)",
      }}
    >
      <Box
        component="img"
        src={src}
        alt=""
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "contain",
          p: 0.75,
        }}
      />

      <Chip
        label={label}
        size="small"
        sx={{
          position: "absolute",
          left: 8,
          bottom: 8,
          backgroundColor:
            "rgba(255, 253, 248, 0.92)",
        }}
      />

      <Tooltip title="Quitar imagen">
        <IconButton
          type="button"
          size="small"
          aria-label="Quitar imagen"
          disabled={disabled}
          onClick={onRemove}
          sx={{
            position: "absolute",
            top: 7,
            right: 7,
            color: "error.main",
            backgroundColor:
              "rgba(255, 253, 248, 0.94)",

            "&:hover": {
              backgroundColor:
                "background.paper",
            },
          }}
        >
          <CloseOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
