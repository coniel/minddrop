import { PdfColumnBand, PdfPageLayout, PdfPageRange } from '../../types';

/**
 * Resolves the pages overlapping a band of the document column.
 * Resolves an empty range when no page overlaps the band. Its last
 * page is then before its first.
 *
 * @param layout - The page layout.
 * @param band - The band of the document column.
 * @returns The range of pages overlapping the band.
 */
export function resolveBandPageRange(
  layout: PdfPageLayout,
  band: PdfColumnBand,
): PdfPageRange {
  // The range's bounds as page indexes, empty until a page is met
  let first = 0;
  let last = -1;

  // Extend the range over each page in the band
  layout.pages.forEach((page, index) => {
    // Check whether the page overlaps the band
    const inBand =
      page.top + page.height >= band.top && page.top <= band.bottom;

    // Skip pages outside the band
    if (!inBand) {
      return;
    }

    // Start the range at the first page in the band
    if (last === -1) {
      first = index;
    }

    // End the range at the page
    last = index;
  });

  // Convert the indexes to page numbers
  return { first: first + 1, last: last + 1 };
}
