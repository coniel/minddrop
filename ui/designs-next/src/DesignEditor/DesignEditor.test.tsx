import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs, MinDesignRows } from '@minddrop/designs-next';
import {
  cardDesign_1,
  designElements,
  titleDesignElement,
} from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { DesignEditor } from './DesignEditor';

/**
 * Renders the editor on the fixture design.
 *
 * @returns The render container.
 */
function renderEditor() {
  const { container } = render(<DesignEditor designId={cardDesign_1.id} />);

  return container;
}

/**
 * Returns the fixture design's current elements from the store.
 *
 * @returns The stored elements.
 */
function storedElements() {
  return Designs.get(cardDesign_1.id).elements;
}

describe('DesignEditor', () => {
  beforeEach(() => {
    Designs.load([cardDesign_1]);

    // Pointer capture is not implemented in the test environment
    if (!Element.prototype.setPointerCapture) {
      Element.prototype.setPointerCapture = () => {};
    }
  });

  afterEach(() => {
    cleanup();
    Designs.Store.clear();
  });

  it('renders the block editor and the live render of the design', () => {
    const container = renderEditor();

    expect(
      container.querySelectorAll('.design-block-editor-element'),
    ).toHaveLength(designElements.length);
    expect(container.querySelector('.design-renderer')).not.toBeNull();
  });

  it('renders nothing for a missing design', () => {
    const { container } = render(<DesignEditor designId="design_missing" />);

    expect(container.querySelector('.design-editor')).toBeNull();
  });

  it('hosts the block editor on a canvas with its zoom controls', () => {
    const container = renderEditor();

    expect(
      container.querySelector('.ui-canvas-viewport .design-block-editor'),
    ).not.toBeNull();
    expect(container.querySelector('.ui-canvas-toolbar-zoom')).not.toBeNull();
  });

  it('commits drags to the design on release only', () => {
    const container = renderEditor();
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    // Drag the title right: the block follows, the design waits
    fireEvent.pointerDown(title, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(title, { clientX: 16, clientY: 0 });

    expect(title.style.left).toBe(`${(titleDesignElement.column + 4) * 4}px`);
    expect(
      storedElements().find((element) => element.id === titleDesignElement.id)
        ?.column,
    ).toBe(titleDesignElement.column);

    // Releasing commits the moved element
    fireEvent.pointerUp(title);

    expect(
      storedElements().find((element) => element.id === titleDesignElement.id)
        ?.column,
    ).toBe(titleDesignElement.column + 4);
  });

  it('commits menu changes immediately', () => {
    const container = renderEditor();
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    // Select the title without moving it
    fireEvent.pointerDown(title, { clientX: 0, clientY: 0 });
    fireEvent.pointerUp(title);

    fireEvent.click(screen.getByLabelText('Fixed width, pinned left'));

    expect(
      storedElements().find((element) => element.id === titleDesignElement.id)
        ?.widthMode,
    ).toBe('fixed-left');
  });

  it('removes the selected element from the design on Delete', () => {
    const container = renderEditor();
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    fireEvent.pointerDown(title, { clientX: 0, clientY: 0 });
    fireEvent.pointerUp(title);
    fireEvent.keyDown(document.body, { key: 'Delete' });

    expect(
      storedElements().some((element) => element.id === titleDesignElement.id),
    ).toBe(false);
  });

  it('locks the aspect ratio, deriving the rows from it', () => {
    renderEditor();

    // Pick the 3:2 ratio from the aspect ratio menu
    fireEvent.click(screen.getByText('Auto height'));
    fireEvent.click(screen.getByText('3:2'));

    const design = Designs.get(cardDesign_1.id);

    expect(design.aspectRatio).toBe('3/2');
    expect(design.rows).toBe(cardDesign_1.columns / 1.5);
  });

  it('fits the rows to the content when the aspect ratio is cleared', () => {
    // Lock the design with rows well past its content
    Designs.update(cardDesign_1.id, { aspectRatio: '1/1', rows: 96 });

    renderEditor();

    // Pick auto height from the aspect ratio menu
    fireEvent.click(screen.getByText('Square'));
    fireEvent.click(screen.getByText('Auto height'));

    const design = Designs.get(cardDesign_1.id);

    // The lowest element bottom edge in the fixture layout
    const contentBottom = designElements.reduce(
      (bottom, element) => Math.max(bottom, element.row + element.rowSpan),
      0,
    );

    expect(design.aspectRatio).toBeUndefined();
    expect(design.rows).toBe(Math.max(contentBottom, MinDesignRows));
  });
});
