import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  cleanup,
  selectionItem_A_1,
  selectionItem_A_2,
  selectionItem_B_1,
  setup,
} from '../test-utils';
import { SelectionStore } from '../useSelectionStore';
import { removeFromSelection } from './removeFromSelection';

describe('removeFromSelection', () => {
  beforeEach(() => {
    setup();

    // Add some selected items
    SelectionStore.getState().addSelectedItems([
      selectionItem_A_1,
      selectionItem_A_2,
      selectionItem_B_1,
    ]);
  });

  afterEach(cleanup);

  it('removes the items from the current selection', () => {
    // Remove a couple of selected items
    removeFromSelection([selectionItem_A_1, selectionItem_B_1]);

    // Items should no longer be in the selected items list
    expect(SelectionStore.getState().selectedItems).toEqual([
      selectionItem_A_2,
    ]);
  });

  it('dispatches a `selection:items:remove` event', () =>
    new Promise<void>((done) => {
      Events.addListener('selection:items:remove', 'test', (payload) => {
        // Payload data should be the removed items without duplicates
        expect(payload.data).toEqual([selectionItem_A_1]);
        done();
      });

      // Remove the same item from the selection twice
      removeFromSelection([selectionItem_A_1, selectionItem_A_1]);
    }));
});
