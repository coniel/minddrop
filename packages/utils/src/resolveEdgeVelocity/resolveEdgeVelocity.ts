import { clamp } from '../clamp';

export interface EdgeScrollOptions {
  /**
   * Width, in pixels, of the zones along the element's edges which
   * scroll it.
   */
  edgeSize: number;

  /**
   * Scroll speed, in pixels per frame, at the deepest point of an
   * edge zone and past the element's bounds.
   */
  maxSpeed: number;
}

/**
 * Resolves the scroll velocity along one axis from a position's
 * depth into an element's edge zones. The velocity ramps up with
 * proximity to the edge. Positions past the element's bounds scroll
 * at full speed.
 *
 * @param position - The pointer position along the axis.
 * @param start - The element's leading edge along the axis.
 * @param end - The element's trailing edge along the axis.
 * @param options - The edge zones' width and top speed.
 * @returns The velocity in pixels per frame, zero outside the edge zones.
 */
export function resolveEdgeVelocity(
  position: number,
  start: number,
  end: number,
  options: EdgeScrollOptions,
): number {
  const { edgeSize, maxSpeed } = options;

  // Scroll backwards by the depth into the leading edge zone
  if (position < start + edgeSize) {
    return -maxSpeed * clamp(1 - (position - start) / edgeSize, 0, 1);
  }

  // Scroll forwards by the depth into the trailing edge zone
  if (position > end - edgeSize) {
    return maxSpeed * clamp(1 - (end - position) / edgeSize, 0, 1);
  }

  // No scroll outside the edge zones
  return 0;
}
