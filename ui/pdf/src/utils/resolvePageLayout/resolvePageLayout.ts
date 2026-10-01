import { PagePadding } from '../../constants';
import { PdfPageLayout, PdfPageSize } from '../../types';

/**
 * Lays the pages out in a column at the given scale, padded from
 * the column's edges and from each other.
 *
 * @param pageSizes - The size of each page in points, in page order.
 * @param scale - The scale the pages render at, in CSS pixels per point.
 * @returns The column layout.
 */
export function resolvePageLayout(
  pageSizes: PdfPageSize[],
  scale: number,
): PdfPageLayout {
  // The next page's top edge
  let top = PagePadding;
  // The widest page so far
  let width = 0;

  // Place each page below the previous one
  const pages = pageSizes.map((pageSize) => {
    // Build the page's rect at the scale
    const rect = {
      top,
      width: pageSize.width * scale,
      height: pageSize.height * scale,
    };

    // Advance past the page and its padding
    top += rect.height + PagePadding;

    // Widen the column to the page
    width = Math.max(width, rect.width);

    return rect;
  });

  // Build the column, ending at the last page's padding
  return { pages, height: top, width };
}
