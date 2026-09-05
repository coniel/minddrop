import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DesignElement } from '@minddrop/designs-next';
import { registerDesignElementConfig } from '@minddrop/designs-next';
import {
  cardColumns,
  cardRows,
  coverDesignElement,
  designElements,
  titleDesignElement,
} from '@minddrop/designs-next/test-utils';
import {
  DesignElementConfigsStore,
  boxElementConfig,
} from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { DesignBlockEditor } from './DesignBlockEditor';

// The elements passed to the most recent onElementsChange call
let changedElements: DesignElement[] | null;

// The element ID passed to the most recent onSelectionChange call
let selectedElementId: string | null | undefined;

// The row count passed to the most recent onRowsChange call
let changedRows: number | null;

// The number of onDragStart and onDragEnd calls
let dragStarts: number;
let dragEnds: number;

/**
 * Renders the editor with the fixture layout and recording
 * callbacks.
 *
 * @param selectedId - The controlled selection.
 * @param resizable - Whether to make the surface height adjustable.
 * @returns The render container.
 */
function renderEditor(selectedId: string | null = null, resizable = false) {
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
      onRowsChange={
        resizable
          ? (rows) => {
              changedRows = rows;
            }
          : undefined
      }
      onDragStart={() => {
        dragStarts += 1;
      }}
      onDragEnd={() => {
        dragEnds += 1;
      }}
    />,
  );

  return container;
}

describe('DesignBlockEditor', () => {
  beforeEach(() => {
    changedElements = null;
    selectedElementId = undefined;
    changedRows = null;
    dragStarts = 0;
    dragEnds = 0;

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

  it('divides pointer deltas by the measured display scale', () => {
    const container = renderEditor();
    const surface = container.querySelector(
      '.design-block-editor',
    ) as HTMLElement;
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    // The surface renders at double its layout width
    surface.getBoundingClientRect = () =>
      ({ width: cardColumns * 20 }) as DOMRect;

    // At double scale, forty screen pixels are two units
    fireEvent.pointerDown(title, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(title, { clientX: 40, clientY: 0 });

    const movedTitle = changedElements?.find(
      (element) => element.id === titleDesignElement.id,
    );

    expect(movedTitle?.column).toBe(titleDesignElement.column + 2);
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

  it('clears the selection on clicks outside the editor', () => {
    renderEditor(titleDesignElement.id);

    fireEvent.click(document.body);

    expect(selectedElementId).toBeNull();
  });

  it('changes the height mode through the menu when aspect-locked', () => {
    const { container } = render(
      <DesignBlockEditor
        elements={designElements}
        columns={cardColumns}
        rows={cardRows}
        snap={2}
        unitSize={10}
        selectedId={titleDesignElement.id}
        aspectLocked
        onElementsChange={(elements) => {
          changedElements = elements;
        }}
        onSelectionChange={() => undefined}
      />,
    );

    expect(container.querySelector('.design-block-editor-menu')).not.toBeNull();

    fireEvent.click(screen.getByLabelText('Fixed height, pinned bottom'));

    const changedTitle = changedElements?.find(
      (element) => element.id === titleDesignElement.id,
    );

    expect(changedTitle?.heightMode).toBe('fixed-bottom');
  });

  it('shows the grid overlay above other blocks during element drags', () => {
    const container = renderEditor();
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    expect(
      container.querySelector('.design-block-editor-grid-overlay'),
    ).toBeNull();

    // The overlay appears for the drag, with the dragged block lifted
    fireEvent.pointerDown(title, { clientX: 0, clientY: 0 });

    expect(
      container.querySelector('.design-block-editor-grid-overlay'),
    ).not.toBeNull();
    expect(
      title.classList.contains('design-block-editor-element-dragging'),
    ).toBe(true);

    // Releasing the pointer removes it again
    fireEvent.pointerUp(title);

    expect(
      container.querySelector('.design-block-editor-grid-overlay'),
    ).toBeNull();
  });

  it('hides the menu while a drag is in progress', () => {
    const container = renderEditor(titleDesignElement.id);
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    // The menu hides for the duration of the drag
    fireEvent.pointerDown(title, { clientX: 0, clientY: 0 });

    expect(container.querySelector('.design-block-editor-menu')).toBeNull();

    // Releasing the pointer brings it back
    fireEvent.pointerUp(title);

    expect(container.querySelector('.design-block-editor-menu')).not.toBeNull();
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

  it('floors resizes at the element type minimum row span', () => {
    // A box config declaring an intrinsic minimum height
    registerDesignElementConfig({
      ...boxElementConfig,
      resolveMinRowSpan: () => 4,
    });

    const container = renderEditor();
    const bottomHandle = container.querySelector(
      '[data-element-id="element_icon"] .design-block-editor-handle-resize-bottom',
    ) as HTMLElement;

    // Drag the bottom edge far past the minimum
    fireEvent.pointerDown(bottomHandle, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(bottomHandle, { clientX: 0, clientY: -1000 });

    const resizedIcon = changedElements?.find(
      (element) => element.id === 'element_icon',
    );

    expect(resizedIcon?.rowSpan).toBe(4);

    DesignElementConfigsStore.remove(boxElementConfig.type);
  });

  it('grows the layout with a bottom-edge resize past the layout bottom', () => {
    const container = renderEditor(null, true);
    const bottomHandle = container.querySelector(
      '[data-element-id="element_title"] .design-block-editor-handle-resize-bottom',
    ) as HTMLElement;

    // Drag the title's bottom edge thirty rows down, past row 32
    fireEvent.pointerDown(bottomHandle, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(bottomHandle, { clientX: 0, clientY: 300 });

    const resizedTitle = changedElements?.find(
      (element) => element.id === titleDesignElement.id,
    );

    // The element extends past the old layout bottom, and the layout
    // grows to its new bottom edge.
    expect(resizedTitle?.rowSpan).toBe(titleDesignElement.rowSpan + 30);
    expect(changedRows).toBe(
      titleDesignElement.row + titleDesignElement.rowSpan + 30,
    );
  });

  it('renders the surface height handle only when resizable', () => {
    const fixed = renderEditor();

    expect(
      fixed.querySelector('.design-block-editor-surface-handle'),
    ).toBeNull();

    cleanup();

    const resizable = renderEditor(null, true);

    expect(
      resizable.querySelector('.design-block-editor-surface-handle'),
    ).not.toBeNull();
  });

  it('adjusts the row count through the surface handle', () => {
    const container = renderEditor(null, true);
    const handle = container.querySelector(
      '.design-block-editor-surface-handle',
    ) as HTMLElement;

    // Drag the bottom edge four snapped rows down
    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(handle, { clientX: 0, clientY: 40 });

    expect(changedRows).toBe(cardRows + 4);
  });

  it('floors the surface height at the lowest element bottom edge', () => {
    const container = renderEditor(null, true);
    const handle = container.querySelector(
      '.design-block-editor-surface-handle',
    ) as HTMLElement;

    // Drag far above the content, flooring at the body's bottom edge
    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(handle, { clientX: 0, clientY: -1000 });

    expect(changedRows).toBe(30);
  });

  it('reports the element drag lifecycle', () => {
    const container = renderEditor();
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    fireEvent.pointerDown(title, { clientX: 0, clientY: 0 });

    expect(dragStarts).toBe(1);
    expect(dragEnds).toBe(0);

    fireEvent.pointerUp(title);

    expect(dragEnds).toBe(1);

    // A release without a drag in progress reports nothing
    fireEvent.pointerUp(title);

    expect(dragEnds).toBe(1);
  });

  it('reports the surface drag lifecycle', () => {
    const container = renderEditor(null, true);
    const handle = container.querySelector(
      '.design-block-editor-surface-handle',
    ) as HTMLElement;

    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0 });

    expect(dragStarts).toBe(1);

    fireEvent.pointerUp(handle);

    expect(dragEnds).toBe(1);
  });

  it('removes the selected element on Delete', () => {
    renderEditor(titleDesignElement.id);

    fireEvent.keyDown(document.body, { key: 'Delete' });

    expect(changedElements).toHaveLength(designElements.length - 1);
    expect(
      changedElements?.some((element) => element.id === titleDesignElement.id),
    ).toBe(false);
    expect(selectedElementId).toBeNull();
  });

  it('leaves Backspace to editable controls', () => {
    renderEditor(titleDesignElement.id);

    // A key press inside an input belongs to the input
    const input = document.createElement('input');
    document.body.appendChild(input);
    fireEvent.keyDown(input, { key: 'Backspace' });

    expect(changedElements).toBeNull();

    input.remove();
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
