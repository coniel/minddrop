import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { WindowSizeSlot, getWindowSizeSlot } from '@minddrop/utils';
import {
  DialogSize,
  EntryDialogSizesStore,
  dialogSizeKey,
} from './EntryDialogSizesStore';

// Manages the entry dialog's size state. Restores a persisted size
// (or falls back to a default) when the dialog opens, and adapts the
// dimensions when the browser window is resized or crosses a size-slot
// boundary.

// Minimum canvas dimensions
const MIN_WIDTH = 200;
const MIN_HEIGHT = 100;

// Minimum gap between the canvas edge and the viewport edge
export const EDGE_PADDING_X = 50;
export const EDGE_PADDING_Y = 25;

interface BaseSizeSnapshot {
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
}

interface UseDialogSizeReturn {
  /**
   * The current dialog width and height.
   */
  size: DialogSize;

  /**
   * Setter for the dialog size.
   */
  setSize: React.Dispatch<React.SetStateAction<DialogSize>>;

  /**
   * Ref that always mirrors the latest `size` value so callbacks
   * can read it without a stale closure.
   */
  sizeRef: React.RefObject<DialogSize>;

  /**
   * The user's intended size and the viewport dimensions at the
   * time it was set, used to compute display size on window resize.
   */
  baseSizeRef: React.RefObject<BaseSizeSnapshot | null>;
}

/**
 * Manages dialog size state, restores persisted sizes on open,
 * and adapts the size when the browser window is resized.
 */
export function useDialogSize(
  open: boolean,
  designId: string | null,
): UseDialogSizeReturn {
  const [size, setSize] = useState<DialogSize>({ width: 0, height: 0 });

  // Keep a ref to the current size so callbacks can read it
  // without needing size in their dependency arrays
  const sizeRef = useRef(size);
  sizeRef.current = size;

  // The user's intended size and the viewport at the time it
  // was set, used to compute display size on window resize
  const baseSizeRef = useRef<BaseSizeSnapshot | null>(null);

  // Track the current window size slot to detect crossings
  const slotRef = useRef<WindowSizeSlot | null>(null);

  // Restore a saved size or fall back to the default
  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const slot = getWindowSizeSlot();

    slotRef.current = slot;

    // Attempt to restore a persisted size, fall back to defaults
    const saved = designId
      ? (EntryDialogSizesStore.get(dialogSizeKey(designId, slot)) as
          | DialogSize
          | undefined)
      : undefined;

    const width = Math.min(
      saved?.width ?? 1200,
      window.innerWidth - EDGE_PADDING_X * 2,
    );
    const height = Math.min(
      saved?.height ?? 900,
      window.innerHeight - EDGE_PADDING_Y * 2,
    );

    // Record the base size for window resize calculations
    baseSizeRef.current = {
      width,
      height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };

    setSize({ width, height });
  }, [open, designId]);

  // Adapt dialog size when the window is resized
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleWindowResize = () => {
      const newSlot = getWindowSizeSlot();
      const newViewportWidth = window.innerWidth;
      const newViewportHeight = window.innerHeight;

      // If the slot changed, load the saved size for the new slot
      if (slotRef.current && newSlot !== slotRef.current) {
        slotRef.current = newSlot;

        // Try to load a saved size for the new slot, fall back to defaults
        const saved = designId
          ? (EntryDialogSizesStore.get(dialogSizeKey(designId, newSlot)) as
              | DialogSize
              | undefined)
          : undefined;

        const width = Math.min(
          saved?.width ?? 1200,
          newViewportWidth - EDGE_PADDING_X * 2,
        );
        const height = Math.min(
          saved?.height ?? 900,
          newViewportHeight - EDGE_PADDING_Y * 2,
        );

        // Update the base size to the loaded preset
        baseSizeRef.current = {
          width,
          height,
          viewportWidth: newViewportWidth,
          viewportHeight: newViewportHeight,
        };

        setSize({ width, height });

        return;
      }

      // Same slot — apply margin clamping based on the user's
      // intended size
      if (!baseSizeRef.current) {
        return;
      }

      const base = baseSizeRef.current;

      // Compute the user's margin as a fraction of the viewport
      // when the base size was set
      const baseMarginX = (base.viewportWidth - base.width) / 2;
      const baseMarginFractionX = baseMarginX / base.viewportWidth;

      let displayWidth: number;

      if (baseMarginFractionX < 0.1) {
        // User was close to the edge — maintain fixed px margin
        displayWidth = newViewportWidth - 2 * baseMarginX;
      } else {
        // User had plenty of margin — enforce 10% minimum
        displayWidth = Math.min(
          base.width,
          newViewportWidth - EDGE_PADDING_X * 2,
        );
      }

      const baseMarginY = (base.viewportHeight - base.height) / 2;
      const baseMarginFractionY = baseMarginY / base.viewportHeight;

      let displayHeight: number;

      if (baseMarginFractionY < 0.1) {
        // User was close to the edge — maintain fixed px margin
        displayHeight = newViewportHeight - 2 * baseMarginY;
      } else {
        // User had plenty of margin — enforce edge padding minimum
        displayHeight = Math.min(
          base.height,
          newViewportHeight - EDGE_PADDING_Y * 2,
        );
      }

      // Clamp to minimum dimensions
      displayWidth = Math.max(MIN_WIDTH, displayWidth);
      displayHeight = Math.max(MIN_HEIGHT, displayHeight);

      setSize({
        width: Math.round(displayWidth),
        height: Math.round(displayHeight),
      });
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [open, designId]);

  return { size, setSize, sizeRef, baseSizeRef };
}
