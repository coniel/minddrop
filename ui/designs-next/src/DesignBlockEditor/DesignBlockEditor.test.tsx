import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DesignElement } from '@minddrop/designs-next';
import {
  cardColumns,
  cardRows,
  coverDesignElement,
  designElements,
  titleDesignElement,
} from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { DesignBlockEditor } from './DesignBlockEditor';

// The elements passed to the most recent onElementsChange call
let changedElements: DesignElement[] | null;

// The element ID passed to the most recent onSelectionChange call
let selectedElementId: string | null | undefined;

/**
 * Renders the editor with the fixture layout and recording
 * callbacks.
 *
 * @param selectedId - The controlled selection.
 * @returns The render container.
 */
function renderEditor(selectedId: string | null = null) {
  const { container } = render(
    <DesignBlockEditor
      elements={designElements}
      columns={cardColumns}
      rows={cardRows}
      snap={2}
      unitSize={10}
      selectedId={selectedId}
      onElementsChange={(elements) => {
        changedElements = elements;
      }}
      onSelectionChange={(elementId) => {
        selectedElementId = elementId;
      }}
    />,
  );

  return container;
}

describe('DesignBlockEditor', () => {
  beforeEach(() => {
    changedElements = null;
    selectedElementId = undefined;

    // Pointer capture is not implemented in the test environment
    if (!Element.prototype.setPointerCapture) {
      Element.prototype.setPointerCapture = () => {};
    }
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders a block per element at its scaled rect', () => {
    const container = renderEditor();
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    expect(
      container.querySelectorAll('.design-block-editor-element'),
    ).toHaveLength(designElements.length);
    expect(title.style.left).toBe(`${titleDesignElement.column * 10}px`);
    expect(title.style.top).toBe(`${titleDesignElement.row * 10}px`);
    expect(title.style.width).toBe(`${titleDesignElement.columnSpan * 10}px`);
    expect(title.style.height).toBe(`${titleDesignElement.rowSpan * 10}px`);
  });

  it('sizes the surface to the grid and draws grid lines at the snap resolution', () => {
    const container = renderEditor();
    const surface = container.querySelector(
      '.design-block-editor',
    ) as HTMLElement;

    expect(surface.style.width).toBe(`${cardColumns * 10}px`);
    expect(surface.style.height).toBe(`${cardRows * 10}px`);
    expect(surface.style.backgroundSize).toBe('20px 20px');
  });

  it('renders resize handles on every block', () => {
    const container = renderEditor();
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    expect(title.querySelectorAll('.design-block-editor-handle')).toHaveLength(
      8,
    );
  });

  it('marks the selected block', () => {
    const container = renderEditor(titleDesignElement.id);
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    expect(
      title.classList.contains('design-block-editor-element-selected'),
    ).toBe(true);
  });

  it('selects an element on pointer down', () => {
    const container = renderEditor();
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    fireEvent.pointerDown(title, { clientX: 0, clientY: 0 });

    expect(selectedElementId).toBe(titleDesignElement.id);
  });

  it('clears the selection on background clicks only', () => {
    const container = renderEditor(titleDesignElement.id);
    const surface = container.querySelector(
      '.design-block-editor',
    ) as HTMLElement;
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    // Clicks bubbling up from an element keep the selection
    fireEvent.click(title);

    expect(selectedElementId).toBeUndefined();

    // Clicks landing on the surface itself clear it
    fireEvent.click(surface);

    expect(selectedElementId).toBeNull();
  });

  it('moves the dragged element through onElementsChange', () => {
    const container = renderEditor();
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    // Drag the title two snapped columns to the right
    fireEvent.pointerDown(title, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(title, { clientX: 40, clientY: 0 });

    const movedTitle = changedElements?.find(
      (element) => element.id === titleDesignElement.id,
    );

    expect(movedTitle?.column).toBe(titleDesignElement.column + 4);
    expect(movedTitle?.row).toBe(titleDesignElement.row);
  });

  it('resizes through the element handles', () => {
    const container = renderEditor();
    const rightHandle = container.querySelector(
      '[data-element-id="element_title"] .design-block-editor-handle-resize-right',
    ) as HTMLElement;

    // Drag the right handle two snapped columns to the right
    fireEvent.pointerDown(rightHandle, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(rightHandle, { clientX: 20, clientY: 0 });

    const resizedTitle = changedElements?.find(
      (element) => element.id === titleDesignElement.id,
    );

    expect(resizedTitle?.columnSpan).toBe(titleDesignElement.columnSpan + 2);
    expect(resizedTitle?.column).toBe(titleDesignElement.column);
  });

  it('resizes both axes through a corner handle', () => {
    const container = renderEditor();
    const cornerHandle = container.querySelector(
      '[data-element-id="element_title"] .design-block-editor-handle-resize-bottom-right',
    ) as HTMLElement;

    // Drag the bottom-right corner two snapped units on both axes
    fireEvent.pointerDown(cornerHandle, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(cornerHandle, { clientX: 20, clientY: 20 });

    const resizedTitle = changedElements?.find(
      (element) => element.id === titleDesignElement.id,
    );

    expect(resizedTitle?.columnSpan).toBe(titleDesignElement.columnSpan + 2);
    expect(resizedTitle?.rowSpan).toBe(titleDesignElement.rowSpan + 2);
  });

  it('shows the element menu for the selected element only', () => {
    const withoutSelection = renderEditor();

    expect(
      withoutSelection.querySelector('.design-block-editor-menu'),
    ).toBeNull();

    cleanup();

    const withSelection = renderEditor(titleDesignElement.id);

    expect(
      withSelection.querySelector('.design-block-editor-menu'),
    ).not.toBeNull();
  });

  it('places the menu below blocks near the top edge', () => {
    // The cover sits at the top edge, the title further down
    const container = renderEditor(coverDesignElement.id);
    const menu = container.querySelector(
      '.design-block-editor-menu',
    ) as HTMLElement;

    expect(menu.style.top).toBe(
      `${(coverDesignElement.row + coverDesignElement.rowSpan) * 10 + 4}px`,
    );
  });

  it('changes the width mode through the menu', () => {
    renderEditor(titleDesignElement.id);

    fireEvent.click(screen.getByLabelText('Fixed width, pinned left'));

    const changedTitle = changedElements?.find(
      (element) => element.id === titleDesignElement.id,
    );

    expect(changedTitle?.widthMode).toBe('fixed-left');
  });

  it('toggles natural height through the menu', () => {
    renderEditor(titleDesignElement.id);

    fireEvent.click(screen.getByLabelText('Natural height'));

    const changedTitle = changedElements?.find(
      (element) => element.id === titleDesignElement.id,
    );

    expect(changedTitle?.naturalHeight).toBe(true);
  });

  it('stops applying deltas after the pointer is released', () => {
    const container = renderEditor();
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    // Release the drag, then move again
    fireEvent.pointerDown(title, { clientX: 0, clientY: 0 });
    fireEvent.pointerUp(title);
    changedElements = null;
    fireEvent.pointerMove(title, { clientX: 40, clientY: 0 });

    expect(changedElements).toBeNull();
  });
});
