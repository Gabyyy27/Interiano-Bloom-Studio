"use client";

import {
  type FormEvent,
  useCallback,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  createCatalogItemAction,
  deleteCatalogItemAction,
  updateCatalogItemAction,
} from "@/app/admin/catalogo/actions";
import MultiImageUploadField from "@/components/admin/MultiImageUploadField";
import ContainedImage from "@/components/common/ContainedImage";
import {
  removeCatalogImages,
  uploadCatalogImages,
} from "@/lib/catalog/catalogImageClient";
import {
  MAX_CATALOG_IMAGES,
} from "@/lib/catalog/imageRules";
import type {
  AdminCatalogItem,
  AdminCategoryOption,
  CatalogActionState,
} from "@/types/admin";

type CatalogFormDialogState =
  | {
    mode: "create";
    item: null;
  }
  | {
    mode: "edit";
    item: AdminCatalogItem;
  };

interface CatalogManagerProps {
  categories: AdminCategoryOption[];
  catalogItems: AdminCatalogItem[];
  hasError: boolean;
}

const initialActionState: CatalogActionState = {
  status: "idle",
  message: null,
};

function CatalogItemFormDialog({
  dialogState,
  categories,
  onClose,
  onSuccess,
}: {
  dialogState: CatalogFormDialogState;
  categories: AdminCategoryOption[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}) {
  const isEditing =
    dialogState.mode === "edit";

  const item = dialogState.item;

  const [title, setTitle] = useState(
    item?.title ?? "",
  );

  const [categoryId, setCategoryId] =
    useState(item?.categoryId ?? "");

  const [selectedFiles, setSelectedFiles] =
    useState<File[]>([]);

  const [
    removedImageIds,
    setRemovedImageIds,
  ] = useState<string[]>([]);

  const [actionState, setActionState] =
    useState<CatalogActionState>(
      initialActionState,
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const existingImages =
    item?.images ?? [];

  const activeImageCount =
    existingImages.length -
    removedImageIds.length +
    selectedFiles.length;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizedTitle = title
      .trim()
      .replace(/\s+/g, " ");

    const fieldErrors: NonNullable<
      CatalogActionState["fieldErrors"]
    > = {};

    if (
      normalizedTitle.length < 2 ||
      normalizedTitle.length > 120
    ) {
      fieldErrors.title =
        "El título debe contener entre 2 y 120 caracteres.";
    }

    if (!categoryId) {
      fieldErrors.categoryId =
        "Selecciona una categoría.";
    }

    if (
      activeImageCount < 1 ||
      activeImageCount >
      MAX_CATALOG_IMAGES
    ) {
      fieldErrors.images =
        `El ítem debe tener entre 1 y ${MAX_CATALOG_IMAGES} imágenes.`;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setActionState({
        status: "error",
        message:
          "Revisa los campos del formulario.",
        fieldErrors,
      });

      return;
    }

    setIsSubmitting(true);
    setActionState(initialActionState);

    let uploadedPaths: string[] = [];

    try {
      uploadedPaths =
        await uploadCatalogImages(
          selectedFiles,
        );

      const result = isEditing && item
        ? await updateCatalogItemAction({
          id: item.id,
          title: normalizedTitle,
          categoryId,
          newImagePaths:
            uploadedPaths,
          removedImageIds,
        })
        : await createCatalogItemAction({
          title: normalizedTitle,
          categoryId,
          imagePaths: uploadedPaths,
        });

      if (result.status === "error") {
        await removeCatalogImages(
          uploadedPaths,
        );

        setActionState(result);
        return;
      }

      onSuccess(
        result.message ??
        (isEditing
          ? "Ítem actualizado correctamente."
          : "Ítem agregado correctamente."),
      );
    } catch (error) {
      console.error(
        "Error al guardar el ítem:",
        error,
      );

      await removeCatalogImages(
        uploadedPaths,
      );

      setActionState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "No fue posible guardar el ítem.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      scroll="paper"
      onClose={
        isSubmitting
          ? () => undefined
          : onClose
      }
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "calc(100% - 24px)",
              sm: "calc(100% - 48px)",
              md: "min(960px, calc(100% - 64px))",
            },
            maxWidth: 960,
            maxHeight: {
              xs: "calc(100dvh - 16px)",
              sm: "calc(100dvh - 48px)",
            },
            m: {
              xs: 1.5,
              sm: 3,
            },
            borderRadius: {
              xs: 3,
              sm: 4,
            },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor:
              "background.paper",
          },
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          minWidth: 0,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <DialogTitle
          sx={{
            fontFamily:
              "var(--font-display), Georgia, serif",
            fontSize: {
              xs: "1.9rem",
              sm: "2.25rem",
            },
            fontWeight: 500,
            lineHeight: 1.08,
            px: {
              xs: 2.5,
              sm: 3.5,
            },
            py: {
              xs: 2,
              sm: 2.5,
            },
            flexShrink: 0,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {isEditing
            ? "Editar ítem"
            : "Agregar ítem"}
        </DialogTitle>

        <DialogContent
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },

            pt: {
              xs: "28px !important",
              sm: "35px !important",
            },

            pb: {
              xs: 2,
              sm: 3,
            },

            flex: "1 1 auto",
            minHeight: 0,

            overflowX: "hidden",
            overflowY: "auto",

            WebkitOverflowScrolling: "touch",

            scrollbarWidth: "none",
            msOverflowStyle: "none",

            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Stack
            spacing={3}
            sx={{
              minWidth: 0,
            }}
          >
            {actionState.status ===
              "error" ? (
              <Alert severity="error">
                {actionState.message}
              </Alert>
            ) : null}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  lg: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
                },

                gap: {
                  xs: 3,
                  lg: 4,
                },

                alignItems: "start",
                width: "100%",
                minWidth: 0,
              }}
            >
              <MultiImageUploadField
                existingImages={
                  existingImages
                }
                selectedFiles={
                  selectedFiles
                }
                removedImageIds={
                  removedImageIds
                }
                error={
                  actionState.fieldErrors
                    ?.images
                }
                disabled={isSubmitting}
                onSelectedFilesChange={
                  setSelectedFiles
                }
                onRemovedImageIdsChange={
                  setRemovedImageIds
                }
              />

              <Stack
                spacing={2.5}
                sx={{
                  width: "100%",
                  minWidth: 0,
                }}
              >
                <TextField
                  id="catalog-category"
                  label="Categoría"
                  value={categoryId}
                  select
                  required
                  fullWidth
                  disabled={isSubmitting}
                  error={Boolean(
                    actionState.fieldErrors
                      ?.categoryId,
                  )}
                  helperText={
                    actionState.fieldErrors
                      ?.categoryId ??
                    "Selecciona la categoría del ítem."
                  }
                  onChange={(event) =>
                    setCategoryId(
                      event.target.value,
                    )
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Selecciona una categoría
                  </MenuItem>

                  {categories.map(
                    (category) => (
                      <MenuItem
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </MenuItem>
                    ),
                  )}
                </TextField>

                <TextField
                  id="catalog-title"
                  label="Título"
                  value={title}
                  placeholder="Ejemplo: Decoración de cumpleaños"
                  required
                  fullWidth
                  disabled={isSubmitting}
                  error={Boolean(
                    actionState.fieldErrors
                      ?.title,
                  )}
                  helperText={
                    actionState.fieldErrors
                      ?.title ??
                    "Este título aparecerá junto a las imágenes."
                  }
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                    htmlInput: {
                      maxLength: 120,
                    },
                  }}
                />

                <Alert
                  severity="info"
                  sx={{
                    alignItems: "flex-start",
                    py: {
                      xs: 0.75,
                      sm: 1,
                    },
                    fontSize: {
                      xs: "0.875rem",
                      sm: "0.95rem",
                    },
                    lineHeight: 1.6,

                    "& .MuiAlert-icon": {
                      mt: 0.25,
                    },
                  }}
                >
                  La primera fotografía será la
                  imagen principal del ítem.
                </Alert>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "flex-end",
            gap: 1,
            flexWrap: "nowrap",
            px: {
              xs: 2,
              sm: 3,
            },
            py: {
              xs: 1.5,
              sm: 2,
            },
            borderTop: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
            backgroundColor: "background.paper",
            pb: {
              xs: "max(12px, env(safe-area-inset-bottom))",
              sm: 2,
            },
          }}
        >
          <Button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{
              minHeight: 44,
              whiteSpace: "nowrap",
            }}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              minHeight: 44,
              whiteSpace: "nowrap",
            }}
          >
            {isSubmitting
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Agregar ítem"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function DeleteCatalogItemDialog({
  item,
  onClose,
  onSuccess,
}: {
  item: AdminCatalogItem;
  onClose: () => void;
  onSuccess: (message: string) => void;
}) {
  const [state, setState] =
    useState<CatalogActionState>(
      initialActionState,
    );

  const [isPending, setIsPending] =
    useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    setState(initialActionState);

    try {
      const result =
        await deleteCatalogItemAction(
          item.id,
        );

      if (result.status === "error") {
        setState(result);
        return;
      }

      onSuccess(
        result.message ??
        "Ítem eliminado correctamente.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="xs"
      scroll="paper"
      onClose={
        isPending
          ? () => undefined
          : onClose
      }
      slotProps={{
        paper: {
          sx: {
            mx: 2,
            maxHeight: "calc(100dvh - 24px)",
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily:
            "var(--font-display), Georgia, serif",
          fontSize: "2rem",
          fontWeight: 500,
        }}
      >
        Eliminar ítem
      </DialogTitle>

      <DialogContent
        sx={{
          minHeight: 0,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Stack spacing={2}>
          {state.status === "error" ? (
            <Alert severity="error">
              {state.message}
            </Alert>
          ) : null}

          <Typography>
            ¿Confirmas que deseas eliminar{" "}
            <Box
              component="strong"
              sx={{
                color: "primary.dark",
              }}
            >
              {item.title}
            </Box>
            ?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            Se eliminarán sus{" "}
            {item.images.length === 1
              ? "imagen"
              : `${item.images.length} imágenes`}
            .
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          flexShrink: 0,
          px: 3,
          pb: {
            xs: "max(16px, env(safe-area-inset-bottom))",
            sm: 3,
          },
        }}
      >
        <Button
          type="button"
          onClick={onClose}
          disabled={isPending}
        >
          Cancelar
        </Button>

        <Button
          type="button"
          variant="contained"
          color="error"
          disabled={isPending}
          onClick={handleDelete}
        >
          {isPending
            ? "Eliminando..."
            : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function CatalogItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: AdminCatalogItem;
  onEdit: (
    item: AdminCatalogItem,
  ) => void;
  onDelete: (
    item: AdminCatalogItem,
  ) => void;
}) {
  const primaryImage = item.images[0];

  return (
    <Paper
      component="article"
      elevation={0}
      sx={{
        minWidth: 0,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
        backgroundColor: "background.paper",
      }}
    >
      {primaryImage ? (
        <ContainedImage
          src={primaryImage.imageUrl}
          alt={item.title}
        />
      ) : (
        <Box
          sx={{
            aspectRatio: "4 / 3",
            display: "grid",
            placeItems: "center",
            color: "text.secondary",
            backgroundColor:
              "rgba(184, 148, 95, 0.08)",
          }}
        >
          Sin imágenes
        </Box>
      )}

      {item.images.length > 1 ? (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            px: 2,
            pt: 1.5,
            overflowX: "auto",
          }}
        >
          {item.images
            .slice(1)
            .map((image) => (
              <Box
                key={image.id}
                component="img"
                src={image.imageUrl}
                alt=""
                sx={{
                  width: 58,
                  height: 58,
                  flexShrink: 0,
                  display: "block",
                  objectFit: "contain",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  backgroundColor:
                    "rgba(184, 148, 95, 0.08)",
                }}
              />
            ))}
        </Stack>
      ) : null}

      <Stack
        spacing={1.5}
        sx={{
          p: 2.5,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={item.categoryName}
              size="small"
              variant="outlined"
              color="primary"
            />

            <Chip
              label={`${item.images.length} ${item.images.length === 1
                ? "imagen"
                : "imágenes"
                }`}
              size="small"
            />
          </Stack>

          <Stack
            direction="row"
            spacing={0.5}
          >
            <Tooltip title="Editar ítem">
              <IconButton
                type="button"
                color="primary"
                aria-label={`Editar ${item.title}`}
                onClick={() =>
                  onEdit(item)
                }
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar ítem">
              <IconButton
                type="button"
                color="error"
                aria-label={`Eliminar ${item.title}`}
                onClick={() =>
                  onDelete(item)
                }
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Typography
          component="h2"
          sx={{
            color: "text.primary",
            fontFamily:
              "var(--font-display), Georgia, serif",
            fontSize: "1.6rem",
            fontWeight: 500,
            lineHeight: 1.2,
            overflowWrap: "anywhere",
          }}
        >
          {item.title}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default function CatalogManager({
  categories,
  catalogItems,
  hasError,
}: CatalogManagerProps) {
  const router = useRouter();
  const headingRef =
    useRef<HTMLHeadingElement | null>(null);

  const [formDialog, setFormDialog] =
    useState<CatalogFormDialogState | null>(
      null,
    );

  const [itemToDelete, setItemToDelete] =
    useState<AdminCatalogItem | null>(null);

  const [notification, setNotification] =
    useState<string | null>(null);

  const focusSectionHeading = useCallback(() => {
    requestAnimationFrame(() => {
      headingRef.current?.focus({
        preventScroll: true,
      });
    });
  }, []);

  const handleSuccess = useCallback(
    (message: string) => {
      setFormDialog(null);
      setItemToDelete(null);
      setNotification(message);
      focusSectionHeading();
      router.refresh();
    },
    [focusSectionHeading, router],
  );

  const canCreate =
    !hasError && categories.length > 0;

  return (
    <>
      <Stack spacing={4}>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              ref={headingRef}
              tabIndex={-1}
              component="h1"
              sx={{
                fontFamily:
                  "var(--font-display), Georgia, serif",
                fontSize: {
                  xs: "2.2rem",
                  md: "2.8rem",
                },
                fontWeight: 500,

                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Catálogo
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              Administra las imágenes que aparecen en el
              sitio público.
            </Typography>
          </Box>

          <Button
            type="button"
            variant="contained"
            startIcon={
              <AddPhotoAlternateOutlinedIcon />
            }
            disabled={!canCreate}
            onClick={() =>
              setFormDialog({
                mode: "create",
                item: null,
              })
            }
            sx={{
              alignSelf: {
                xs: "flex-start",
                sm: "auto",
              },
            }}
          >
            Agregar ítem
          </Button>
        </Stack>

        {hasError ? (
          <Alert severity="error">
            No fue posible cargar el catálogo.
          </Alert>
        ) : null}

        {!hasError &&
          catalogItems.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2.5,
            }}
          >
            {catalogItems.map((item) => (
              <CatalogItemCard
                key={item.id}
                item={item}
                onEdit={(selectedItem) =>
                  setFormDialog({
                    mode: "edit",
                    item: selectedItem,
                  })
                }
                onDelete={setItemToDelete}
              />
            ))}
          </Box>
        ) : null}
      </Stack>

      {formDialog ? (
        <CatalogItemFormDialog
          key={
            formDialog.mode === "create"
              ? "create-item"
              : `edit-${formDialog.item.id}`
          }
          dialogState={formDialog}
          categories={categories}
          onClose={() =>
            setFormDialog(null)
          }
          onSuccess={handleSuccess}
        />
      ) : null}

      {itemToDelete ? (
        <DeleteCatalogItemDialog
          key={itemToDelete.id}
          item={itemToDelete}
          onClose={() =>
            setItemToDelete(null)
          }
          onSuccess={handleSuccess}
        />
      ) : null}

      <Snackbar
        open={notification !== null}
        autoHideDuration={4000}
        onClose={() =>
          setNotification(null)
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          top: {
            xs: "calc(env(safe-area-inset-top) + 12px) !important",
            sm: "24px !important",
          },
          right: {
            xs: "12px !important",
            sm: "24px !important",
          },
          left: {
            xs: "12px !important",
            sm: "auto !important",
          },
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() =>
            setNotification(null)
          }
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
            minWidth: {
              sm: 320,
            },
            maxWidth: 420,
            boxShadow:
              "0 14px 34px rgba(73, 53, 36, 0.16)",
          }}
        >
          {notification}
        </Alert>
      </Snackbar>
    </>
  );
}
