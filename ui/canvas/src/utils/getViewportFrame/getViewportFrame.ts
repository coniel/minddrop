import { CanvasNodeFrame, CanvasPoint, CanvasViewportSize } from '../../types';
import { screenToCanvas } from '../screenToCanvas';

/**
 * Returns the area the viewport shows, in canvas coordinates, or
 * null when the viewport has not been measured yet.
 *
 * @param pan - The canvas pan offset in pixels.
 * @param zoom - The canvas zoom level.
 * @param size - The measured viewport size.
 * @returns The visible canvas area.
 */
export function getViewportFrame(
  pan: CanvasPoint,
  zoom: number,
  size: CanvasViewportSize,
): CanvasNodeFrame | null {
  // The viewport has not mounted, so nothing is known to be
  // visible
  if (!size.width || !size.height) {
    return null;
  }

  // The viewport's top left corner in canvas coordinates
  const origin = screenToCanvas({ x: 0, y: 0 }, pan, zoom);

  return {
    x: origin.x,
    y: origin.y,
    width: size.width / zoom,
    height: size.height / zoom,
  };
}
