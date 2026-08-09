import { useMemo } from 'react';
import { useCanvasContext } from './CanvasContext';
import { CanvasStore } from './createCanvasStore';
import { CanvasPoint } from './types';
import { screenToCanvas } from './utils';

export interface CanvasActions extends CanvasStore {
  /**
   * Converts a point in client (mouse event) coordinates to
   * canvas coordinates. Returns the point relative to the canvas
   * origin at 100% zoom.
   */
  clientToCanvas: (point: CanvasPoint) => CanvasPoint;
}

/**
 * Returns the current canvas instance's store, extended with
 * viewport-aware helpers, for imperative use in toolbars and
 * menus. Must be used within a CanvasProvider.
 */
export function useCanvas(): CanvasActions {
  const { store, viewportRef } = useCanvasContext();

  return useMemo<CanvasActions>(
    () => ({
      ...store,
      clientToCanvas: (point) => {
        const rect = viewportRef.current?.getBoundingClientRect();

        // Make the point viewport-relative before undoing the transform
        return screenToCanvas(
          {
            x: point.x - (rect?.left || 0),
            y: point.y - (rect?.top || 0),
          },
          store.getPan(),
          store.getZoom(),
        );
      },
    }),
    [store, viewportRef],
  );
}
