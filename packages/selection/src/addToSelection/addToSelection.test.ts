import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { cleanup, selectionItem1, selectionItem2, setup } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { addToSelection } from './addToSelection';

describe('addToSelection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the items to the current selection', () => {
    // Add items to the selection
    addToSelection([selectionItem1, selectionItem2]);

    // Items should be selected
    expect(useSelectionStore.getState().selectedItems).toEqual([
      selectionItem1,
      selectionItem2,
    ]);
  });

  it('does not add items already in the selection', () => {
    // Add an item to the selection
    addToSelection([selectionItem1]);

    // Add the same item again
    addToSelection([selectionItem1]);

    // Selection should only contain the item once
    expect(useSelectionStore.getState().selectedItems).toEqual([
      selectionItem1,
    ]);
  });

  it('does not add duplicate items', () => {
    // Add an item to the selection twice
    addToSelection([selectionItem1, selectionItem1]);

    // Selection should only contain the item once
    expect(useSelectionStore.getState().selectedItems).toEqual([
      selectionItem1,
    ]);
  });

  it('dispatches a selection item add event', () =>
    new Promise<void>((done) => {
      // Add an inital item
      addToSelection([selectionItem1]);

      Events.addListener('selection:items:add', 'test', (payload) => {
        // Payload data should be the added items, exluding
        // duplicates.
        expect(payload.data).toEqual([selectionItem2]);
        done();
      });

      // Add three items to the selection, including one that
      // is already selected, and a second one twice.
      addToSelection([selectionItem1, selectionItem2, selectionItem2]);
    }));
});
