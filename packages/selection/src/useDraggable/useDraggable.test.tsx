import React from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DragAndDrop } from '@minddrop/drag-and-drop';
import {
  cleanup as cleanupDragAndDrop,
  dragOver,
} from '@minddrop/drag-and-drop/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { SelectionStore } from '../SelectionStore';
import { SelectionFixtures, cleanup, setup } from '../test-utils';
import { SelectionItem } from '../types';
import { useDraggable } from './useDraggable';

const { selectionItem_A_1: draggedItem, selectionItem_A_2 } = SelectionFixtures;

/**
 * A draggable selection item.
 */
const Draggable: React.FC<{ item?: SelectionItem }> = ({
  item = draggedItem,
}) => {
  const { draggableProps } = useDraggable(item);

  return <div data-testid="item" {...draggableProps} />;
};

/**
 * Drags the item.
 *
 * @param shiftKey - Whether Shift is held during the press.
 */
function drag(shiftKey = false) {
  dragOver(screen.getByTestId('item'), document.body, { shiftKey });
}

describe('useDraggable', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    cleanupDragAndDrop();
  });

  it('exclusively selects the item if not already selected', () => {
    SelectionStore.getState().addSelectedItems([selectionItem_A_2]);

    render(<Draggable />);

    drag();

    expect(SelectionStore.getState().selectedItems).toEqual([draggedItem]);
  });

  it('adds the item to the selection if not already selected and Shift is held', () => {
    SelectionStore.getState().addSelectedItems([selectionItem_A_2]);

    render(<Draggable />);

    drag(true);

    expect(SelectionStore.getState().selectedItems).toEqual([
      selectionItem_A_2,
      draggedItem,
    ]);
  });

  it('preserves the selection if the item is already selected', () => {
    SelectionStore.getState().addSelectedItems([
      draggedItem,
      selectionItem_A_2,
    ]);

    render(<Draggable />);

    drag();

    expect(SelectionStore.getState().selectedItems).toEqual([
      draggedItem,
      selectionItem_A_2,
    ]);
  });

  it('refreshes the data of an already selected item', () => {
    // Select the item as it was when first selected
    SelectionStore.getState().addSelectedItems([draggedItem]);

    const updated = {
      ...draggedItem,
      data: { ...draggedItem.data, text: 'Updated' },
    };

    render(<Draggable item={updated} />);

    drag();

    expect(SelectionStore.getState().selectedItems).toEqual([updated]);
  });

  it('uses the serialized selection as the drag data', () => {
    render(<Draggable />);

    dragOver(screen.getByTestId('item'), document.body);

    // The type A serializer writes each item's text
    expect(DragAndDrop.getActiveDrag()).toEqual(
      expect.objectContaining({
        data: {
          [draggedItem.type]: [{ text: draggedItem.data.text }],
          'text/plain': draggedItem.data.text,
          'text/html': `<p>${draggedItem.data.text}</p>`,
        },
      }),
    );
  });
});
