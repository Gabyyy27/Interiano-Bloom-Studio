import { Box } from "@mui/material";

interface ContainedImageProps {
  src: string;
  alt: string;
  loading?: "eager" | "lazy";
  aspectRatio?: string;
  imagePadding?: number;
}

export default function ContainedImage({
  src,
  alt,
  loading = "lazy",
  aspectRatio = "4 / 3",
  imagePadding = 1,
}: ContainedImageProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minWidth: 0,
        aspectRatio,
        overflow: "hidden",
        lineHeight: 0,
        backgroundColor: "rgba(184, 148, 95, 0.08)",
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        loading={loading}
        draggable={false}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          display: "block",
          boxSizing: "border-box",
          objectFit: "contain",
          objectPosition: "center",
          p: imagePadding,
        }}
      />
    </Box>
  );
}