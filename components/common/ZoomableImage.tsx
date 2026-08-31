"use client";

import {
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

interface Point {
  x: number;
  y: number;
}

interface DragStart {
  pointerX: number;
  pointerY: number;
  offsetX: number;
  offsetY: number;
}

interface ZoomableImageProps {
  src: string;
  alt: string;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  onZoomChange?: (zoom: number) => void;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function ZoomableImage({
  src,
  alt,
  onInteractionStart,
  onInteractionEnd,
  onZoomChange,
}: ZoomableImageProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const dragStartRef =
    useRef<DragStart | null>(null);

  const interactionEndTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const [zoom, setZoom] = useState(MIN_ZOOM);

  const [offset, setOffset] = useState<Point>({
    x: 0,
    y: 0,
  });

  const [isDragging, setIsDragging] =
    useState(false);

  const clearInteractionEndTimeout =
    useCallback(() => {
      if (interactionEndTimeoutRef.current) {
        clearTimeout(
          interactionEndTimeoutRef.current,
        );
        interactionEndTimeoutRef.current = null;
      }
    }, []);

  const notifyInteractionStart =
    useCallback(() => {
      clearInteractionEndTimeout();
      onInteractionStart?.();
    }, [
      clearInteractionEndTimeout,
      onInteractionStart,
    ]);

  const notifyInteractionEnd =
    useCallback(() => {
      clearInteractionEndTimeout();
      onInteractionEnd?.();
    }, [
      clearInteractionEndTimeout,
      onInteractionEnd,
    ]);

  const finishControlInteraction =
    useCallback(() => {
      clearInteractionEndTimeout();

      interactionEndTimeoutRef.current =
        setTimeout(() => {
          onInteractionEnd?.();
          interactionEndTimeoutRef.current = null;
        }, 450);
    }, [
      clearInteractionEndTimeout,
      onInteractionEnd,
    ]);

  useEffect(() => {
    return () => {
      clearInteractionEndTimeout();
    };
  }, [clearInteractionEndTimeout]);

  const clampOffset = (
    nextOffset: Point,
    nextZoom = zoom,
  ): Point => {
    const container = containerRef.current;

    if (!container || nextZoom <= MIN_ZOOM) {
      return {
        x: 0,
        y: 0,
      };
    }

    const bounds =
      container.getBoundingClientRect();

    const maximumX =
      (bounds.width * (nextZoom - 1)) / 2;

    const maximumY =
      (bounds.height * (nextZoom - 1)) / 2;

    return {
      x: clamp(
        nextOffset.x,
        -maximumX,
        maximumX,
      ),
      y: clamp(
        nextOffset.y,
        -maximumY,
        maximumY,
      ),
    };
  };

  const changeZoom = (nextZoom: number) => {
    const safeZoom = clamp(
      nextZoom,
      MIN_ZOOM,
      MAX_ZOOM,
    );

    setZoom(safeZoom);
    onZoomChange?.(safeZoom);

    setOffset((currentOffset) =>
      clampOffset(currentOffset, safeZoom),
    );
  };

  const resetZoom = () => {
    setZoom(MIN_ZOOM);
    onZoomChange?.(MIN_ZOOM);
    setOffset({
      x: 0,
      y: 0,
    });
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (zoom <= MIN_ZOOM) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
    notifyInteractionStart();

    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };

    setIsDragging(true);
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const dragStart = dragStartRef.current;

    if (!dragStart || zoom <= MIN_ZOOM) {
      return;
    }

    const nextOffset = {
      x:
        dragStart.offsetX +
        event.clientX -
        dragStart.pointerX,
      y:
        dragStart.offsetY +
        event.clientY -
        dragStart.pointerY,
    };

    setOffset(clampOffset(nextOffset));
  };

  const finishDragging = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const wasDragging =
      dragStartRef.current !== null;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    dragStartRef.current = null;
    setIsDragging(false);

    if (wasDragging) {
      notifyInteractionEnd();
    }
  };

  const handleDoubleClick = () => {
    notifyInteractionStart();

    if (zoom > MIN_ZOOM) {
      resetZoom();
      finishControlInteraction();
      return;
    }

    changeZoom(2);
    finishControlInteraction();
  };

  return (
    <Box
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDragging}
      onPointerCancel={finishDragging}
      onDoubleClick={handleDoubleClick}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: {
          xs: 420,
          sm: 520,
          md: 620,
        },
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        touchAction:
          zoom > MIN_ZOOM ? "none" : "pan-y",
        userSelect: "none",
        cursor:
          zoom > MIN_ZOOM
            ? isDragging
              ? "grabbing"
              : "grab"
            : "zoom-in",
        background:
          "linear-gradient(135deg, #F7F1E7 0%, #FFFDF8 100%)",
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        draggable={false}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "contain",
          objectPosition: "center",
          p: {
            xs: 1,
            sm: 2,
          },
          pointerEvents: "none",
          transform: `
            translate(${offset.x}px, ${offset.y}px)
            scale(${zoom})
          `,
          transformOrigin: "center",
          transition: isDragging
            ? "none"
            : "transform 180ms ease",
          willChange: "transform",
        }}
      />

      <Paper
        elevation={0}
        sx={{
          position: "absolute",

          top: {
            xs: 12,
            sm: 16,
          },

          left: "50%",
          right: "auto",
          transform: "translateX(-50%)",

          zIndex: 8,

          px: 0.5,
          py: 0.5,

          border: "1px solid",
          borderColor: "divider",
          borderRadius: 999,

          backgroundColor:
            "rgba(255, 253, 248, 0.94)",

          backdropFilter: "blur(10px)",

          boxShadow:
            "0 4px 14px rgba(43, 33, 24, 0.08)",
        }}
      >
        <Stack
          direction="row"
          spacing={0.25}
          sx={{
            alignItems: "center",
          }}
        >
          <Tooltip title="Alejar">
            <span>
              <IconButton
                type="button"
                size="small"
                aria-label="Alejar imagen"
                disabled={zoom <= MIN_ZOOM}
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
                onTouchStart={(event) => {
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  notifyInteractionStart();
                  changeZoom(zoom - ZOOM_STEP);
                  finishControlInteraction();
                }}
              >
                <ZoomOutOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Typography
            variant="caption"
            sx={{
              minWidth: 48,
              color: "text.secondary",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {Math.round(zoom * 100)}%
          </Typography>

          <Tooltip title="Acercar">
            <span>
              <IconButton
                type="button"
                size="small"
                aria-label="Acercar imagen"
                disabled={zoom >= MAX_ZOOM}
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
                onTouchStart={(event) => {
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  notifyInteractionStart();
                  changeZoom(zoom + ZOOM_STEP);
                  finishControlInteraction();
                }}
              >
                <ZoomInOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Restablecer">
            <span>
              <IconButton
                type="button"
                size="small"
                aria-label="Restablecer imagen"
                disabled={
                  zoom === MIN_ZOOM &&
                  offset.x === 0 &&
                  offset.y === 0
                }
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
                onTouchStart={(event) => {
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  notifyInteractionStart();
                  resetZoom();
                  finishControlInteraction();
                }}
              >
                <RestartAltOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Paper>

      {zoom > MIN_ZOOM ? (
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 12,
            transform: "translateX(-50%)",
            px: 1.5,
            py: 0.5,
            borderRadius: 999,
            color: "text.secondary",
            backgroundColor:
              "rgba(255, 253, 248, 0.9)",
            whiteSpace: "nowrap",
          }}
        >
          Arrastra para explorar la imagen
        </Typography>
      ) : null}
    </Box>
  );
}
