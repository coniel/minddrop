import { describe, expect, it } from 'vitest';
import { PagePadding, PixelsPerPoint } from '../../constants';
import { PdfFixtures } from '../../test-utils';
import { resolveZoomScale } from './resolveZoomScale';

const { pdfPageSize_portrait } = PdfFixtures;

describe('resolveZoomScale', () => {
  it('scales a numeric zoom from the physical page size', () => {
    expect(resolveZoomScale(2, pdfPageSize_portrait, 1000, 1000)).toBe(
      2 * PixelsPerPoint,
    );
  });

  it('fills the padded viewport width for fit-width', () => {
    const scale = resolveZoomScale(
      'fit-width',
      pdfPageSize_portrait,
      1200,
      500,
    );

    expect(scale * pdfPageSize_portrait.width).toBe(1200 - PagePadding * 2);
  });

  it('fits the whole page in the viewport for fit-page', () => {
    // A wide viewport, where the height is the limiting axis
    const scale = resolveZoomScale('fit-page', pdfPageSize_portrait, 1200, 500);

    expect(scale * pdfPageSize_portrait.height).toBe(500 - PagePadding * 2);
  });

  it('limits fit-page by the width when the viewport is narrow', () => {
    const scale = resolveZoomScale('fit-page', pdfPageSize_portrait, 400, 2000);

    expect(scale * pdfPageSize_portrait.width).toBe(400 - PagePadding * 2);
  });

  it('never resolves a negative fit scale for a viewport smaller than the padding', () => {
    expect(resolveZoomScale('fit-width', pdfPageSize_portrait, 10, 10)).toBe(0);
  });
});
