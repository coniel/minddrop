import { resolveRectsBounds, resolveRelativeRect } from '@minddrop/utils';
import { PdfClientRect, PdfHighlight, PdfViewportLike } from '../../types';
import { resolveClientRects } from '../resolveClientRects';

/**
 * Resolves the box a highlight's toolbar floats under, in the
 * document column's CSS pixels.
 *
 * @param highlight - The highlight.
 * @param pagesElement - The element the pages are laid out in, or null while unmounted.
 * @param pageViewports - The viewport each rendered page renders through, keyed by page number.
 * @returns The box, or null while the highlight's page is not rendered.
 */
export function resolveHighlightAnchor(
  highlight: PdfHighlight,
  pagesElement: HTMLDivElement | null,
  pageViewports: Record<number, PdfViewportLike>,
): PdfClientRect | null {
  // The highlight's page, as rendered
  const pageNumber = highlight.page + 1;
  const viewport = pageViewports[pageNumber];
  const slot = pagesElement?.querySelector<HTMLElement>(
    `[data-page-number="${pageNumber}"]`,
  );

  // Check the page is rendered. Otherwise there is no anchor.
  if (!pagesElement || !viewport || !slot) {
    return null;
  }

  // Resolve the highlight's bounds within its page
  const bounds = resolveRectsBounds(
    resolveClientRects(highlight.rects, viewport),
  );

  // Measure the page's place in the column. Its offsets are not read,
  // as they ignore the transform centring it.
  const slotRect = resolveRelativeRect(
    slot.getBoundingClientRect(),
    pagesElement.getBoundingClientRect(),
  );

  // Offset the bounds by the page's place in the column
  return {
    ...bounds,
    left: slotRect.left + bounds.left,
    top: slotRect.top + bounds.top,
  };
}
