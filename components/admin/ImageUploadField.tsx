"use client";

import {
  type ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import {
  Box,
  Button,
  Stack,
  styled,
  Typography,
} from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
});

interface ImageUploadFieldProps {
  error?: string;
  disabled?: boolean;
  initialImageUrl?: string;
  required?: boolean;
}

export default function ImageUploadField({
  error,
  disabled = false,
  initialImageUrl,
  required = true,
}: ImageUploadFieldProps) {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const objectUrl = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0] ?? null;

    setSelectedFile(file);
  };

  const previewUrl =
    objectUrl ?? initialImageUrl ?? null;

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: {
            xs: 260,
            sm: 320,
          },
          display: "grid",
          placeItems: "center",
          border: "1px dashed",
          borderColor: error
            ? "error.main"
            : "divider",
          borderRadius: 4,
          backgroundColor:
            "rgba(184, 148, 95, 0.08)",
        }}
      >
        {previewUrl ? (
          <Box
            component="img"
            src={previewUrl}
            alt="Vista previa de la imagen seleccionada"
            sx={{
              width: "100%",
              height: "100%",
              maxHeight: 420,
              display: "block",
              objectFit: "contain",
              p: 1,
            }}
          />
        ) : (
          <Stack
            spacing={1.5}
            sx={{
              alignItems: "center",
              px: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <AddPhotoAlternateOutlinedIcon
              sx={{
                fontSize: 52,
                color: "primary.main",
              }}
            />

            <Typography variant="body2">
              Selecciona una fotografía del ítem
            </Typography>
          </Stack>
        )}
      </Box>

      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUploadOutlinedIcon />}
        disabled={disabled}
      >
        {selectedFile
  ? "Cambiar selección"
  : initialImageUrl
    ? "Reemplazar imagen"
    : "Seleccionar imagen"}

        <VisuallyHiddenInput
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp"
          required={required}
          disabled={disabled}
          onChange={handleChange}
        />
      </Button>

      {selectedFile ? (
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            overflowWrap: "anywhere",
          }}
        >
          {selectedFile.name}
        </Typography>
      ) : null}

      {error ? (
        <Typography
          variant="caption"
          sx={{
            color: "error.main",
          }}
        >
          {error}
        </Typography>
      ) : null}

      <Typography
  variant="caption"
  sx={{
    color: "text.secondary",
  }}
>
  {initialImageUrl && !selectedFile
    ? "La imagen actual se conservará mientras no selecciones otra."
    : "Formatos permitidos: JPG, PNG y WebP. Tamaño máximo: 5 MB."}
</Typography>
    </Stack>
  );
}
