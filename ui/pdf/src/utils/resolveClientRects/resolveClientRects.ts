import { PdfRect } from '@minddrop/pdf';
import { normalizeRect } from '@minddrop/utils';
import { PdfClientRect, PdfViewportLike } from '../../types';

/**
 * Resolves rects in PDF user space to client rects in the page's
 * rendered pixels, relative to the page's top left corner.
 *
 * @param rects - The rects in PDF user space.
 * @param viewport - The viewport the page renders through.
 * @returns The client rects, in the rects' order.
 */
export function resolveClientRects(
  rects: PdfRect[],
  viewport: PdfViewportLike,
): PdfClientRect[] {
  // Map each rect through the viewport
  return rects.map((rect) => {
    // Order the mapped corners into a box, as the viewport flips the
    // y axis.
    const [left, top, right, bottom] = normalizeRect(
      viewport.convertToViewportRectangle(rect),
    );

    // Build the box
    return { left, top, width: right - left, height: bottom - top };
  });
}
