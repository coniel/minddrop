import { describe, expect, it } from 'vitest';
import { PagePadding } from '../../constants';
import { PdfFixtures } from '../../test-utils';
import { resolvePageLayout } from './resolvePageLayout';

const { pdfPageSize_landscape, pdfPageSize_portrait } = PdfFixtures;

describe('resolvePageLayout', () => {
  it('stacks the pages with padding around and between them', () => {
    const layout = resolvePageLayout(
      [pdfPageSize_portrait, pdfPageSize_portrait],
      1,
    );

    // Each page is padded above, the last below as well
    const pageStep = pdfPageSize_portrait.height + PagePadding;

    expect(layout.pages[0].top).toBe(PagePadding);
    expect(layout.pages[1].top).toBe(PagePadding + pageStep);
    expect(layout.height).toBe(PagePadding + pageStep * 2);
  });

  it('scales the page rects', () => {
    const layout = resolvePageLayout([pdfPageSize_portrait], 0.5);

    expect(layout.pages[0]).toEqual({
      top: PagePadding,
      width: pdfPageSize_portrait.width / 2,
      height: pdfPageSize_portrait.height / 2,
    });
  });

  it('takes the column width from the widest page', () => {
    const layout = resolvePageLayout(
      [pdfPageSize_portrait, pdfPageSize_landscape],
      1,
    );

    expect(layout.width).toBe(pdfPageSize_landscape.width);
  });

  it('lays out an empty document as padding alone', () => {
    const layout = resolvePageLayout([], 1);

    expect(layout).toEqual({ pages: [], height: PagePadding, width: 0 });
  });
});
