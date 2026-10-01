import { describe, expect, it } from 'vitest';
import { PdfFixtures } from '../../test-utils';
import { resolveClientRects } from './resolveClientRects';

const { pdfPageSize_portrait, pdfViewportScale, pdfViewport_scaled } =
  PdfFixtures;

describe('resolveClientRects', () => {
  it('resolves client rects with their top left corner first', () => {
    // The viewport flips the y axis, so the mapped corners come
    // back out of order.
    expect(
      resolveClientRects([[10, 578, 110, 590]], pdfViewport_scaled),
    ).toEqual([
      {
        left: 10 * pdfViewportScale,
        top: (pdfPageSize_portrait.height - 590) * pdfViewportScale,
        width: 100 * pdfViewportScale,
        height: 12 * pdfViewportScale,
      },
    ]);
  });
});
