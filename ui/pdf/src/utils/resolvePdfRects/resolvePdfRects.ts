import { PdfRect } from '@minddrop/pdf';
import { normalizeRect } from '@minddrop/utils';
import { PdfClientRect, PdfViewportLike } from '../../types';
import { mergeLineRects } from '../mergeLineRects';

/**
 * Resolves client rects on a rendered page to rects in PDF user
 * space, one per line. Empty rects are dropped.
 *
 * @param clientRects - The client rects.
 * @param pageRect - The page element's client rect.
 * @param viewport - The viewport the page renders through.
 * @returns The rects in PDF user space, one per line.
 */
export function resolvePdfRects(
  clientRects: PdfClientRect[],
  pageRect: PdfClientRect,
  viewport: PdfViewportLike,
): PdfRect[] {
  // Map each non-empty rect through the viewport
  const rects = clientRects
    .filter((rect) => rect.width > 0 && rect.height > 0)
    .map((rect) => {
      // Take the rect's corner relative to the page
      const left = rect.left - pageRect.left;
      const top = rect.top - pageRect.top;

      // Map the corners to PDF user space
      const [x1, y1] = viewport.convertToPdfPoint(left, top);
      const [x2, y2] = viewport.convertToPdfPoint(
        left + rect.width,
        top + rect.height,
      );

      // Order the corners
      return normalizeRect([x1, y1, x2, y2]);
    });

  // Merge the rects into one per line
  return mergeLineRects(rects);
}
