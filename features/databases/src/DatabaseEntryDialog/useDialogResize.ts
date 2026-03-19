import { useCallback, useEffect, useRef } from 'react';
import { getWindowSizeSlot } from '@minddrop/utils';
import {
  DialogSize,
  EntryDialogSizesStore,
  dialogSizeKey,
} from './EntryDialogSizesStore';
import { EDGE_PADDING_X, EDGE_PADDING_Y } from './useDialogSize';

// Handles interactive corner-drag resizing of the entry dialog canvas.
// Tracks a mousedown → mousemove → mouseup cycle, mirrors size changes
// from the center, and persists the final dimensions on release.

type ResizeEdge = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ResizeState {
  edge: ResizeEdge;
  startX: number;
  startY: number;
  originWidth: number;
  originHeight: number;
}

// Minimum canvas dimensions
const MIN_WIDTH = 200;
const MIN_HEIGHT = 100;

interface UseDialogResizeReturn {
  /**
   * Mousedown handler to start a corner resize. Bind to each
   * corner handle with the appropriate edge.
   */
  handleResizeMouseDown: (event: React.MouseEvent, edge: ResizeEdge) => void;
}

/**
 * Manages corner-drag resizing of the dialog canvas. Attaches
 * global mouse listeners while the dialog is open and persists
 * the final size on mouseup.
 */
export function useDialogResize(
  open: boolean,
  size: DialogSize,
  setSize: React.Dispatch<React.SetStateAction<DialogSize>>,
  designId: string | null,
  sizeRef: React.RefObject<DialogSize>,
  baseSizeRef: React.RefObject<{
    width: number;
    height: number;
    viewportWidth: number;
    viewportHeight: number;
  } | null>,
): UseDialogResizeReturn {
  const resizeState = useRef<ResizeState | null>(null);

  // Start a resize operation on mousedown
  const handleResizeMouseDown = useCallback(
    (event: React.MouseEvent, edge: ResizeEdge) => {
      event.stopPropagation();

      resizeState.current = {
        edge,
        startX: event.clientX,
        startY: event.clientY,
        originWidth: size.width,
        originHeight: size.height,
      };
    },
    [size],
  );

  // Handle mouse movement during resize (always mirrored from center)
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!resizeState.current) {
        return;
      }

      const { edge, startX, startY, originWidth, originHeight } =
        resizeState.current;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      // Maximum dimensions (viewport minus edge padding on each side)
      const maxWidth = window.innerWidth - EDGE_PADDING_X * 2;
      const maxHeight = window.innerHeight - EDGE_PADDING_Y * 2;

      switch (edge) {
        case 'top-left': {
          const newWidth = Math.min(
            Math.max(MIN_WIDTH, originWidth - deltaX * 2),
            maxWidth,
          );
          const newHeight = Math.min(
            Math.max(MIN_HEIGHT, originHeight - deltaY * 2),
            maxHeight,
          );

          setSize({ width: newWidth, height: newHeight });

          break;
        }

        case 'top-right': {
          const newWidth = Math.min(
            Math.max(MIN_WIDTH, originWidth + deltaX * 2),
            maxWidth,
          );
          const newHeight = Math.min(
            Math.max(MIN_HEIGHT, originHeight - deltaY * 2),
            maxHeight,
          );

          setSize({ width: newWidth, height: newHeight });

          break;
        }

        case 'bottom-left': {
          const newWidth = Math.min(
            Math.max(MIN_WIDTH, originWidth - deltaX * 2),
            maxWidth,
          );
          const newHeight = Math.min(
            Math.max(MIN_HEIGHT, originHeight + deltaY * 2),
            maxHeight,
          );

          setSize({ width: newWidth, height: newHeight });

          break;
        }

        case 'bottom-right': {
          const newWidth = Math.min(
            Math.max(MIN_WIDTH, originWidth + deltaX * 2),
            maxWidth,
          );
          const newHeight = Math.min(
            Math.max(MIN_HEIGHT, originHeight + deltaY * 2),
            maxHeight,
          );

          setSize({ width: newWidth, height: newHeight });

          break;
        }
      }
    },
    [setSize],
  );

  // End resize on mouseup and persist the final size
  const handleMouseUp = useCallback(() => {
    if (!resizeState.current) {
      return;
    }

    // Persist the final size if we have a design ID
    if (designId) {
      const key = dialogSizeKey(designId, getWindowSizeSlot());

      EntryDialogSizesStore.set(key, sizeRef.current);

      // Update the base size to reflect the user's new intent
      baseSizeRef.current = {
        ...sizeRef.current,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      };
    }

    resizeState.current = null;
  }, [designId, sizeRef, baseSizeRef]);

  // Attach global mouse listeners for resize
  useEffect(() => {
    if (!open) {
      return;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [open, handleMouseMove, handleMouseUp]);

  return { handleResizeMouseDown };
}
