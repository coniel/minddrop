import { PdfPageLayout } from '../../types';

/**
 * Resolves the page the viewer is on for a scroll position. This is
 * the page showing the most of itself in the viewport, or the
 * earlier one when two show the same amount. Resolves the first page
 * for a layout without pages.
 *
 * @param layout - The page layout.
 * @param scrollTop - The viewport's scroll offset, in CSS pixels.
 * @param viewportHeight - The viewport's height, in CSS pixels.
 * @returns The visible page, 1-based.
 */
export function resolveVisiblePage(
  layout: PdfPageLayout,
  scrollTop: number,
  viewportHeight: number,
): number {
  // Measure the viewport's bottom edge
  const viewportBottom = scrollTop + viewportHeight;

  // The page showing the most so far
  let visiblePage = 1;
  // How much of it shows
  let largestOverlap = 0;

  // Find the page showing the most of itself
  layout.pages.forEach((page, index) => {
    // Measure the height of the page within the viewport
    const overlap =
      Math.min(page.top + page.height, viewportBottom) -
      Math.max(page.top, scrollTop);

    // Take the page when it shows more than the best so far
    if (overlap > largestOverlap) {
      largestOverlap = overlap;
      visiblePage = index + 1;
    }
  });

  return visiblePage;
}
