import { DrawPageOverscan, KeepPageOverscan } from '../../constants';
import { PdfPageLayout, PdfPageRange } from '../../types';
import { resolveBandPageRange } from '../resolveBandPageRange';
import { resolveExpandedPageRange } from '../resolveExpandedPageRange';
import { resolveJoinedPageRange } from '../resolveJoinedPageRange';

/**
 * Resolves the pages to render for a scroll position: the pages within
 * `DrawPageOverscan` pages of the pages in view, joined with the
 * previously rendered pages next to them within `KeepPageOverscan`
 * pages. Returns the previous range itself when the pages are the
 * same.
 *
 * @param layout - The page layout.
 * @param scrollTop - The viewport's scroll offset, in CSS pixels.
 * @param viewportHeight - The viewport's height, in CSS pixels.
 * @param previous - The pages rendered before.
 * @returns The pages to render.
 */
export function resolveRenderedPageRange(
  layout: PdfPageLayout,
  scrollTop: number,
  viewportHeight: number,
  previous: PdfPageRange,
): PdfPageRange {
  // Resolve the pages in view
  const inView = resolveBandPageRange(layout, {
    top: scrollTop,
    bottom: scrollTop + viewportHeight,
  });

  // Resolve the pages to draw and the pages within which drawn pages
  // stay drawn.
  const pageCount = layout.pages.length;
  const drawn = resolveExpandedPageRange(inView, DrawPageOverscan, pageCount);
  const keepRange = resolveExpandedPageRange(
    inView,
    KeepPageOverscan,
    pageCount,
  );

  // Join the pages to draw with the previously rendered pages
  const next = resolveJoinedPageRange(previous, drawn, keepRange);

  // Return the previous range when the pages are the same
  return next.first === previous.first && next.last === previous.last
    ? previous
    : next;
}
