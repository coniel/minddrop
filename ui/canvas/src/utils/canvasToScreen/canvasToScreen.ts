import { CanvasPoint } from '../../types';

/**
 * Converts a point in canvas (un-zoomed) coordinates to a
 * viewport-relative point by applying the pan and zoom transform.
 *
 * @param point - The point in canvas coordinates.
 * @param pan - The current pan offset.
 * @param zoom - The current zoom level.
 * @returns The point relative to the viewport's top-left corner.
 */
export function canvasToScreen(
  point: CanvasPoint,
  pan: CanvasPoint,
  zoom: number,
): CanvasPoint {
  return {
    x: point.x * zoom + pan.x,
    y: point.y * zoom + pan.y,
  };
}
