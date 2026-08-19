import { useEffect, useLayoutEffect, useState } from 'react';
import { CanvasPoint, useCanvas, useCanvasStore } from '@minddrop/ui-canvas';
import {
  useTransientViewStateContext,
  useTransientViewStateKey,
} from '@minddrop/ui-primitives';

/**
 * The canvas view the studio was left on.
 */
interface StoredCanvasView {
  /**
   * The zoom level.
   */
  zoom: number;

  /**
   * The pan offset in pixels.
   */
  pan: CanvasPoint;
}

/**
 * Restores the pan and zoom the studio was left on, and records
 * them as the user moves around the canvas. The canvas store is
 * created per mount, so without this a tab switch returns to the
 * default view.
 *
 * @returns Whether a recorded view was restored.
 */
export function useCanvasViewPersistence(): boolean {
  const canvas = useCanvas();
  const context = useTransientViewStateContext();
  const stateKey = useTransientViewStateKey('canvas-view');
  const zoom = useCanvasStore((state) => state.zoom);
  const pan = useCanvasStore((state) => state.pan);

  // Read once on mount, since restoring is a one-off which must
  // not be redone as the user moves around
  const [storedView] = useState(
    () => context?.get(stateKey) as StoredCanvasView | undefined,
  );

  // Restore before the canvas paints, so the default view is never
  // shown in its place
  useLayoutEffect(() => {
    if (!storedView) {
      return;
    }

    // Zooming moves the view, so the pan is applied after it
    canvas.setZoom(storedView.zoom);
    canvas.setPan(storedView.pan.x, storedView.pan.y);
  }, [canvas, storedView]);

  // Record the view as it changes, reading the live values so that
  // the restore itself is recorded rather than the view it replaced
  useEffect(() => {
    context?.set(stateKey, { zoom: canvas.getZoom(), pan: canvas.getPan() });
  }, [context, stateKey, canvas, zoom, pan]);

  return Boolean(storedView);
}
