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
 * Number of animation frames to wait for layout frames to render
 * before falling back to the default view.
 */
const FIT_VIEW_MAX_ATTEMPTS = 10;

/**
 * Fits all layout frames into the viewport: scales and pans so
 * their union bounding box is centered with padding, never
 * zooming in beyond 100%. A freshly opened design's frames may
 * not have rendered yet, so the frame lookup retries across a
 * few animation frames.
 */
export function resetView(): void {
  fitLayoutsInView(0);
}

/**
 * Implements resetView with a bounded render-wait retry.
 */
function fitLayoutsInView(attempt: number): void {
  const design = DesignStudioStore.getState().design;

  if (!design) {
    DesignStudioStore.getState().resetView();

    return;
  }

  const viewport = document.querySelector(
    '.design-studio-viewport',
  ) as HTMLElement | null;
  const frames = viewport
    ? Array.from(viewport.querySelectorAll<HTMLElement>('.layout-frame'))
    : [];

  // Wait until the viewport is mounted and its rendered frames
  // match the open design's layouts: the viewport mounts alongside
  // the first opened design, a freshly opened design's frames
  // render a moment later, and a previous design's frames may
  // still linger
  const layoutIds = design.layouts.map((layout) => layout.id);
  const renderedIds = frames.map((frame) => frame.dataset.layoutId);
  const framesUpToDate =
    renderedIds.length === layoutIds.length &&
    layoutIds.every((layoutId) => renderedIds.includes(layoutId));

  if (!viewport || !framesUpToDate) {
    if (attempt < FIT_VIEW_MAX_ATTEMPTS) {
      requestAnimationFrame(() => fitLayoutsInView(attempt + 1));
    } else {
      DesignStudioStore.getState().resetView();
    }

    return;
  }

  // The design has no layouts, reset to the default view
  if (!frames.length) {
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
 * Number of animation frames to wait for a newly added layout to
 * render before giving up on centering the view on it.
 */
const CENTER_VIEW_MAX_ATTEMPTS = 10;

/**
 * Centers the viewport on a layout's frame at 100% zoom.
 * Newly added layouts may not have rendered yet, so the frame
 * lookup retries across a few animation frames.
 */
export function centerViewOnLayout(layoutId: string, attempt = 0): void {
  requestAnimationFrame(() => {
    const viewport = document.querySelector(
      '.design-studio-viewport',
    ) as HTMLElement | null;

    if (!viewport) {
      return;
    }

    const frame = viewport.querySelector(
      `.layout-frame[data-layout-id="${layoutId}"]`,
    ) as HTMLElement | null;

    // The layout has not rendered yet, retry on the next frame
    if (!frame) {
      if (attempt < CENTER_VIEW_MAX_ATTEMPTS) {
        centerViewOnLayout(layoutId, attempt + 1);
      }

      return;
    }

    const { x, y } = getFramePosition(frame);
    const store = DesignStudioStore.getState();

    // Pan so the frame's center lands on the viewport's center
    // at 100% zoom
    const panX = viewport.offsetWidth / 2 - (x + frame.offsetWidth / 2);
    const panY = viewport.offsetHeight / 2 - (y + frame.offsetHeight / 2);

    store.setZoom(1);
    store.setPan(panX, panY);
  });
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
