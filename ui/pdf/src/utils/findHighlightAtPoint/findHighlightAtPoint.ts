import { isPointInRect } from '@minddrop/utils';
import { PdfHighlight, PdfViewportLike } from '../../types';
import { resolveClientRects } from '../resolveClientRects';

/**
 * Finds the highlight under a point on a rendered page, the last
 * drawn one when several overlap.
 *
 * @param highlights - The page's highlights.
 * @param viewport - The viewport the page renders through.
 * @param x - The point's distance from the page's left edge, in CSS pixels.
 * @param y - The point's distance from the page's top edge, in CSS pixels.
 * @returns The highlight under the point, or null.
 */
export function findHighlightAtPoint(
  highlights: PdfHighlight[],
  viewport: PdfViewportLike,
  x: number,
  y: number,
): PdfHighlight | null {
  // Find the last drawn highlight with a line under the point
  const hit = [...highlights]
    .reverse()
    .find((highlight) =>
      resolveClientRects(highlight.rects, viewport).some((rect) =>
        isPointInRect({ x, y }, rect),
      ),
    );

  return hit ?? null;
}
