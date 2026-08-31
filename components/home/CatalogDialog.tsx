"use client";

import {
  type KeyboardEvent,
  type TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  GlobalStyles,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import ZoomableImage from "@/components/common/ZoomableImage";
import { getCatalogQuoteWhatsAppUrl } from "@/lib/business";
import type { CatalogItem } from "@/types/catalog";

interface CatalogDialogProps {
  open: boolean;
  item: CatalogItem | null;
  onClose: () => void;
}

interface ImageState {
  itemId: string | null;
  index: number;
}

interface SwipeStart {
  x: number;
  y: number;
}

const AUTOPLAY_DELAY_MS = 4800;
const INTERACTION_HOLD_MS = 900;
const SWIPE_THRESHOLD_PX = 48;
const REDUCED_MOTION_QUERY =
  "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(
  onStoreChange: () => void,
) {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return () => { };
  }

  const mediaQuery = window.matchMedia(
    REDUCED_MOTION_QUERY,
  );

  mediaQuery.addEventListener(
    "change",
    onStoreChange,
  );

  return () => {
    mediaQuery.removeEventListener(
      "change",
      onStoreChange,
    );
  };
}

function getReducedMotionSnapshot() {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }

  return window.matchMedia(
    REDUCED_MOTION_QUERY,
  ).matches;
}

export default function CatalogDialog({
  open,
  item,
  onClose,
}: CatalogDialogProps) {
  const interactionTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const swipeStartRef =
    useRef<SwipeStart | null>(null);

  const prefersReducedMotion =
    useSyncExternalStore(
      subscribeToReducedMotion,
      getReducedMotionSnapshot,
      () => false,
    );

  const [imageState, setImageState] =
    useState<ImageState>({
      itemId: null,
      index: 0,
    });

  const [autoPlayResetKey, setAutoPlayResetKey] =
    useState(0);

  const [
    isImageInteracting,
    setIsImageInteracting,
  ] = useState(false);

  const [isImageZoomed, setIsImageZoomed] =
    useState(false);

  const images = useMemo(
    () => item?.images ?? [],
    [item?.images],
  );

  const activeItemId =
    open && item ? item.id : null;

  const selectedImageIndex =
    activeItemId &&
      imageState.itemId === activeItemId &&
      images.length > 0
      ? Math.min(imageState.index, images.length - 1)
      : 0;

  const selectedImage =
    images[selectedImageIndex] ?? images[0];

  const quoteUrl = useMemo(() => {
    if (!item) {
      return "";
    }

    return getCatalogQuoteWhatsAppUrl({
      title: item.title,
      categoryName: item.categoryName,
    });
  }, [item]);

  const clearInteractionTimeout =
    useCallback(() => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = null;
      }
    }, []);

  const startImageInteraction =
    useCallback(() => {
      clearInteractionTimeout();
      setIsImageInteracting(true);
    }, [clearInteractionTimeout]);

  const holdImageInteraction =
    useCallback(() => {
      clearInteractionTimeout();
      setIsImageInteracting(true);

      interactionTimeoutRef.current = setTimeout(() => {
        setIsImageInteracting(false);
        interactionTimeoutRef.current = null;
      }, INTERACTION_HOLD_MS);
    }, [clearInteractionTimeout]);

  const endImageInteraction =
    useCallback(() => {
      holdImageInteraction();
    }, [holdImageInteraction]);

  const showImageAtIndex = useCallback(
    (nextIndex: number, isManual = true) => {
      if (!activeItemId || images.length <= 1) {
        return;
      }

      if (isManual) {
        setAutoPlayResetKey((current) => current + 1);
        holdImageInteraction();
      }

      setIsImageZoomed(false);

      setImageState({
        itemId: activeItemId,
        index:
          (nextIndex + images.length) % images.length,
      });
    },
    [
      activeItemId,
      holdImageInteraction,
      images.length,
    ],
  );

  const showPreviousImage = useCallback(() => {
    showImageAtIndex(selectedImageIndex - 1);
  }, [selectedImageIndex, showImageAtIndex]);

  const showNextImage = useCallback(() => {
    showImageAtIndex(selectedImageIndex + 1);
  }, [selectedImageIndex, showImageAtIndex]);

  const closeDialog = useCallback(() => {
    clearInteractionTimeout();
    swipeStartRef.current = null;
    setImageState({
      itemId: null,
      index: 0,
    });
    setIsImageInteracting(false);
    setIsImageZoomed(false);
    onClose();
  }, [clearInteractionTimeout, onClose]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (
        event.defaultPrevented ||
        images.length <= 1
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextImage();
      }
    },
    [
      images.length,
      showNextImage,
      showPreviousImage,
    ],
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (images.length <= 1 || isImageZoomed) {
        return;
      }

      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      swipeStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      startImageInteraction();
    },
    [
      images.length,
      isImageZoomed,
      startImageInteraction,
    ],
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const swipeStart = swipeStartRef.current;

      if (!swipeStart) {
        return;
      }

      swipeStartRef.current = null;

      const touch = event.changedTouches[0];

      if (!touch) {
        endImageInteraction();
        return;
      }

      const deltaX = touch.clientX - swipeStart.x;
      const deltaY = touch.clientY - swipeStart.y;
      const absoluteX = Math.abs(deltaX);
      const absoluteY = Math.abs(deltaY);

      if (
        absoluteX >= SWIPE_THRESHOLD_PX &&
        absoluteX > absoluteY * 1.15
      ) {
        if (deltaX < 0) {
          showNextImage();
        } else {
          showPreviousImage();
        }

        return;
      }

      endImageInteraction();
    },
    [
      endImageInteraction,
      showNextImage,
      showPreviousImage,
    ],
  );

  const handleTouchCancel = useCallback(() => {
    swipeStartRef.current = null;
    endImageInteraction();
  }, [endImageInteraction]);

  useEffect(() => {
    return () => {
      clearInteractionTimeout();
    };
  }, [clearInteractionTimeout]);

  useEffect(() => {
    if (
      !open ||
      !activeItemId ||
      images.length <= 1 ||
      prefersReducedMotion ||
      isImageInteracting ||
      isImageZoomed
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setImageState((current) => {
        const currentIndex =
          current.itemId === activeItemId
            ? current.index
            : selectedImageIndex;

        return {
          itemId: activeItemId,
          index:
            (currentIndex + 1) % images.length,
        };
      });
    }, AUTOPLAY_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [
    activeItemId,
    autoPlayResetKey,
    images.length,
    isImageInteracting,
    isImageZoomed,
    open,
    prefersReducedMotion,
    selectedImageIndex,
  ]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !open ||
      images.length <= 1
    ) {
      return;
    }

    const adjacentImages = new Set<string>();
    const previousIndex =
      (selectedImageIndex - 1 + images.length) %
      images.length;
    const nextIndex =
      (selectedImageIndex + 1) % images.length;

    adjacentImages.add(
      images[previousIndex]?.imageUrl ?? "",
    );
    adjacentImages.add(
      images[nextIndex]?.imageUrl ?? "",
    );

    adjacentImages.forEach((imageUrl) => {
      if (!imageUrl) {
        return;
      }

      const image = new window.Image();
      image.src = imageUrl;
    });
  }, [images, open, selectedImageIndex]);

  if (!item || !selectedImage) {
    return null;
  }

  return (
    <>
      <GlobalStyles
        styles={{
          ".floating-whatsapp-button": {
            display: open
              ? "none !important"
              : undefined,
          },
        }}
      />
      <Dialog
        open={open}
        onClose={closeDialog}
        onKeyDown={handleKeyDown}
        maxWidth={false}
        aria-labelledby="catalog-dialog-title"
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "calc(100% - 24px)",
                lg: "min(1180px, calc(100% - 64px))",
              },

              maxWidth: 1180,
              maxHeight: {
                xs: "calc(100dvh - 32px)",
                lg: "calc(100dvh - 64px)",
              },
              m: {
                xs: 1.5,
                lg: 4,
              },
              overflow: "hidden",
              border: "1px solid",
              borderColor: "rgba(107, 81, 56, 0.18)",
              borderRadius: {
                xs: 4,
                lg: 4,
              },
              backgroundColor: "#FBF7F0",
              boxShadow:
                "0 34px 90px rgba(43, 33, 24, 0.24)",
            },
          },
        }}
      >
        <IconButton
          type="button"
          aria-label="Cerrar"
          onClick={closeDialog}
          sx={{
            position: "absolute",
            top: {
              xs: 12,
              sm: 16,
              lg: 22,
            },
            right: {
              xs: 12,
              sm: 16,
              lg: 22,
            },
            zIndex: 20,

            width: {
              xs: 44,
              sm: 48,
            },

            height: {
              xs: 44,
              sm: 48,
            },

            border: "1px solid",
            borderColor: "divider",

            borderRadius: "50%",

            color: "primary.dark",

            backgroundColor:
              "rgba(255, 253, 248, 0.96)",

            backdropFilter: "blur(8px)",

            boxShadow:
              "0 6px 18px rgba(43, 33, 24, 0.10)",

            "&:hover": {
              backgroundColor: "background.paper",
            },
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>

        <DialogContent
          sx={{
            p: 0,
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 1.55fr) minmax(340px, 0.85fr)",
              },
              minWidth: 0,
            }}
          >
            <Box
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchCancel}
              sx={{
                position: "relative",
                minWidth: 0,
                minHeight: {
                  xs: 360,
                  sm: 480,
                  md: 560,
                  lg: 0,
                },

                height: {
                  lg: 620,
                },
                overflow: "hidden",
                backgroundColor: "#EFE4D4",
                touchAction: isImageZoomed
                  ? "none"
                  : "pan-y",
              }}
            >
              <ZoomableImage
                key={selectedImage.id}
                src={selectedImage.imageUrl}
                alt={`${item.title}, imagen ${selectedImageIndex + 1
                  }`}
                onInteractionStart={
                  startImageInteraction
                }
                onInteractionEnd={endImageInteraction}
                onZoomChange={(zoom) => {
                  setIsImageZoomed(zoom > 1);
                }}
              />

              {images.length > 1 ? (
                <>
                  <Tooltip title="Imagen anterior">
                    <IconButton
                      type="button"
                      aria-label="Mostrar imagen anterior"
                      onPointerDown={(event) => {
                        event.stopPropagation();
                      }}
                      onTouchStart={(event) => {
                        event.stopPropagation();
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        showPreviousImage();
                      }}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: {
                          xs: 10,
                          sm: 18,
                        },
                        zIndex: 4,
                        width: {
                          xs: 44,
                          sm: 50,
                          lg: 52,
                        },
                        height: {
                          xs: 44,
                          sm: 50,
                          lg: 52,
                        },
                        color: {
                          xs: "common.white",
                          lg: "primary.dark",
                        },
                        backgroundColor: {
                          xs: "rgba(43, 33, 24, 0.58)",
                          lg: "rgba(255, 253, 248, 0.74)",
                        },
                        backdropFilter: "blur(10px)",
                        transform: "translateY(-50%)",

                        "&:hover": {
                          backgroundColor: {
                            xs: "rgba(73, 53, 36, 0.82)",
                            lg: "rgba(255, 253, 248, 0.92)",
                          },
                        },
                      }}
                    >
                      <ArrowBackIosNewOutlinedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Imagen siguiente">
                    <IconButton
                      type="button"
                      aria-label="Mostrar imagen siguiente"
                      onPointerDown={(event) => {
                        event.stopPropagation();
                      }}
                      onTouchStart={(event) => {
                        event.stopPropagation();
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        showNextImage();
                      }}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: {
                          xs: 10,
                          sm: 18,
                        },
                        zIndex: 4,
                        width: {
                          xs: 44,
                          sm: 50,
                          lg: 52,
                        },
                        height: {
                          xs: 44,
                          sm: 50,
                          lg: 52,
                        },
                        color: {
                          xs: "common.white",
                          lg: "primary.dark",
                        },
                        backgroundColor: {
                          xs: "rgba(43, 33, 24, 0.58)",
                          lg: "rgba(255, 253, 248, 0.74)",
                        },
                        backdropFilter: "blur(10px)",
                        transform: "translateY(-50%)",

                        "&:hover": {
                          backgroundColor: {
                            xs: "rgba(73, 53, 36, 0.82)",
                            lg: "rgba(255, 253, 248, 0.92)",
                          },
                        },
                      }}
                    >
                      <ArrowForwardIosOutlinedIcon />
                    </IconButton>
                  </Tooltip>

                  <Stack
                    component="nav"
                    aria-label="Imagenes del producto"
                    direction="row"
                    spacing={0.5}
                    sx={{
                      position: "absolute",
                      left: "50%",
                      bottom: {
                        xs: 14,
                        sm: 18,
                      },
                      zIndex: 4,
                      transform: "translateX(-50%)",
                      px: 1,
                      py: 0.5,
                      borderRadius: 999,
                      backgroundColor:
                        "rgba(43, 33, 24, 0.42)",
                      boxShadow: {
                        lg: "0 10px 28px rgba(43, 33, 24, 0.16)",
                      },
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {images.map((image, index) => {
                      const isSelected =
                        index === selectedImageIndex;

                      return (
                        <Box
                          key={image.id}
                          component="button"
                          type="button"
                          aria-label={`Mostrar imagen ${index + 1
                            }`}
                          aria-current={
                            isSelected
                              ? "true"
                              : undefined
                          }
                          onPointerDown={(event) => {
                            event.stopPropagation();
                          }}
                          onTouchStart={(event) => {
                            event.stopPropagation();
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            showImageAtIndex(index);
                          }}
                          sx={{
                            width: 30,
                            height: 30,
                            display: "grid",
                            placeItems: "center",
                            p: 0,
                            border: 0,
                            borderRadius: 999,
                            cursor: "pointer",
                            backgroundColor:
                              "transparent",

                            "&:focus-visible": {
                              outline:
                                "2px solid #FFFDF8",
                              outlineOffset: 1,
                            },
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: isSelected
                                ? 17
                                : 7,
                              height: 7,
                              borderRadius: 999,
                              backgroundColor: isSelected
                                ? "secondary.light"
                                : "rgba(255, 253, 248, 0.72)",
                              transition:
                                "width 180ms ease, background-color 180ms ease",
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </>
              ) : null}
            </Box>

            <Box
              sx={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: {
                  xs: "flex-start",
                  lg: "center",
                },
                p: {
                  xs: 3,
                  sm: 4,
                  md: 5,
                  lg: 5,
                },
                px: {
                  lg: 5.5,
                },
                py: {
                  lg: 5,
                },
                borderLeft: {
                  lg: "1px solid",
                },
                borderColor: {
                  lg: "divider",
                },
                background: `
                  radial-gradient(
                    circle at top right,
                    rgba(216, 189, 139, 0.20),
                    transparent 34%
                  ),
                  linear-gradient(
                    145deg,
                    #FBF7F0 0%,
                    #F8F0E4 100%
                  )
                `,
              }}
            >
              <Stack
                sx={{
                  width: "100%",
                  maxWidth: {
                    lg: 460,
                  },
                  mx: {
                    lg: "auto",
                  },
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  component="p"
                  sx={{
                    mb: 1.5,
                    color: "secondary.dark",
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                    lineHeight: 1.35,
                    textTransform: "uppercase",
                  }}
                >
                  {item.categoryName}
                </Typography>

                <Box
                  aria-hidden="true"
                  sx={{
                    display: {
                      xs: "none",
                      lg: "block",
                    },
                    width: 42,
                    height: 2,
                    mb: 4,
                    borderRadius: 999,
                    backgroundColor: "secondary.main",
                  }}
                />

                <Typography
                  id="catalog-dialog-title"
                  component="h2"
                  sx={{
                    maxWidth: 420,
                    width: "100%",
                    color: "text.primary",
                    fontFamily:
                      "var(--font-display), Georgia, serif",
                    fontSize: {
                      xs: "2.45rem",
                      sm: "3rem",
                      md: "3.55rem",
                      lg: "clamp(3rem, 4vw, 5rem)",
                    },
                    fontWeight: 500,
                    lineHeight: {
                      xs: 1.02,
                      lg: 0.98,
                    },
                    overflowWrap: "anywhere",
                  }}
                >
                  {item.title}
                </Typography>
                <Button
                  component="a"
                  href={quoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  sx={{
                    mt: {
                      xs: 3,
                      md: 3.5,
                    },
                    width: "fit-content",
                    maxWidth: "100%",
                    minHeight: 54,
                    px: 3.25,
                    color: "primary.contrastText",
                    backgroundColor: "primary.main",
                    boxShadow:
                      "0 14px 30px rgba(73, 53, 36, 0.2)",
                    whiteSpace: "normal",

                    "&:hover": {
                      backgroundColor: "primary.dark",
                      boxShadow:
                        "0 18px 36px rgba(73, 53, 36, 0.26)",
                    },
                  }}
                >
                  Cotizar aquí
                </Button>
              </Stack>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
