import { DesignStudioStore } from './DesignStudioStore';

/** Amount to step when zooming with +/- buttons or keyboard. */
const ZOOM_STEP = 0.1;

/**
 * Returns the center point of the viewport element, or undefined
 * if the viewport is not mounted.
 */
export function getViewportCenter(): { x: number; y: number } | undefined {
  const viewport = document.querySelector(
    '.design-studio-viewport',
  ) as HTMLElement | null;

  if (!viewport) {
    return undefined;
  }

  return {
    x: viewport.offsetWidth / 2,
    y: viewport.offsetHeight / 2,
  };
}

/**
 * Zooms in by one step, centered on the viewport.
 * Snaps to 100% if the result is within 5%.
 */
export function zoomIn(): void {
  const store = DesignStudioStore.getState();
  let newZoom = store.zoom + ZOOM_STEP;

  // Snap to 100% if within 5%
  if (Math.abs(newZoom - 1) <= 0.05) {
    newZoom = 1;
  }

  store.setZoom(newZoom, getViewportCenter());
}

/**
 * Zooms out by one step, centered on the viewport.
 * Snaps to 100% if the result is within 5%.
 */
export function zoomOut(): void {
  const store = DesignStudioStore.getState();
  let newZoom = store.zoom - ZOOM_STEP;

  // Snap to 100% if within 5%
  if (Math.abs(newZoom - 1) <= 0.05) {
    newZoom = 1;
  }

  store.setZoom(newZoom, getViewportCenter());
}

/**
 * Resets zoom to 100% and centers the canvas in the viewport.
 */
export function resetView(): void {
  const viewport = document.querySelector(
    '.design-studio-viewport',
  ) as HTMLElement;
  const canvas = viewport?.querySelector('.design-canvas') as HTMLElement;

  if (!viewport || !canvas) {
    DesignStudioStore.getState().resetView();

    return;
  }

  // Get the canvas position and size in the un-zoomed coordinate space
  const canvasWidth = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;

  // Parse the canvas translate transform to get its position
  const transform = canvas.style.transform;
  const match = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
  const canvasX = match ? parseFloat(match[1]) : 0;
  const canvasY = match ? parseFloat(match[2]) : 0;

  // Center the canvas in the viewport at zoom 1
  const viewportWidth = viewport.offsetWidth;
  const viewportHeight = viewport.offsetHeight;
  const panX = viewportWidth / 2 - (canvasX + canvasWidth / 2);
  const panY = viewportHeight / 2 - (canvasY + canvasHeight / 2);

  const store = DesignStudioStore.getState();

  store.setPan(panX, panY);
  store.setZoom(1);
}
