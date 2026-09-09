"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SectionContainer from "@/components/common/SectionContainer";
import CatalogCard from "@/components/home/CatalogCard";
import CatalogDialog from "@/components/home/CatalogDialog";
import type {
  CatalogCategory,
  CatalogItem,
} from "@/types/catalog";

const ALL_CATEGORIES = "all";
const ITEMS_PER_PAGE = 10;

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

  const [currentPage, setCurrentPage] =
    useState(1);

  const categoryScrollRef =
    useRef<HTMLDivElement | null>(null);

  const catalogGridRef =
    useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] =
    useState(false);

  const [canScrollRight, setCanScrollRight] =
    useState(false);

  const visibleItems =
    selectedCategoryId === ALL_CATEGORIES
      ? items
      : items.filter(
        (item) =>
          item.categoryId === selectedCategoryId,
      );

  const totalPages = Math.ceil(
    visibleItems.length / ITEMS_PER_PAGE,
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedItems = visibleItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleCategoryChange = (
    categoryId: string,
  ) => {
    setSelectedCategoryId(categoryId);

    // Cuando cambia el filtro siempre regresamos
    // a la primera página.
    setCurrentPage(1);
  };
  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }

      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const updateCategoryScrollState =
    useCallback(() => {
      const element =
        categoryScrollRef.current;

      if (!element) {
        return;
      }

      const tolerance = 4;

      const maxScrollLeft =
        element.scrollWidth -
        element.clientWidth;

      setCanScrollLeft(
        element.scrollLeft > tolerance,
      );

      setCanScrollRight(
        maxScrollLeft -
        element.scrollLeft >
        tolerance,
      );
    }, []);
  useEffect(() => {
    const element =
      categoryScrollRef.current;

    if (!element) {
      return;
    }

    const animationFrame =
      requestAnimationFrame(
        updateCategoryScrollState,
      );

    element.addEventListener(
      "scroll",
      updateCategoryScrollState,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      updateCategoryScrollState,
    );

    const resizeObserver =
      new ResizeObserver(
        updateCategoryScrollState,
      );

    resizeObserver.observe(element);

    return () => {
      cancelAnimationFrame(
        animationFrame,
      );

      element.removeEventListener(
        "scroll",
        updateCategoryScrollState,
      );

      window.removeEventListener(
        "resize",
        updateCategoryScrollState,
      );

      resizeObserver.disconnect();
    };
  }, [
    categories.length,
    updateCategoryScrollState,
  ]);

  const scrollCategories = (
    direction: "left" | "right",
  ) => {
    const element =
      categoryScrollRef.current;

    if (!element) {
      return;
    }

    const amount = Math.max(
      220,
      element.clientWidth * 0.7,
    );

    element.scrollBy({
      left:
        direction === "right"
          ? amount
          : -amount,

      behavior: "smooth",
    });
  };
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
              component="h1"
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
                fontWeight: 100,
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
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 1050,
                    mx: "auto",
                  }}
                >
                  {/* CONTENEDOR DESLIZABLE */}
                  <Stack
                    ref={categoryScrollRef}
                    component="nav"
                    aria-label="Filtrar catálogo por categoría"
                    direction="row"
                    spacing={1}
                    sx={{
                      width: "100%",

                      overflowX: "auto",
                      overflowY: "hidden",

                      py: 0.75,

                      scrollBehavior: "smooth",
                      scrollSnapType: "x proximity",

                      overscrollBehaviorX: "contain",

                      WebkitOverflowScrolling: "touch",

                      // Scroll funcional pero invisible.
                      scrollbarWidth: "none",

                      "&::-webkit-scrollbar": {
                        display: "none",
                      },

                      "& > *": {
                        scrollSnapAlign: "start",
                      },
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
                        handleCategoryChange(
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

                        borderRadius: 999,

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
                            handleCategoryChange(
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
                              xs: 2,
                              sm: 2.75,
                            },

                            borderRadius: 999,

                            whiteSpace: "nowrap",

                            borderColor:
                              "rgba(107, 81, 56, 0.34)",

                            backgroundColor:
                              isSelected
                                ? "primary.main"
                                : "rgba(255, 253, 248, 0.72)",
                          }}
                        >
                          {category.name}
                        </Button>
                      );
                    })}
                  </Stack>

                  {/* FLECHA IZQUIERDA */}
                  {canScrollLeft ? (
                    <Box
                      sx={{
                        position: "absolute",

                        left: 0,
                        top: 0,
                        bottom: 0,

                        zIndex: 4,

                        width: {
                          xs: 58,
                          sm: 70,
                        },

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",

                        pointerEvents: "none",

                        background: `
                        linear-gradient(
                        90deg,
                        #F7F1E7 28%,
                        rgba(247, 241, 231, 0.82) 55%,
                        rgba(247, 241, 231, 0) 100%
                        )
                        `,

                        backdropFilter: "blur(1px)",
                      }}
                    >
                      <IconButton
                        type="button"
                        aria-label="Ver categorías anteriores"
                        onClick={() =>
                          scrollCategories("left")
                        }
                        sx={{
                          pointerEvents: "auto",

                          width: 42,
                          height: 42,

                          ml: 0.25,

                          color: "primary.contrastText",

                          backgroundColor:
                            "primary.main",

                          boxShadow:
                            "0 6px 18px rgba(43, 33, 24, 0.22)",

                          "&:hover": {
                            backgroundColor:
                              "primary.dark",
                          },
                        }}
                      >
                        <ChevronLeftRoundedIcon />
                      </IconButton>
                    </Box>
                  ) : null}

                  {/* FLECHA DERECHA */}
                  {canScrollRight ? (
                    <Box
                      sx={{
                        position: "absolute",

                        right: 0,
                        top: 0,
                        bottom: 0,

                        zIndex: 4,

                        width: {
                          xs: 58,
                          sm: 70,
                        },

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",

                        pointerEvents: "none",

                        background: `
                        linear-gradient(
                        270deg,
                        #F7F1E7 28%,
                       rgba(247, 241, 231, 0.82) 55%,
                        rgba(247, 241, 231, 0) 100%
                        )
                        `,

                        backdropFilter: "blur(1px)",
                      }}
                    >
                      <IconButton
                        type="button"
                        aria-label="Ver más categorías"
                        onClick={() =>
                          scrollCategories("right")
                        }
                        sx={{
                          pointerEvents: "auto",

                          width: 42,
                          height: 42,

                          mr: 0.25,

                          color: "primary.contrastText",

                          backgroundColor:
                            "primary.main",

                          boxShadow:
                            "0 6px 18px rgba(43, 33, 24, 0.22)",

                          "&:hover": {
                            backgroundColor:
                              "primary.dark",
                          },
                        }}
                      >
                        <ChevronRightRoundedIcon />
                      </IconButton>
                    </Box>
                  ) : null}
                </Box>

                {/* GRID */}
                {paginatedItems.length > 0 ? (
                  <Box
                    ref={catalogGridRef}
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
                        lg: 3,
                      },

                      width: "100%",
                      scrollMarginTop: {
                        xs: 100,
                        md: 120,
                      },
                    }}
                  >
                    {paginatedItems.map((item) => (
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
        {totalPages > 1 ? (
          <Stack
            sx={{
              mt: {
                xs: 3,
                md: 4,
              },

              width: "100%",

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}

              color="primary"

              siblingCount={1}
              boundaryCount={1}

              showFirstButton={false}
              showLastButton={false}

              onChange={(_, nextPage) => {
                setCurrentPage(nextPage);

                requestAnimationFrame(() => {
                  catalogGridRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                });
              }}

              sx={{
                "& .MuiPagination-ul": {
                  justifyContent: "center",
                },

                "& .MuiPaginationItem-root": {
                  minWidth: {
                    xs: 34,
                    sm: 38,
                  },

                  height: {
                    xs: 34,
                    sm: 38,
                  },

                  borderRadius: "50%",

                  color: "primary.dark",

                  fontWeight: 600,
                },

                "& .Mui-selected": {
                  color:
                    "primary.contrastText",

                  backgroundColor:
                    "primary.main !important",
                },
              }}
            />
          </Stack>
        ) : null}
      </SectionContainer>

      <CatalogDialog
        open={selectedItem !== null}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}