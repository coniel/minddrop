import { describe, expect, it } from 'vitest';
import { PdfFixtures } from '../../test-utils';
import { resolvePdfRects } from './resolvePdfRects';

const { pdfViewport_scaled } = PdfFixtures;

// The page element sits offset in the document
const pageRect = { left: 100, top: 50, width: 1200, height: 1600 };

describe('resolvePdfRects', () => {
  it('maps client rects relative to the page into PDF user space', () => {
    const rects = resolvePdfRects(
      [{ left: 120, top: 70, width: 200, height: 24 }],
      pageRect,
      pdfViewport_scaled,
    );

    // 20px in at 2x is 10 points; 20px down from an 800pt page's
    // top is 790 points, the rect's upper edge.
    expect(rects).toEqual([[10, 778, 110, 790]]);
  });

  it('merges the fragments of one line', () => {
    const rects = resolvePdfRects(
      [
        { left: 120, top: 70, width: 200, height: 24 },
        { left: 320, top: 70, width: 100, height: 24 },
      ],
      pageRect,
      pdfViewport_scaled,
    );

    expect(rects).toEqual([[10, 778, 160, 790]]);
  });

  it('drops empty rects', () => {
    const rects = resolvePdfRects(
      [
        { left: 120, top: 70, width: 0, height: 24 },
        { left: 120, top: 70, width: 200, height: 24 },
      ],
      pageRect,
      pdfViewport_scaled,
    );

    expect(rects).toHaveLength(1);
  });
});
