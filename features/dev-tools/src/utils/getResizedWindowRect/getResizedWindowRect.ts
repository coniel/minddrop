import { MinWindowSize } from '../../constants';
import { DevToolsWindowRect, DevToolsWindowResizeEdge } from '../../types';

/**
 * Calculates the window rect resulting from dragging one of the
 * dev tools window's resize edges by a given distance.
 *
 * The dragged edge stops at the edge of the viewport, leaving the
 * opposite edge where it is.
 *
 * @param rect - The window rect at the start of the drag.
 * @param edge - The edge being dragged.
 * @param delta - The distance dragged along both axes.
 * @param viewport - The app window's inner width and height.
 * @returns The resized window rect.
 */
export function getResizedWindowRect(
  rect: DevToolsWindowRect,
  edge: DevToolsWindowResizeEdge,
  delta: { x: number; y: number },
  viewport: { width: number; height: number },
): DevToolsWindowRect {
  let { x, y, width, height } = rect;

  // Dragging the east edge grows the window rightwards, stopping
  // at the right of the viewport
  if (edge.includes('e')) {
    width = Math.max(
      MinWindowSize.width,
      Math.min(rect.width + delta.x, viewport.width - rect.x),
    );
  }

  // Dragging the south edge grows the window downwards, stopping
  // at the bottom of the viewport
  if (edge.includes('s')) {
    height = Math.max(
      MinWindowSize.height,
      Math.min(rect.height + delta.y, viewport.height - rect.y),
    );
  }

  // Dragging the west edge moves the left of the window, keeping
  // the right edge in place and stopping at the left of the viewport
  if (edge.includes('w')) {
    const right = rect.x + rect.width;

    x = Math.min(Math.max(rect.x + delta.x, 0), right - MinWindowSize.width);
    width = right - x;
  }

  // Dragging the north edge moves the top of the window, keeping
  // the bottom edge in place and stopping at the top of the viewport
  if (edge.includes('n')) {
    const bottom = rect.y + rect.height;

    y = Math.min(Math.max(rect.y + delta.y, 0), bottom - MinWindowSize.height);
    height = bottom - y;
  }

  return { x, y, width, height };
}
