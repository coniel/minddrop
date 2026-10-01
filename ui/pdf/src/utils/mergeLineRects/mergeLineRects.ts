import { PdfRect } from '@minddrop/pdf';
import { rectsShareLine } from '../rectsShareLine';

/**
 * Merges rects sitting on the same line of text into one rect per
 * line.
 *
 * @param rects - The rects, in PDF user space.
 * @returns One rect per line, in the order the lines were met.
 */
export function mergeLineRects(rects: PdfRect[]): PdfRect[] {
  // The merged rects, one per line met so far
  const lines: PdfRect[] = [];

  // Merge each rect into its line
  rects.forEach((rect) => {
    // Find the line the rect sits on
    const line = lines.find((candidate) => rectsShareLine(candidate, rect));

    // Start a new line when the rect sits on none
    if (!line) {
      lines.push([...rect]);

      return;
    }

    // Grow the line to cover the rect
    line[0] = Math.min(line[0], rect[0]);
    line[1] = Math.min(line[1], rect[1]);
    line[2] = Math.max(line[2], rect[2]);
    line[3] = Math.max(line[3], rect[3]);
  });

  return lines;
}
