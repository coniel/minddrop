import { ZoomPresets } from '../../constants';

/**
 * Resolves the zoom preset one step from the given zoom in a
 * direction.
 *
 * @param zoom - The current zoom, as a multiple of the physical page size.
 * @param direction - Whether to step in or out.
 * @returns The stepped zoom, or null when no preset lies in the direction.
 */
export function resolveZoomStep(
  zoom: number,
  direction: 'in' | 'out',
): number | null {
  // Find the nearest preset above the zoom
  if (direction === 'in') {
    return ZoomPresets.find((preset) => preset > zoom) ?? null;
  }

  // Find the nearest preset below the zoom
  return [...ZoomPresets].reverse().find((preset) => preset < zoom) ?? null;
}
