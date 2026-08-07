import { SnappedWindowGap, SnappedWindowWidth } from '../../constants';
import { DevToolsWindowRect, DevToolsWindowSnapSide } from '../../types';

/**
 * Calculates the window rect for the dev tools window snapped to
 * a side of the app window, filling its full height.
 *
 * @param side - The side to snap to.
 * @param viewport - The app window's inner width and height.
 * @returns The snapped window rect.
 */
export function getSnappedWindowRect(
  side: DevToolsWindowSnapSide,
  viewport: { width: number; height: number },
): DevToolsWindowRect {
  // Leave a gap above and below the window
  const height = viewport.height - SnappedWindowGap * 2;

  // Snapped to the left, the window sits a gap in from the left edge
  if (side === 'left') {
    return {
      x: SnappedWindowGap,
      y: SnappedWindowGap,
      width: SnappedWindowWidth,
      height,
    };
  }

  return {
    x: viewport.width - SnappedWindowWidth - SnappedWindowGap,
    y: SnappedWindowGap,
    width: SnappedWindowWidth,
    height,
  };
}
