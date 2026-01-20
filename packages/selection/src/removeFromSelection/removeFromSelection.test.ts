import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  cleanup,
  selectionItem1,
  selectionItem2,
  selectionItem3,
  setup,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { removeFromSelection } from './removeFromSelection';

describe('removeFromSelection', () => {
  beforeEach(() => {
    setup();

    // Add some selected items
    useSelectionStore
      .getState()
      .addSelectedItems([selectionItem1, selectionItem2, selectionItem3]);
  });

  afterEach(cleanup);

  it('removes the items from the current selection', () => {
    // Remove a couple of selected items
    removeFromSelection([selectionItem1, selectionItem3]);

    // Items should no longer be in the selected items list
    expect(useSelectionStore.getState().selectedItems).toEqual([
      selectionItem2,
    ]);
  });

  it('dispatches a `selection:items:remove` event', () =>
    new Promise<void>((done) => {
      Events.addListener('selection:items:remove', 'test', (payload) => {
        // Payload data should be the removed items without duplicates
        expect(payload.data).toEqual([selectionItem1]);
        done();
      });

      // Remove the same item from the selection twice
      removeFromSelection([selectionItem1, selectionItem1]);
    }));
});
