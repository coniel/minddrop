import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  selectedDrop1,
  selectedDrop2,
  selectedTopic1,
  core,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { removeFromSelection } from './removeFromSelection';

describe('removeFromSelection', () => {
  beforeEach(() => {
    setup();

    // Add some selected items
    useSelectionStore
      .getState()
      .addSelectedItems([selectedDrop1, selectedDrop2, selectedTopic1]);
  });

  afterEach(cleanup);

  it('removes the items from the current selection', () => {
    // Remove a couple of selected items
    removeFromSelection(core, [selectedDrop1, selectedTopic1]);

    // Items should no longer be in the selected items list
    expect(useSelectionStore.getState().selectedItems).toEqual([selectedDrop2]);
  });

  it('dispatches a `selection:items:remove` event', () =>
    new Promise<void>((done) => {
      core.addEventListener('selection:items:remove', (payload) => {
        // Payload data should be the removed items without duplicates
        expect(payload.data).toEqual([selectedDrop1]);
        done();
      });

      // Remove the same item from the selection twice
      removeFromSelection(core, [selectedDrop1, selectedDrop1]);
    }));
});
