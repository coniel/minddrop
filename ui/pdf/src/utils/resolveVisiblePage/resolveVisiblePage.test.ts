import { describe, expect, it } from 'vitest';
import { PdfFixtures } from '../../test-utils';
import { resolvePageLayout } from '../resolvePageLayout';
import { resolveVisiblePage } from './resolveVisiblePage';

const { pdfPageSize_portrait } = PdfFixtures;

// Five pages of 1000px, spaced by the page padding
const pageSize = { ...pdfPageSize_portrait, height: 1000 };
const layout = resolvePageLayout(Array(5).fill(pageSize), 1);

describe('resolveVisiblePage', () => {
  it('resolves the page filling the viewport', () => {
    expect(resolveVisiblePage(layout, layout.pages[2].top, 800)).toBe(3);
  });

  it('resolves the page showing the most of itself', () => {
    // The viewport straddles the second and third pages, showing
    // more of the third.
    const scrollTop = layout.pages[2].top - 300;

    expect(resolveVisiblePage(layout, scrollTop, 800)).toBe(3);
  });

  it('resolves the earlier page when two show the same amount', () => {
    // A viewport straddling the boundary between the first and
    // second pages equally, padding included.
    const boundary = layout.pages[1].top - 8;

    expect(resolveVisiblePage(layout, boundary - 400, 800)).toBe(1);
  });

  it('resolves the first page for a document without pages', () => {
    expect(resolveVisiblePage(resolvePageLayout([], 1), 0, 800)).toBe(1);
  });
});
