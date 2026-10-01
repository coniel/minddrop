import { afterEach, describe, expect, it } from 'vitest';
import { resolveRectsBounds } from '@minddrop/utils';
import { PdfFixtures } from '../../test-utils';
import { resolveClientRects } from '../resolveClientRects';
import { resolveHighlightAnchor } from './resolveHighlightAnchor';

const { pdfHighlight_1, pdfViewport_identity } = PdfFixtures;

// Where the highlight's page slot is measured in the column
const slotRect = { left: 100, top: 200, width: 600, height: 800 };

/**
 * Renders a document column holding the highlight's page slot at
 * the measured position.
 *
 * @returns The column.
 */
function renderPages() {
  const pagesElement = document.createElement('div');
  const slot = document.createElement('div');

  slot.dataset.pageNumber = `${pdfHighlight_1.page + 1}`;
  slot.getBoundingClientRect = () => ({ ...slotRect, ...DOMRectMethods });
  pagesElement.appendChild(slot);
  document.body.appendChild(pagesElement);

  return pagesElement;
}

// The rest of a DOMRect, as the stubbed measurement's shape
const DOMRectMethods = {
  x: 0,
  y: 0,
  right: 0,
  bottom: 0,
  toJSON: () => ({}),
};

describe('resolveHighlightAnchor', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('resolves no anchor while the page is not rendered', () => {
    const pagesElement = renderPages();

    expect(resolveHighlightAnchor(pdfHighlight_1, pagesElement, {})).toBeNull();
  });

  it("offsets the highlight's bounds by the page's place in the column", () => {
    const pagesElement = renderPages();

    // The highlight's bounds within its page
    const bounds = resolveRectsBounds(
      resolveClientRects(pdfHighlight_1.rects, pdfViewport_identity),
    );

    expect(
      resolveHighlightAnchor(pdfHighlight_1, pagesElement, {
        [pdfHighlight_1.page + 1]: pdfViewport_identity,
      }),
    ).toEqual({
      ...bounds,
      left: slotRect.left + bounds.left,
      top: slotRect.top + bounds.top,
    });
  });
});
