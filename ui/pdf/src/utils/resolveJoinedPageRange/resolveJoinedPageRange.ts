import { PdfPageRange } from '../../types';

/**
 * Resolves the pages to draw, joined with the previously rendered
 * pages next to them within the keep range.
 *
 * @param previous - The pages rendered before.
 * @param drawn - The pages to draw.
 * @param keepRange - The pages within which drawn pages stay drawn.
 * @returns The pages to render.
 */
export function resolveJoinedPageRange(
  previous: PdfPageRange,
  drawn: PdfPageRange,
  keepRange: PdfPageRange,
): PdfPageRange {
  // Find the previously rendered pages within the keep range
  const retainedFirst = Math.max(previous.first, keepRange.first);
  const retainedLast = Math.min(previous.last, keepRange.last);

  // Check the retained pages exist and adjoin the pages to draw. If
  // not, only the pages to draw are rendered.
  if (
    retainedLast < retainedFirst ||
    retainedLast < drawn.first - 1 ||
    retainedFirst > drawn.last + 1
  ) {
    return drawn;
  }

  // Join the retained pages to the pages to draw
  return {
    first: Math.min(drawn.first, retainedFirst),
    last: Math.max(drawn.last, retainedLast),
  };
}
