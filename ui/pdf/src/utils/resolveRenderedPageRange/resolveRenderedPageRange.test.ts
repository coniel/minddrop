import { describe, expect, it } from 'vitest';
import { DrawPageOverscan, KeepPageOverscan } from '../../constants';
import { PdfFixtures } from '../../test-utils';
import { resolvePageLayout } from '../resolvePageLayout';
import { resolveRenderedPageRange } from './resolveRenderedPageRange';

const { pdfPageSize_portrait } = PdfFixtures;

// Twenty pages of 1000px, spaced by the page padding
const pageSize = { ...pdfPageSize_portrait, height: 1000 };
const layout = resolvePageLayout(Array(20).fill(pageSize), 1);

// The empty range rendered before any page
const none = { first: 1, last: 0 };

/**
 * Resolves the scroll offset showing a page's top at the viewport's
 * top.
 *
 * @param pageNumber - The page number, 1-based.
 * @returns The scroll offset.
 */
function scrollTopOf(pageNumber: number): number {
  return layout.pages[pageNumber - 1].top;
}

describe('resolveRenderedPageRange', () => {
  it('draws the pages within the overscan of the pages in view', () => {
    // Show page 10 alone in a 1000px viewport
    expect(
      resolveRenderedPageRange(layout, scrollTopOf(10), 1000, none),
    ).toEqual({
      first: 10 - DrawPageOverscan,
      last: 10 + DrawPageOverscan,
    });
  });

  it('keeps the pages left behind drawn within the keep overscan', () => {
    // Render around page 10, then scroll down one page
    const previous = resolveRenderedPageRange(
      layout,
      scrollTopOf(10),
      1000,
      none,
    );

    expect(
      resolveRenderedPageRange(layout, scrollTopOf(11), 1000, previous),
    ).toEqual({
      first: Math.max(previous.first, 11 - KeepPageOverscan),
      last: 11 + DrawPageOverscan,
    });
  });

  it('returns the previous range itself when the pages are the same', () => {
    const previous = resolveRenderedPageRange(
      layout,
      scrollTopOf(10),
      1000,
      none,
    );

    expect(
      resolveRenderedPageRange(layout, scrollTopOf(10) + 10, 1000, previous),
    ).toBe(previous);
  });
});
