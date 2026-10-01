import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import {
  cardDesign_1,
  designElements,
  pageDesign_1,
  titleDesignElement,
} from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cleanup } from '../test-utils';
import { DesignEditor } from './DesignEditor';

/**
 * Renders the editor on a fixture design.
 *
 * @param designId - The design to edit, the card fixture by default.
 * @returns The render container.
 */
function renderEditor(designId = cardDesign_1.id) {
  const { container } = render(<DesignEditor designId={designId} />);

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

const { workspace_1 } = WorkspaceFixtures;

describe('DesignEditor', () => {
  beforeEach(() => {
    Designs.load([cardDesign_1, pageDesign_1], workspace_1.id);

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

    fireEvent.click(screen.getByLabelText('Width'));
    fireEvent.click(screen.getByLabelText('designsNext.pin.label.left'));

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
    expect(design.rows).toBe(
      Math.max(contentBottom, Designs.constants.MinRows),
    );
  });

  it('keeps card designs on the canvas, offering an aspect ratio', () => {
    const container = renderEditor();

    expect(container.querySelectorAll('.ui-canvas-viewport')).toHaveLength(2);
    expect(screen.getByText('Auto height')).toBeInTheDocument();
    expect(screen.queryByLabelText('Fill pane')).toBeNull();
  });

  it('opens page designs filling both panes, without an aspect ratio', () => {
    const container = renderEditor(pageDesign_1.id);

    expect(container.querySelector('.ui-canvas-viewport')).toBeNull();
    expect(
      container.querySelector('.design-canvas-pane-filled .design-renderer'),
    ).not.toBeNull();
    expect(screen.queryByText('Auto height')).toBeNull();
    expect(screen.queryByLabelText('Regular')).toBeNull();
  });

  it('switches both panes of a page design to the canvas', () => {
    const container = renderEditor(pageDesign_1.id);

    fireEvent.click(screen.getByLabelText('Show on canvas'));

    expect(container.querySelectorAll('.ui-canvas-viewport')).toHaveLength(2);
    expect(container.querySelector('.design-canvas-pane-filled')).toBeNull();
  });

  it('switches both panes of a page design back to filling them', () => {
    const container = renderEditor(pageDesign_1.id);

    fireEvent.click(screen.getByLabelText('Show on canvas'));
    fireEvent.click(screen.getByLabelText('Fill pane'));

    expect(container.querySelector('.ui-canvas-viewport')).toBeNull();
    expect(
      container.querySelectorAll('.design-canvas-pane-filled'),
    ).toHaveLength(2);
  });

  it('caps page designs at the picked content width', () => {
    renderEditor(pageDesign_1.id);

    fireEvent.click(screen.getByLabelText('Content width'));
    fireEvent.click(screen.getByLabelText('Narrow'));

    const design = Designs.get(pageDesign_1.id);

    expect(design.contentWidth).toBe('narrow');
    expect(design.columns).toBe(Designs.constants.ContentWidthColumns.narrow);
  });

  it('sets the side padding of page designs from the padding scale', () => {
    renderEditor(pageDesign_1.id);

    fireEvent.click(screen.getByLabelText('Content width'));
    fireEvent.click(screen.getByLabelText('XL'));

    expect(Designs.get(pageDesign_1.id).sidePadding).toBe(
      Designs.constants.PaddingSizes.xl,
    );
  });

  it('returns page designs to full width', async () => {
    await Designs.setContentWidth(pageDesign_1.id, 'narrow');

    renderEditor(pageDesign_1.id);

    fireEvent.click(screen.getByLabelText('Content width'));
    fireEvent.click(screen.getByLabelText('Full'));

    const design = Designs.get(pageDesign_1.id);

    expect(design.contentWidth).toBeUndefined();
    expect(design.columns).toBe(Designs.constants.TypeColumns.page);
  });

  it('clears the side padding of page designs from the None option', () => {
    Designs.update(pageDesign_1.id, { sidePadding: 16 });

    renderEditor(pageDesign_1.id);

    fireEvent.click(screen.getByLabelText('Content width'));
    fireEvent.click(screen.getByLabelText('None'));

    expect(Designs.get(pageDesign_1.id)).not.toHaveProperty('sidePadding');
  });

  it('keeps the side padding custom field labelled with its label hidden', () => {
    renderEditor(pageDesign_1.id);

    fireEvent.click(screen.getByLabelText('Content width'));

    // The hiding itself is CSS the test environment cannot see
    expect(screen.getByLabelText('Custom')).toBeInTheDocument();
  });

  it('offers card designs no design controls', () => {
    renderEditor();

    expect(screen.queryByLabelText('Content width')).toBeNull();
  });

  it("opens at the design type's snap resolution", () => {
    renderEditor();

    // Snap to the 8px grid
    expect(screen.getByLabelText('8px')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    cleanup();

    renderEditor(pageDesign_1.id);

    // Snap to the 16px grid
    expect(screen.getByLabelText('16px')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('previews page designs on the canvas at page widths', () => {
    const container = renderEditor(pageDesign_1.id);

    fireEvent.click(screen.getByLabelText('Show on canvas'));
    fireEvent.click(screen.getByLabelText('Wide'));

    expect(
      container.querySelector<HTMLElement>('.design-preview-pane-render')?.style
        .width,
    ).toBe('1280px');
  });
});
