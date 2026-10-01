import { afterEach, describe, expect, it } from 'vitest';
import { PdfFixtures } from '../../test-utils';
import { resolveTextSelection } from './resolveTextSelection';

const { pdfViewport_identity } = PdfFixtures;

// The mapping of a real selection's client rects into a page is
// left to end-to-end tests. happy-dom lays nothing out, so a range
// measures no client rects here. A selected range is stubbed to
// measure one line, so that a selection passing the guards resolves
// and the null branches have something to fail against.
const selectedLineRect = { left: 10, top: 20, width: 100, height: 12 };

/**
 * Renders a document column with two page slots, the first holding a
 * rendered page.
 *
 * @returns The column and the text node in each slot.
 */
function renderPages() {
  const pagesElement = document.createElement('div');

  pagesElement.innerHTML = `
    <div data-page-number="1"><div class="pdf-page"><span>First page text</span></div></div>
    <div data-page-number="2"><span>Second page text</span></div>
  `;
  document.body.appendChild(pagesElement);

  return {
    pagesElement,
    firstText: pagesElement.querySelector('[data-page-number="1"] span')!
      .firstChild!,
    secondText: pagesElement.querySelector('[data-page-number="2"] span')!
      .firstChild!,
  };
}

/**
 * Selects from the start of one text node to an offset into another.
 *
 * @param start - The node the selection starts in.
 * @param end - The node the selection ends in.
 * @param endOffset - The offset into the end node.
 * @returns The DOM selection.
 */
function select(start: Node, end: Node, endOffset = 3): Selection {
  const range = document.createRange();
  const selection = window.getSelection()!;

  range.setStart(start, 0);
  range.setEnd(end, endOffset);
  range.getClientRects = () => [selectedLineRect] as unknown as DOMRectList;
  selection.removeAllRanges();
  selection.addRange(range);

  return selection;
}

describe('resolveTextSelection', () => {
  afterEach(() => {
    window.getSelection()?.removeAllRanges();
    document.body.innerHTML = '';
  });

  it('resolves no selection when there is none', () => {
    const { pagesElement } = renderPages();

    expect(
      resolveTextSelection(null, pagesElement, { 1: pdfViewport_identity }),
    ).toBeNull();
  });

  it('resolves no selection from a collapsed one', () => {
    const { pagesElement, firstText } = renderPages();
    const selection = select(firstText, firstText, 0);

    expect(
      resolveTextSelection(selection, pagesElement, {
        1: pdfViewport_identity,
      }),
    ).toBeNull();
  });

  it('resolves no selection from one spanning pages', () => {
    const { pagesElement, firstText, secondText } = renderPages();
    const selection = select(firstText, secondText);

    expect(
      resolveTextSelection(selection, pagesElement, {
        1: pdfViewport_identity,
        2: pdfViewport_identity,
      }),
    ).toBeNull();
  });

  it('resolves no selection on a page which is not rendered', () => {
    const { pagesElement, secondText } = renderPages();
    const selection = select(secondText, secondText);

    expect(
      resolveTextSelection(selection, pagesElement, {
        2: pdfViewport_identity,
      }),
    ).toBeNull();
  });
});
