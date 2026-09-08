import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DesignElement } from '@minddrop/designs-next';
import { DesignElementConfigs } from '@minddrop/designs-next';
import { Designs } from '@minddrop/designs-next';
import {
  cardColumns,
  cardRows,
  designElements,
  titleDesignElement,
} from '@minddrop/designs-next/test-utils';
import {
  DesignElementConfigsStore,
  testElementConfig,
} from '@minddrop/designs-next/test-utils';
import { Selection } from '@minddrop/selection';
import {
  createDataTransfer,
  fireEvent,
  render,
  screen,
  userEvent,
} from '@minddrop/test-utils';
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

/**
 * Creates the data transfer of a palette drag carrying element types.
 *
 * @param types - The element types being dragged.
 * @returns The data transfer.
 */
function createElementTypesTransfer(...types: string[]) {
  return createDataTransfer({
    [Selection.toMimeType(Designs.constants.ElementTypesDataKey)]:
      JSON.stringify(types.map((type) => ({ type }))),
  });
}

/**
 * Drops onto the editor surface at a screen point. Built by hand
 * since the test environment's drop events carry no coordinates.
 *
 * @param container - The render container.
 * @param clientX - The drop's horizontal screen position.
 * @param clientY - The drop's vertical screen position.
 * @param dataTransfer - The dropped data.
 */
function dropOnSurface(
  container: HTMLElement,
  clientX: number,
  clientY: number,
  dataTransfer: DataTransfer,
) {
  const event = new Event('drop', { bubbles: true, cancelable: true });

  Object.assign(event, { clientX, clientY, dataTransfer });

  fireEvent(container.querySelector('.design-block-editor')!, event);
}

/**
 * Clicks the editor surface at a position within it.
 *
 * @param container - The render container.
 * @param offsetX - The click's horizontal position within the surface.
 * @param offsetY - The click's vertical position within the surface.
 */
function clickSurface(
  container: HTMLElement,
  offsetX: number,
  offsetY: number,
) {
  fireEvent.click(container.querySelector('.design-block-editor')!, {
    offsetX,
    offsetY,
  });
}

/**
 * Moves the pointer over the editor surface to a position within it.
 *
 * @param container - The render container.
 * @param offsetX - The pointer's horizontal position within the surface.
 * @param offsetY - The pointer's vertical position within the surface.
 */
function hoverSurface(
  container: HTMLElement,
  offsetX: number,
  offsetY: number,
) {
  fireEvent.pointerMove(container.querySelector('.design-block-editor')!, {
    offsetX,
    offsetY,
  });
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
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    // Clicks bubbling up from an element keep the selection
    fireEvent.click(title);

    expect(selectedElementId).toBeUndefined();

    // Clicks landing on the surface itself clear it
    clickSurface(container, 0, 0);

    expect(selectedElementId).toBeNull();
  });

  it('marks the grid square under the pointer', () => {
    const container = renderEditor();
    const surface = container.querySelector(
      '.design-block-editor',
    ) as HTMLElement;

    expect(
      container.querySelector('.design-block-editor-hovered-square'),
    ).toBeNull();

    hoverSurface(container, 45, 27);

    const square = container.querySelector(
      '.design-block-editor-hovered-square',
    ) as HTMLElement;

    // 4.5 and 2.7 units land in the square at column 4, row 2
    expect(square.style.left).toBe('40px');
    expect(square.style.top).toBe('20px');
    // The square covers one snap step
    expect(square.style.width).toBe('20px');

    // The far side of the same square stays on it rather than
    // rounding onto the next one.
    hoverSurface(container, 59, 39);

    expect(square.style.left).toBe('40px');
    expect(square.style.top).toBe('20px');

    fireEvent.pointerLeave(surface);

    expect(
      container.querySelector('.design-block-editor-hovered-square'),
    ).toBeNull();
  });

  it('marks the square a grid line closes rather than the one it opens', () => {
    const container = renderEditor();

    // The line between the squares at 20px and 40px, which reads as
    // the closing edge of the one before it.
    hoverSurface(container, 40, 40);

    const square = container.querySelector(
      '.design-block-editor-hovered-square',
    ) as HTMLElement;

    expect(square.style.left).toBe('20px');
    expect(square.style.top).toBe('20px');

    // The surface's own first line stays on its first square
    hoverSurface(container, 0, 0);

    expect(square.style.left).toBe('0px');
    expect(square.style.top).toBe('0px');
  });

  it('leaves the grid square unmarked during element drags', () => {
    const container = renderEditor();
    const title = container.querySelector(
      '[data-element-id="element_title"]',
    ) as HTMLElement;

    fireEvent.pointerDown(title, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(title, { clientX: 40, clientY: 0 });

    expect(
      container.querySelector('.design-block-editor-hovered-square'),
    ).toBeNull();
  });

  it('opens the insert menu on the clicked grid square', () => {
    const container = renderEditor();

    clickSurface(container, 45, 27);

    const marker = container.querySelector(
      '.design-block-editor-insert-point',
    ) as HTMLElement;

    // 4.5 and 2.7 units land in the square at column 4, row 2
    expect(marker.style.left).toBe('40px');
    expect(marker.style.top).toBe('20px');
    screen.getByPlaceholderText('Insert element');
  });

  it('closes the open insert menu rather than moving it', () => {
    const container = renderEditor();

    clickSurface(container, 45, 27);

    // A click on another square while the menu is open dismisses it
    clickSurface(container, 85, 67);

    expect(
      container.querySelector('.design-block-editor-insert-point'),
    ).toBeNull();
    expect(screen.queryByPlaceholderText('Insert element')).toBeNull();

    // Opening it on the other square takes a second click
    clickSurface(container, 85, 67);

    const marker = container.querySelector(
      '.design-block-editor-insert-point',
    ) as HTMLElement;

    expect(marker.style.left).toBe('80px');
    expect(marker.style.top).toBe('60px');
  });

  it('inserts the picked element type on the marked grid square', async () => {
    const container = renderEditor();

    clickSurface(container, 45, 27);

    await userEvent.click(screen.getByText('Box'));

    const inserted = changedElements?.[changedElements.length - 1];

    expect(changedElements).toHaveLength(designElements.length + 1);
    expect(inserted?.type).toBe(testElementConfig.type);
    expect(inserted?.column).toBe(4);
    expect(inserted?.row).toBe(2);
    expect(selectedElementId).toBe(inserted?.id);

    // The menu closes with the insert, unmarking the square
    expect(
      container.querySelector('.design-block-editor-insert-point'),
    ).toBeNull();
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

  it('inserts dropped element types on the grid square dropped on', () => {
    const container = renderEditor(null, true);

    dropOnSurface(
      container,
      45,
      27,
      createElementTypesTransfer(testElementConfig.type),
    );

    const inserted = changedElements?.[changedElements.length - 1];

    expect(changedElements).toHaveLength(designElements.length + 1);
    expect(inserted?.type).toBe(testElementConfig.type);
    // 4.5 and 2.7 units land in the square at column 4, row 2
    expect(inserted?.column).toBe(4);
    expect(inserted?.row).toBe(2);
    expect(selectedElementId).toBe(inserted?.id);
  });

  it('grows the surface to fit a dropped element', () => {
    const container = renderEditor(null, true);

    // Drop inside the last square above the surface's bottom edge,
    // clear of the grid line opening it.
    dropOnSurface(
      container,
      2,
      (cardRows - 2) * 10 + 2,
      createElementTypesTransfer(testElementConfig.type),
    );

    const inserted = changedElements?.[changedElements.length - 1];

    expect(inserted?.row).toBe(cardRows - 2);
    expect(changedRows).toBe(cardRows - 2 + testElementConfig.defaultRowSpan);
  });

  it('keeps dropped elements inside a fixed-height surface', () => {
    const container = renderEditor();

    dropOnSurface(
      container,
      cardColumns * 10,
      cardRows * 10,
      createElementTypesTransfer(testElementConfig.type),
    );

    const inserted = changedElements?.[changedElements.length - 1];

    expect(inserted?.column).toBe(
      cardColumns - testElementConfig.defaultColumnSpan,
    );
    expect(inserted?.row).toBe(cardRows - testElementConfig.defaultRowSpan);
    expect(changedRows).toBeNull();
  });

  it('ignores drops of other data', () => {
    const container = renderEditor();

    dropOnSurface(
      container,
      0,
      0,
      createDataTransfer({ 'text/plain': 'hello' }),
    );

    expect(changedElements).toBeNull();
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

  it('floors resizes at the element type minimum row span', () => {
    // A box config declaring an intrinsic minimum height
    DesignElementConfigs.register({
      ...testElementConfig,
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

    DesignElementConfigsStore.remove(testElementConfig.type);
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
