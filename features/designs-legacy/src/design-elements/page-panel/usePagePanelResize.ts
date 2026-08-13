import { useCallback, useEffect, useRef, useState } from 'react';
import { PagePanelSide } from '@minddrop/designs-legacy';
import { getWindowSizeSlot } from '@minddrop/utils';
import {
  LayoutRegionSizesStore,
  layoutRegionSizeKey,
} from '../../LayoutRegionSizesStore';

// Width bounds applied while dragging a panel edge
const MIN_PANEL_WIDTH = 120;
const MAX_PANEL_WIDTH = 640;

interface ResizeState {
  /**
   * The pointer X position where the resize started.
   */
  startX: number;

  /**
   * The panel width when the resize started.
   */
  startWidth: number;
}

interface UsePagePanelResizeReturn {
  /**
   * The current panel width to render.
   */
  width: number;

  /**
   * Mousedown handler to start a resize. Bind to the panel's
   * edge handle.
   */
  handleResizeMouseDown: (event: React.MouseEvent) => void;
}

/**
 * Manages runtime resizing of a page panel in actual use. Restores
 * the persisted width for the current window size slot, updates it
 * live during a drag, and persists the final width on release.
 *
 * @param layoutId - The ID of the layout the panel belongs to.
 * @param context - The context the layout is rendered in (e.g.
 *   `page`, `dialog`), so a panel is sized per context.
 * @param side - The side the panel is docked to.
 * @param defaultWidth - The panel's design width, used when no
 *   width has been persisted for the current slot.
 */
export function usePagePanelResize(
  layoutId: string,
  context: string,
  side: PagePanelSide,
  defaultWidth: number,
): UsePagePanelResizeReturn {
  const resizeState = useRef<ResizeState | null>(null);
  const region = `panel-${side}`;

  // Read the persisted width for the current window size slot,
  // falling back to the design default
  const readStoredWidth = useCallback(() => {
    const key = layoutRegionSizeKey(
      layoutId,
      context,
      region,
      getWindowSizeSlot(),
    );

    return LayoutRegionSizesStore.get(key)?.width ?? defaultWidth;
  }, [layoutId, context, region, defaultWidth]);

  const [width, setWidth] = useState(readStoredWidth);
  // Latest width for reading inside the mouse-up handler
  const widthRef = useRef(width);

  // Mirror the width into a ref for the mouse-up handler
  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  // Restore the stored width when the layout, side, or default
  // changes, but never while a resize is in progress
  useEffect(() => {
    if (!resizeState.current) {
      setWidth(readStoredWidth());
    }
  }, [readStoredWidth]);

  // Re-read the stored width when the window crosses a size-slot
  // boundary, since widths are stored per slot
  useEffect(() => {
    const handleWindowResize = () => {
      if (!resizeState.current) {
        setWidth(readStoredWidth());
      }
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [readStoredWidth]);

  // Track pointer movement while resizing. The left panel grows as
  // the handle moves right, the right panel grows as it moves left.
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!resizeState.current) {
        return;
      }

      const delta = event.clientX - resizeState.current.startX;
      const signedDelta = side === 'left' ? delta : -delta;
      const nextWidth = Math.min(
        MAX_PANEL_WIDTH,
        Math.max(MIN_PANEL_WIDTH, resizeState.current.startWidth + signedDelta),
      );

      setWidth(nextWidth);
    },
    [side],
  );

  // End the resize on mouse up, persisting the final width for the
  // current window size slot
  const handleMouseUp = useCallback(() => {
    if (!resizeState.current) {
      return;
    }

    resizeState.current = null;

    const key = layoutRegionSizeKey(
      layoutId,
      context,
      region,
      getWindowSizeSlot(),
    );

    LayoutRegionSizesStore.set(key, { width: Math.round(widthRef.current) });
  }, [layoutId, context, region]);

  // Attach global mouse listeners for the resize interaction
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Start a resize on the handle, stopping propagation so the panel
  // is not selected or dragged by the same press
  const handleResizeMouseDown = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();

    resizeState.current = {
      startX: event.clientX,
      startWidth: widthRef.current,
    };
  }, []);

  return { width, handleResizeMouseDown };
}
