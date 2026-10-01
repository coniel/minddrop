import { Rect } from '../types';

/**
 * Resolves the box bounding a set of boxes.
 *
 * @param rects - The boxes to bound. At least one.
 * @returns The bounding box.
 */
export function resolveRectsBounds(rects: Rect[]): Rect {
  // Find the outermost edges
  const left = Math.min(...rects.map((rect) => rect.left));
  const top = Math.min(...rects.map((rect) => rect.top));
  const right = Math.max(...rects.map((rect) => rect.left + rect.width));
  const bottom = Math.max(...rects.map((rect) => rect.top + rect.height));

  // Build the box between them
  return { left, top, width: right - left, height: bottom - top };
}
