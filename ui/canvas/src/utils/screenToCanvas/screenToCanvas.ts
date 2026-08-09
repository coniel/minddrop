import { CanvasPoint } from '../../types';

/**
 * Converts a viewport-relative point to canvas (un-zoomed)
 * coordinates by undoing the pan and zoom transform.
 *
 * @param point - The point relative to the viewport's top-left corner.
 * @param pan - The current pan offset.
 * @param zoom - The current zoom level.
 * @returns The point in canvas coordinates.
 */
export function screenToCanvas(
  point: CanvasPoint,
  pan: CanvasPoint,
  zoom: number,
): CanvasPoint {
  return {
    x: (point.x - pan.x) / zoom,
    y: (point.y - pan.y) / zoom,
  };
}
