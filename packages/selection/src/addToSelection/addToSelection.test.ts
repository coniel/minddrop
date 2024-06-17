import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Events } from '@minddrop/events';
import { setup, cleanup, selectedDrop1, selectedDrop2 } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { addToSelection } from './addToSelection';

describe('addToSelection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the items to the current selection', () => {
    // Add items to the selection
    addToSelection([selectedDrop1, selectedDrop2]);

    // Items should be selected
    expect(useSelectionStore.getState().selectedItems).toEqual([
      selectedDrop1,
      selectedDrop2,
    ]);
  });

  it('does not add items already in the selection', () => {
    // Add an item to the selection
    addToSelection([selectedDrop1]);

    // Add the same item again
    addToSelection([selectedDrop1]);

    // Selection should only contain the item once
    expect(useSelectionStore.getState().selectedItems).toEqual([selectedDrop1]);
  });

  it('does not add duplicate items', () => {
    // Add an item to the selection twice
    addToSelection([selectedDrop1, selectedDrop1]);

    // Selection should only contain the item once
    expect(useSelectionStore.getState().selectedItems).toEqual([selectedDrop1]);
  });

  it('dispatches a `selection:items:add` event', () =>
    new Promise<void>((done) => {
      // Add an inital item
      addToSelection([selectedDrop1]);

      // Listen to 'selection:items:add' events
      Events.addListener('selection:items:add', 'test', (payload) => {
        // Payload data should be the added items, exluding
        // duplicates.
        expect(payload.data).toEqual([selectedDrop2]);
        done();
      });

      // Add three items to the selection, including one that
      // is already selected, and a second one twice.
      addToSelection([selectedDrop1, selectedDrop2, selectedDrop2]);
    }));
});
