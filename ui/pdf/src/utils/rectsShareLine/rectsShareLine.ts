import { PdfRect } from '@minddrop/pdf';

/**
 * Checks whether two rects sit on the same line of text. They do
 * when their vertical overlap exceeds half the height of the shorter
 * one.
 *
 * @param first - The first rect, in PDF user space.
 * @param second - The second rect, in PDF user space.
 * @returns Whether the rects share a line.
 */
export function rectsShareLine(first: PdfRect, second: PdfRect): boolean {
  // Measure the vertical overlap
  const overlap = Math.min(first[3], second[3]) - Math.max(first[1], second[1]);

  // Measure the shorter height
  const shortest = Math.min(first[3] - first[1], second[3] - second[1]);

  // Compare the overlap with half the shorter height
  return overlap > shortest / 2;
}
