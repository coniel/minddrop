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

/** Padding around the fitted frames, in viewport pixels. */
const FIT_PADDING = 64;

/**
 * Fits all layout frames into the viewport: scales and pans so
 * their union bounding box is centered with padding, never
 * zooming in beyond 100%.
 */
export function resetView(): void {
  const viewport = document.querySelector(
    '.design-studio-viewport',
  ) as HTMLElement | null;
  const frames = viewport
    ? Array.from(viewport.querySelectorAll<HTMLElement>('.layout-frame'))
    : [];

  if (!viewport || !frames.length) {
    DesignStudioStore.getState().resetView();

    return;
  }

  // Union bounding box of all frames in canvas (un-zoomed) coordinates
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  frames.forEach((frame) => {
    const { x, y } = getFramePosition(frame);

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + frame.offsetWidth);
    maxY = Math.max(maxY, y + frame.offsetHeight);
  });

  const boundsWidth = maxX - minX;
  const boundsHeight = maxY - minY;
  const viewportWidth = viewport.offsetWidth;
  const viewportHeight = viewport.offsetHeight;

  // Largest zoom that fits the bounds plus padding, capped at
  // 100% and clamped to the store's minimum zoom
  const zoom = Math.max(
    0.1,
    Math.min(
      1,
      (viewportWidth - FIT_PADDING * 2) / boundsWidth,
      (viewportHeight - FIT_PADDING * 2) / boundsHeight,
    ),
  );

  // Pan to center the bounds in the viewport
  const panX = (viewportWidth - boundsWidth * zoom) / 2 - minX * zoom;
  const panY = (viewportHeight - boundsHeight * zoom) / 2 - minY * zoom;

  const store = DesignStudioStore.getState();

  store.setZoom(zoom);
  store.setPan(panX, panY);
}

/**
 * Reads a frame's position in canvas coordinates from its inline
 * translate transform.
 */
function getFramePosition(frame: HTMLElement): { x: number; y: number } {
  const match = frame.style.transform.match(
    /translate\(([^,]+)px,\s*([^)]+)px\)/,
  );

  return {
    x: match ? parseFloat(match[1]) : 0,
    y: match ? parseFloat(match[2]) : 0,
  };
}
