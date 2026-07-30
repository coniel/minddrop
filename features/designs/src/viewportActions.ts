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
 * Resets zoom to 100% and centers the layout frame in the viewport.
 */
export function resetView(): void {
  const viewport = document.querySelector(
    '.design-studio-viewport',
  ) as HTMLElement;
  const frame = viewport?.querySelector('.layout-frame') as HTMLElement;

  if (!viewport || !frame) {
    DesignStudioStore.getState().resetView();

    return;
  }

  // Get the frame position and size in the un-zoomed coordinate space
  const frameWidth = frame.offsetWidth;
  const frameHeight = frame.offsetHeight;

  // Parse the frame translate transform to get its position
  const transform = frame.style.transform;
  const match = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
  const frameX = match ? parseFloat(match[1]) : 0;
  const frameY = match ? parseFloat(match[2]) : 0;

  // Center the frame in the viewport at zoom 1
  const viewportWidth = viewport.offsetWidth;
  const viewportHeight = viewport.offsetHeight;
  const panX = viewportWidth / 2 - (frameX + frameWidth / 2);
  const panY = viewportHeight / 2 - (frameY + frameHeight / 2);

  const store = DesignStudioStore.getState();

  store.setPan(panX, panY);
  store.setZoom(1);
}
