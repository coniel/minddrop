import { MinWindowSize } from '../../constants';
import { DevToolsWindowRect } from '../../types';

/**
 * Confines a window rect to the viewport, shrinking it when it is
 * larger than the viewport and moving it back in when it hangs
 * over an edge.
 *
 * The window is never shrunk below its minimum size, so it can
 * overhang a viewport smaller than that.
 *
 * @param rect - The window rect to confine.
 * @param viewport - The app window's inner width and height.
 * @returns The confined window rect.
 */
export function clampWindowRect(
  rect: DevToolsWindowRect,
  viewport: { width: number; height: number },
): DevToolsWindowRect {
  // Fit the size to the viewport before positioning, so that an
  // oversized window is shrunk rather than pushed off screen
  const width = Math.max(
    MinWindowSize.width,
    Math.min(rect.width, viewport.width),
  );
  const height = Math.max(
    MinWindowSize.height,
    Math.min(rect.height, viewport.height),
  );

  // Keep both edges of each axis within the viewport
  const x = Math.min(Math.max(rect.x, 0), Math.max(viewport.width - width, 0));
  const y = Math.min(
    Math.max(rect.y, 0),
    Math.max(viewport.height - height, 0),
  );

  return { x, y, width, height };
}
