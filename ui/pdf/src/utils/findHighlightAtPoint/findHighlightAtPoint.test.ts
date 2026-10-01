import { describe, expect, it } from 'vitest';
import { PdfFixtures } from '../../test-utils';
import { PdfHighlight } from '../../types';
import { findHighlightAtPoint } from './findHighlightAtPoint';

const { pdfHighlight_1, pdfHighlight_2, pdfViewport_identity } = PdfFixtures;

// Two highlights overlapping on one line
const first: PdfHighlight = { ...pdfHighlight_1, rects: [[10, 10, 100, 30]] };
const second: PdfHighlight = {
  ...pdfHighlight_2,
  page: pdfHighlight_1.page,
  rects: [[50, 10, 150, 30]],
};

describe('findHighlightAtPoint', () => {
  it('finds the highlight under the point', () => {
    expect(
      findHighlightAtPoint([first, second], pdfViewport_identity, 20, 20),
    ).toBe(first);
  });

  it('prefers the later highlight where they overlap', () => {
    expect(
      findHighlightAtPoint([first, second], pdfViewport_identity, 75, 20),
    ).toBe(second);
  });

  it('finds nothing off every highlight', () => {
    expect(
      findHighlightAtPoint([first, second], pdfViewport_identity, 200, 200),
    ).toBeNull();
  });
});
