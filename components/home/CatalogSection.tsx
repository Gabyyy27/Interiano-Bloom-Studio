"use client";

import { useState } from "react";

import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import SectionContainer from "@/components/common/SectionContainer";
import CatalogCard from "@/components/home/CatalogCard";
import CatalogDialog from "@/components/home/CatalogDialog";
import type {
  CatalogCategory,
  CatalogItem,
} from "@/types/catalog";

const ALL_CATEGORIES = "all";

interface CatalogSectionProps {
  categories: CatalogCategory[];
  items: CatalogItem[];
  hasError: boolean;
}

export default function CatalogSection({
  categories,
  items,
  hasError,
}: CatalogSectionProps) {
  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState(ALL_CATEGORIES);

  const [selectedItem, setSelectedItem] =
    useState<CatalogItem | null>(null);

  const visibleItems =
    selectedCategoryId === ALL_CATEGORIES
      ? items
      : items.filter(
          (item) =>
            item.categoryId === selectedCategoryId,
        );

  return (
    <>
      <SectionContainer
        id="catalogo"
        maxWidth={false}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1440,
            mx: "auto",
            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          <Stack spacing={{ xs: 3, md: 4 }}></Stack>
            {/* ENCABEZADO */}
            <Stack
            spacing={1.5}
            sx={{
             width: "100%",
             maxWidth: "none",
                mx: "auto",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                }}
          >
              <Typography
  variant="overline"
  sx={{
    display: "block",
    width: "100%",
    mx: "auto",
    color: "secondary.dark",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textAlign: "center",
  }}
>
  Nuestro catálogo
</Typography>

              <Typography
  component="h4"
  sx={{
    width: "100%",
    maxWidth: 1200,
    mx: "auto",
    color: "text.primary",
    fontFamily:
      "var(--font-display), Georgia, serif",
    fontSize: {
      xs: "2.45rem",
      sm: "3.25rem",
      md: "3.9rem",
      lg: "4.35rem",
    },
    fontWeight: 500,
    lineHeight: {
      xs: 1.03,
      md: 0.98,
    },
    textAlign: "center",
    textWrap: "balance",
  }}
>
  Encuentra el detalle perfecto para cada ocasión.
</Typography>

              <Typography
  sx={{
    width: "100%",
    maxWidth: 680,
    mx: "auto",
    color: "text.secondary",
    fontSize: {
      xs: "0.95rem",
      sm: "1.08rem",
    },
    lineHeight: 1.7,
    textAlign: "center",
    textWrap: "balance",
  }}
>
  Explora nuestras creaciones hechas con amor.
</Typography>

            {hasError ? (
              <Alert severity="error">
                No fue posible cargar el catálogo en este
                momento.
              </Alert>
            ) : null}

            {!hasError && items.length === 0 ? (
              <Box
                sx={{
                  py: 7,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 4,
                  textAlign: "center",
                }}
              >
                <CollectionsOutlinedIcon
                  sx={{
                    color: "primary.main",
                    fontSize: 48,
                  }}
                />

                <Typography
                  component="h3"
                  sx={{
                    mt: 1.5,
                    fontFamily:
                      "var(--font-display), Georgia, serif",
                    fontSize: "1.8rem",
                    fontWeight: 500,
                  }}
                >
                  Próximamente nuevas creaciones
                </Typography>
              </Box>
            ) : null}

            {!hasError && items.length > 0 ? (
              <>
                {/* FILTROS */}
                <Stack
                  component="nav"
                  aria-label="Filtrar catálogo por categoría"
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{
                    width: "100%",
                    mx: "auto",
                    px: {
                      xs: 0,
                      sm: 0,
                    },
                    pb: {
                      xs: 0.5,
                      sm: 0,
                    },
                    overflowX: {
                      xs: "auto",
                      sm: "visible",
                    },
                    flexWrap: {
                      xs: "nowrap",
                      sm: "wrap",
                    },
                    justifyContent: {
                      xs: "flex-start",
                      sm: "center",
                    },
                    scrollbarWidth: "thin",
                  }}
                >
                  <Button
                    type="button"
                    variant={
                      selectedCategoryId ===
                      ALL_CATEGORIES
                        ? "contained"
                        : "outlined"
                    }
                    color="primary"
                    onClick={() =>
                      setSelectedCategoryId(
                        ALL_CATEGORIES,
                      )
                    }
                    sx={{
                      flexShrink: 0,
                      minHeight: {
                        xs: 42,
                        sm: 46,
                      },
                      px: {
                        xs: 2,
                        sm: 2.75,
                      },
                      borderColor:
                        "rgba(107, 81, 56, 0.34)",
                      backgroundColor:
                        selectedCategoryId ===
                        ALL_CATEGORIES
                          ? "primary.main"
                          : "rgba(255, 253, 248, 0.72)",
                    }}
                  >
                    Todos
                  </Button>

                  {categories.map((category) => {
                    const isSelected =
                      selectedCategoryId ===
                      category.id;

                    return (
                      <Button
                        key={category.id}
                        type="button"
                        variant={
                          isSelected
                            ? "contained"
                            : "outlined"
                        }
                        color="primary"
                        onClick={() =>
                          setSelectedCategoryId(
                            category.id,
                          )
                        }
                        sx={{
                          flexShrink: 0,
                          minHeight: {
                            xs: 42,
                            sm: 46,
                          },
                          px: {
                            xs: 1,
                            sm: 2.75,
                            md: 4,
                          },
                          borderColor:
                            "rgba(107, 81, 56, 0.34)",
                          backgroundColor: isSelected
                            ? "primary.main"
                            : "rgba(255, 253, 248, 0.72)",
                        }}
                      >
                        {category.name}
                      </Button>
                    );
                  })}
                </Stack>

                {/* GRID */}
                {visibleItems.length > 0 ? (
                  <Box
                    sx={{
                      display: "grid",

                      gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        md: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(4, minmax(0, 1fr))",
                      },

                      gap: {
                        xs: 1,
                        sm: 1.5,
                        md: 2.5,
                        lg: 3 ,
                      },

                      width: "100%",
                    }}
                  >
                    {visibleItems.map((item) => (
                      <CatalogCard
                        key={item.id}
                        item={item}
                        onOpen={setSelectedItem}
                      />
                    ))}
                  </Box>
                ) : (
                  <Alert severity="info">
                    Esta categoría todavía no contiene
                    imágenes.
                  </Alert>
                )}
              </>
            ) : null}
          </Stack>
        </Box>
      </SectionContainer>

      <CatalogDialog
        open={selectedItem !== null}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}