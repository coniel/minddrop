import { Rect } from '../types';

/**
 * Resolves a box relative to a containing box, both given in the
 * same coordinates.
 *
 * @param rect - The box to resolve.
 * @param container - The box to resolve it relative to.
 * @returns The box, relative to the container's top left corner.
 */
export function resolveRelativeRect(rect: Rect, container: Rect): Rect {
  // Offset the box by the container's position
  return {
    left: rect.left - container.left,
    top: rect.top - container.top,
    width: rect.width,
    height: rect.height,
  };
}
