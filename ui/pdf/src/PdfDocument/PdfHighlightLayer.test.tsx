import { afterEach, describe, expect, it } from 'vitest';
import { render } from '@minddrop/test-utils';
import { resolveColorLevel } from '@minddrop/ui-theme';
import { PdfFixtures, cleanup } from '../test-utils';
import { PdfHighlightLayer } from './PdfHighlightLayer';

const {
  pdfHighlight_1,
  pdfPageSize_portrait,
  pdfViewportScale,
  pdfViewport_scaled,
} = PdfFixtures;

describe('<PdfHighlightLayer />', () => {
  afterEach(cleanup);

  it('draws one box per highlighted line, placed through the viewport', () => {
    const { container } = render(
      <PdfHighlightLayer
        highlights={[pdfHighlight_1]}
        viewport={pdfViewport_scaled}
      />,
    );

    const boxes = container.querySelectorAll<HTMLElement>('.pdf-highlight');

    // The first highlighted line
    const [x1, y1, x2, y2] = pdfHighlight_1.rects[0];

    // Placed through the viewport, scaled and measured down from the
    // page's top.
    expect(boxes).toHaveLength(pdfHighlight_1.rects.length);
    expect(boxes[0].style.getPropertyValue('--pdf-highlight-left')).toBe(
      `${x1 * pdfViewportScale}px`,
    );
    expect(boxes[0].style.getPropertyValue('--pdf-highlight-top')).toBe(
      `${(pdfPageSize_portrait.height - y2) * pdfViewportScale}px`,
    );
    expect(boxes[0].style.getPropertyValue('--pdf-highlight-width')).toBe(
      `${(x2 - x1) * pdfViewportScale}px`,
    );
    expect(boxes[0].style.getPropertyValue('--pdf-highlight-height')).toBe(
      `${(y2 - y1) * pdfViewportScale}px`,
    );
  });

  it('tints the boxes in the highlight colour', () => {
    const { container } = render(
      <PdfHighlightLayer
        highlights={[pdfHighlight_1]}
        viewport={pdfViewport_scaled}
      />,
    );

    const box = container.querySelector<HTMLElement>('.pdf-highlight')!;

    expect(box.style.getPropertyValue('--pdf-highlight-color')).toBe(
      resolveColorLevel(pdfHighlight_1.color, 500),
    );
  });

  it('emphasises the selected highlight', () => {
    const { container } = render(
      <PdfHighlightLayer
        highlights={[pdfHighlight_1]}
        viewport={pdfViewport_scaled}
        selectedId={pdfHighlight_1.id}
      />,
    );

    expect(container.querySelector('.pdf-highlight')).toHaveClass(
      'pdf-highlight-selected',
    );
  });
});
