import { PdfPageRange } from '../../types';

/**
 * Resolves a page range extended by a number of pages on either side,
 * within the document. An empty range stays empty.
 *
 * @param range - The page range.
 * @param pages - The number of pages to add on either side.
 * @param pageCount - The number of pages in the document.
 * @returns The extended range.
 */
export function resolveExpandedPageRange(
  range: PdfPageRange,
  pages: number,
  pageCount: number,
): PdfPageRange {
  // Check if the range is empty. If so, there is nothing to extend.
  if (range.last < range.first) {
    return range;
  }

  // Extend the range, stopping at the document's ends
  return {
    first: Math.max(range.first - pages, 1),
    last: Math.min(range.last + pages, pageCount),
  };
}
