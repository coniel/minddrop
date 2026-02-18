import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { registerSelectionItemSerializer } from '../SelectionItemSerializersStore';
import { SelectionDeletedEvent } from '../events';
import {
  cleanup,
  selectionItemSerializer_A,
  selectionItemSerializer_B,
  selectionItem_A_1,
  selectionItem_B_1,
  setup,
} from '../test-utils';
import { SelectionStore } from '../useSelectionStore';
import { deleteSelection } from './deleteSelection';

const onDelete = vi.fn();

describe('deleteSelection', () => {
  beforeEach(() => {
    setup({ loadSelection: false, loadSelectionItemSerializers: false });

    // Register a serializer with a delete function
    registerSelectionItemSerializer({
      ...selectionItemSerializer_A,
      delete: onDelete,
    });
    // Register a serializer without a delete function
    registerSelectionItemSerializer({
      ...selectionItemSerializer_B,
      delete: undefined,
    });

    // Set an item for each serializer as the current selection
    SelectionStore.getState().addSelectedItems([
      selectionItem_A_1,
      selectionItem_B_1,
    ]);
  });

  afterEach(cleanup);

  it('deletes selection items with a serializer delete function', () => {
    // Trigger a delete
    deleteSelection();

    // Should delete the selection
    expect(onDelete).toHaveBeenCalledWith([selectionItem_A_1]);
  });

  it('dispatches a selection deleted event containing the deleted items', () =>
    new Promise<void>((done) => {
      Events.addListener(SelectionDeletedEvent, 'test', (payload) => {
        // Payload data should contain only the deleted items
        expect(payload.data).toEqual([selectionItem_A_1]);
        done();
      });

      // Trigger a delete
      deleteSelection();
    }));
});
