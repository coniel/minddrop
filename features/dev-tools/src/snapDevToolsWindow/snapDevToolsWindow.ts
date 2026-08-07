import { setDevToolsWindowRect } from '../setDevToolsWindowRect';
import { DevToolsWindowSnapSide } from '../types';
import { clampWindowRect, getSnappedWindowRect } from '../utils';

/**
 * Snaps the floating dev tools window to a side of the app window,
 * filling its full height.
 *
 * @param side - The side to snap to.
 */
export function snapDevToolsWindow(side: DevToolsWindowSnapSide): void {
  const viewport = { width: window.innerWidth, height: window.innerHeight };

  // Clamped in case the app window is narrower than the snapped width
  setDevToolsWindowRect(
    clampWindowRect(getSnappedWindowRect(side, viewport), viewport),
  );
}
