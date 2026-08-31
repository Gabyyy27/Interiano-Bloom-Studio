"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
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
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/admin/categorias/actions";
import type {
  AdminCategory,
  CategoryActionState,
} from "@/types/admin";

const initialCategoryActionState: CategoryActionState = {
  status: "idle",
  message: null,
};

type CategoryFormDialogState =
  | {
      mode: "create";
      category: null;
    }
  | {
      mode: "edit";
      category: AdminCategory;
    };

interface CategoryFormDialogProps {
  dialogState: CategoryFormDialogState;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

interface DeleteCategoryDialogProps {
  category: AdminCategory;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

interface CategoryRowProps {
  category: AdminCategory;
  onEdit: (category: AdminCategory) => void;
  onDelete: (category: AdminCategory) => void;
}

interface CategoryManagerProps {
  categories: AdminCategory[];
  hasError: boolean;
}

function formatItemCount(count: number) {
  return `${count} ${count === 1 ? "ítem" : "ítems"}`;
}

function CategoryFormDialog({
  dialogState,
  onClose,
  onSuccess,
}: CategoryFormDialogProps) {
  const isEditing = dialogState.mode === "edit";

  const action = isEditing
    ? updateCategoryAction
    : createCategoryAction;

  const [state, formAction, isPending] =
    useActionState(
      action,
      initialCategoryActionState,
    );

  useEffect(() => {
    if (state.status === "success") {
      onSuccess(
        state.message ??
          (isEditing
            ? "Categoría actualizada correctamente."
            : "Categoría creada correctamente."),
      );
    }
  }, [
    state.status,
    state.message,
    isEditing,
    onSuccess,
  ]);

  const category = dialogState.category;

  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      scroll="paper"
      onClose={isPending ? () => undefined : onClose}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "calc(100% - 24px)",
              sm: "min(560px, calc(100% - 48px))",
            },
            maxWidth: 560,
            maxHeight: "calc(100dvh - 16px)",
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
            backgroundColor: "background.paper",
          },
        },
      }}
    >
      <form
        action={formAction}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {category ? (
          <input
            type="hidden"
            name="id"
            value={category.id}
          />
        ) : null}

        <DialogTitle
          sx={{
            fontFamily:
              "var(--font-display), Georgia, serif",
            fontSize: {
              xs: "1.9rem",
              sm: "2.2rem",
            },
            fontWeight: 500,
            lineHeight: 1.08,
            px: {
              xs: 2.5,
              sm: 3.5,
            },
            pt: {
              xs: 2.5,
              sm: 3,
            },
            pb: 1,
            flexShrink: 0,
          }}
        >
          {isEditing
            ? "Editar categoría"
            : "Agregar categoría"}
        </DialogTitle>

        <DialogContent
          sx={{
            px: {
              xs: 2.5,
              sm: 3.5,
            },
            pt: "12px !important",
            pb: 2,
            flex: "1 1 auto",
            minHeight: 0,
            overflowX: "hidden",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Stack spacing={2.5}>
            <Typography
              sx={{
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              {isEditing
                ? "Actualiza el nombre de la categoría."
                : "Escribe el nombre de la nueva categoría."}
            </Typography>

            {state.status === "error" ? (
              <Alert severity="error">
                {state.message}
              </Alert>
            ) : null}

            <TextField
              id={
                isEditing
                  ? "edit-category-name"
                  : "create-category-name"
              }
              name="name"
              label="Nombre de la categoría"
              placeholder="Ejemplo: Graduaciones"
              defaultValue={category?.name ?? ""}
              error={Boolean(
                state.fieldErrors?.name,
              )}
              helperText={
                state.fieldErrors?.name ??
                "El identificador se genera automáticamente."
              }
              required
              autoFocus
              fullWidth
              disabled={isPending}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                htmlInput: {
                  maxLength: 60,
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "flex-end",
            gap: 1,
            px: {
              xs: 2.5,
              sm: 3.5,
            },
            pb: {
              xs: 2.5,
              sm: 3,
            },
            pt: 1,
            flexShrink: 0,
            backgroundColor: "background.paper",
            paddingBottom: {
              xs: "max(16px, env(safe-area-inset-bottom))",
              sm: 3,
            },
          }}
        >
          <Button
            type="button"
            onClick={onClose}
            disabled={isPending}
            sx={{
              minHeight: 44,
            }}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            sx={{
              minHeight: 44,
              whiteSpace: "nowrap",
            }}
          >
            {isPending
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Crear categoría"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function DeleteCategoryDialog({
  category,
  onClose,
  onSuccess,
}: DeleteCategoryDialogProps) {
  const [state, formAction, isPending] =
    useActionState(
      deleteCategoryAction,
      initialCategoryActionState,
    );

  useEffect(() => {
    if (state.status === "success") {
      onSuccess(
        state.message ??
          "Categoría eliminada correctamente.",
      );
    }
  }, [state.status, state.message, onSuccess]);

  const hasItems = category.itemCount > 0;
  const itemLabel =
    category.itemCount === 1
      ? "1 ítem"
      : `${category.itemCount} ítems`;

  return (
    <Dialog
      open
      fullWidth
      maxWidth="xs"
      scroll="paper"
      onClose={isPending ? () => undefined : onClose}
      slotProps={{
        paper: {
          sx: {
            mx: {
              xs: 2,
              sm: 3,
            },
            maxHeight: "calc(100dvh - 24px)",
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "background.default",
          },
        },
      }}
    >
      <form
        action={formAction}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <input
          type="hidden"
          name="id"
          value={category.id}
        />

        <DialogTitle
          sx={{
            fontFamily:
              "var(--font-display), Georgia, serif",
            fontSize: {
              xs: "1.8rem",
              sm: "2rem",
            },
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          Eliminar categoría
        </DialogTitle>

        <DialogContent
          sx={{
            flex: "1 1 auto",
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

            <Typography
              sx={{
                lineHeight: 1.7,
              }}
            >
              ¿Confirmas que deseas eliminar la categoría{" "}
              <Box
                component="strong"
                sx={{
                  color: "primary.dark",
                }}
              >
                {category.name}
              </Box>
              ?
            </Typography>

            {hasItems ? (
              <Alert severity="warning">
                {category.itemCount === 1
                  ? `Esta categoría contiene ${itemLabel}. Al eliminarla también se eliminará permanentemente ese ítem y todas sus imágenes.`
                  : `Esta categoría contiene ${itemLabel}. Al eliminarla también se eliminarán permanentemente todos los ítems de esta categoría y todas sus imágenes.`}
              </Alert>
            ) : null}

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              Esta acción no se puede deshacer.
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
            type="submit"
            variant="contained"
            color="error"
            disabled={isPending}
          >
            {isPending
              ? "Eliminando..."
              : "Eliminar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function CategoryRow({
  category,
  onEdit,
  onDelete,
}: CategoryRowProps) {
  return (
    <Paper
      component="article"
      elevation={0}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr) auto",
          sm: "minmax(0, 1fr) auto auto",
        },
        gridTemplateAreas: {
          xs: `
            "name actions"
            "count actions"
          `,
          sm: `"name count actions"`,
        },
        columnGap: {
          xs: 1.5,
          sm: 3,
        },
        rowGap: 0.75,
        alignItems: "center",
        px: {
          xs: 2,
          sm: 3,
        },
        py: {
          xs: 2,
          sm: 2.25,
        },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        backgroundColor: "background.paper",
        transition:
          "border-color 180ms ease, box-shadow 180ms ease",

        "&:hover": {
          borderColor: "rgba(184, 148, 95, 0.44)",
          boxShadow:
            "0 10px 26px rgba(73, 53, 36, 0.06)",
        },
      }}
    >
      <Typography
        component="h2"
        sx={{
          gridArea: "name",
          minWidth: 0,
          color: "text.primary",
          fontFamily:
            "var(--font-display), Georgia, serif",
          fontSize: {
            xs: "1.4rem",
            sm: "1.55rem",
          },
          fontWeight: 500,
          lineHeight: 1.2,
          overflowWrap: "anywhere",
        }}
      >
        {category.name}
      </Typography>

      <Chip
        label={formatItemCount(category.itemCount)}
        size="small"
        variant="outlined"
        color="primary"
        sx={{
          gridArea: "count",
          width: "fit-content",
        }}
      />

      <Stack
        direction="row"
        spacing={0.75}
        sx={{
          gridArea: "actions",
        }}
      >
        <Tooltip title="Editar categoría">
          <IconButton
            type="button"
            color="primary"
            aria-label={`Editar categoría ${category.name}`}
            onClick={() => onEdit(category)}
            sx={{
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Eliminar categoría">
          <IconButton
            type="button"
            color="error"
            aria-label={`Eliminar categoría ${category.name}`}
            onClick={() => onDelete(category)}
            sx={{
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}

export default function CategoryManager({
  categories,
  hasError,
}: CategoryManagerProps) {
  const router = useRouter();
  const headingRef =
    useRef<HTMLHeadingElement | null>(null);

  const [formDialog, setFormDialog] =
    useState<CategoryFormDialogState | null>(
      null,
    );

  const [
    categoryToDelete,
    setCategoryToDelete,
  ] = useState<AdminCategory | null>(null);

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
      setCategoryToDelete(null);
      setNotification(message);
      focusSectionHeading();
      router.refresh();
    },
    [focusSectionHeading, router],
  );

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
                color: "text.primary",
                fontFamily:
                  "var(--font-display), Georgia, serif",
                fontSize: {
                  xs: "2.2rem",
                  md: "2.8rem",
                },
                fontWeight: 500,
                lineHeight: 1.1,

                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Categorías
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                color: "text.secondary",
              }}
            >
              Organiza los ítems que aparecen en el
              catálogo.
            </Typography>
          </Box>

          <Button
            type="button"
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() =>
              setFormDialog({
                mode: "create",
                category: null,
              })
            }
            sx={{
              minHeight: 48,
              alignSelf: {
                xs: "flex-start",
                sm: "auto",
              },
            }}
          >
            Agregar categoría
          </Button>
        </Stack>

        {hasError ? (
          <Alert severity="error">
            No fue posible cargar las categorías.
          </Alert>
        ) : null}

        {!hasError && categories.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 4,
                sm: 5,
              },
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              backgroundColor:
                "rgba(255, 253, 248, 0.64)",
              textAlign: "center",
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontFamily:
                  "var(--font-display), Georgia, serif",
                fontSize: "1.75rem",
                fontWeight: 500,
              }}
            >
              No hay categorías
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                color: "text.secondary",
              }}
            >
              Agrega la primera categoría usando el
              botón superior.
            </Typography>
          </Paper>
        ) : null}

        {!hasError && categories.length > 0 ? (
          <Stack spacing={1.5}>
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onEdit={(selectedCategory) =>
                  setFormDialog({
                    mode: "edit",
                    category: selectedCategory,
                  })
                }
                onDelete={setCategoryToDelete}
              />
            ))}
          </Stack>
        ) : null}
      </Stack>

      {formDialog ? (
        <CategoryFormDialog
          key={
            formDialog.mode === "create"
              ? "create-category"
              : `edit-${formDialog.category.id}`
          }
          dialogState={formDialog}
          onClose={() => setFormDialog(null)}
          onSuccess={handleSuccess}
        />
      ) : null}

      {categoryToDelete ? (
        <DeleteCategoryDialog
          key={categoryToDelete.id}
          category={categoryToDelete}
          onClose={() =>
            setCategoryToDelete(null)
          }
          onSuccess={handleSuccess}
        />
      ) : null}

      <Snackbar
        open={notification !== null}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
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
          onClose={() => setNotification(null)}
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
