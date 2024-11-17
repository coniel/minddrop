import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Events } from '@minddrop/events';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem2,
  selectedItem3,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { removeFromSelection } from './removeFromSelection';

describe('removeFromSelection', () => {
  beforeEach(() => {
    setup();

    // Add some selected items
    useSelectionStore
      .getState()
      .addSelectedItems([selectedItem1, selectedItem2, selectedItem3]);
  });

  afterEach(cleanup);

  it('removes the items from the current selection', () => {
    // Remove a couple of selected items
    removeFromSelection([selectedItem1, selectedItem3]);

    // Items should no longer be in the selected items list
    expect(useSelectionStore.getState().selectedItems).toEqual([selectedItem2]);
  });

  it('dispatches a `selection:items:remove` event', () =>
    new Promise<void>((done) => {
      Events.addListener('selection:items:remove', 'test', (payload) => {
        // Payload data should be the removed items without duplicates
        expect(payload.data).toEqual([selectedItem1]);
        done();
      });

      // Remove the same item from the selection twice
      removeFromSelection([selectedItem1, selectedItem1]);
    }));
});
