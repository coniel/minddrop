import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { SelectionItemsAddedEvent } from '../events';
import {
  cleanup,
  selectionItem_A_1,
  selectionItem_A_2,
  setup,
} from '../test-utils';
import { SelectionStore } from '../useSelectionStore';
import { addToSelection } from './addToSelection';

describe('addToSelection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the items to the current selection', () => {
    // Add items to the selection
    addToSelection([selectionItem_A_1, selectionItem_A_2]);

    // Items should be selected
    expect(SelectionStore.getState().selectedItems).toEqual([
      selectionItem_A_1,
      selectionItem_A_2,
    ]);
  });

  it('does not add items already in the selection', () => {
    // Add an item to the selection
    addToSelection([selectionItem_A_1]);

    // Add the same item again
    addToSelection([selectionItem_A_1]);

    // Selection should only contain the item once
    expect(SelectionStore.getState().selectedItems).toEqual([
      selectionItem_A_1,
    ]);
  });

  it('does not add duplicate items', () => {
    // Add an item to the selection twice
    addToSelection([selectionItem_A_1, selectionItem_A_1]);

    // Selection should only contain the item once
    expect(SelectionStore.getState().selectedItems).toEqual([
      selectionItem_A_1,
    ]);
  });

  it('dispatches a selection item add event', () =>
    new Promise<void>((done) => {
      // Add an inital item
      addToSelection([selectionItem_A_1]);

      Events.addListener(SelectionItemsAddedEvent, 'test', (payload) => {
        // Payload data should be the added items, exluding
        // duplicates.
        expect(payload.data).toEqual([selectionItem_A_2]);
        done();
      });

      // Add three items to the selection, including one that
      // is already selected, and a second one twice.
      addToSelection([selectionItem_A_1, selectionItem_A_2, selectionItem_A_2]);
    }));
});
