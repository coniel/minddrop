import { describe, expect, it } from 'vitest';
import { PdfFixtures } from '../../test-utils';
import { resolvePageLayout } from '../resolvePageLayout';
import { resolveBandPageRange } from './resolveBandPageRange';

const { pdfPageSize_portrait } = PdfFixtures;

// Ten pages of 1000px, spaced by the page padding
const pageSize = { ...pdfPageSize_portrait, height: 1000 };
const layout = resolvePageLayout(Array(10).fill(pageSize), 1);

describe('resolveBandPageRange', () => {
  it('resolves the pages overlapping the band', () => {
    // Resolve the pages in a band from the middle of the fourth page
    // to the middle of the sixth.
    const range = resolveBandPageRange(layout, {
      top: layout.pages[3].top + 500,
      bottom: layout.pages[5].top + 500,
    });

    expect(range).toEqual({ first: 4, last: 6 });
  });

  it('stops at the ends of the document', () => {
    expect(
      resolveBandPageRange(layout, {
        top: -1000,
        bottom: layout.height + 1000,
      }),
    ).toEqual({ first: 1, last: 10 });
  });

  it('resolves an empty range for a band below the last page', () => {
    const range = resolveBandPageRange(layout, {
      top: layout.height + 1000,
      bottom: layout.height + 2000,
    });

    expect(range.last).toBeLessThan(range.first);
  });

  it('resolves an empty range for a document without pages', () => {
    const range = resolveBandPageRange(resolvePageLayout([], 1), {
      top: 0,
      bottom: 1000,
    });

    expect(range.last).toBeLessThan(range.first);
  });
});
