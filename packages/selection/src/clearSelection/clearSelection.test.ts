import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { SelectionClearedEvent } from '../events';
import {
  cleanup,
  selectionItem_A_1,
  selectionItem_A_2,
  selectionItem_B_1,
  setup,
} from '../test-utils';
import { SelectionStore } from '../useSelectionStore';
import { clearSelection } from './clearSelection';

const selection = [selectionItem_A_1, selectionItem_A_2, selectionItem_B_1];

describe('clearSelection', () => {
  beforeEach(() => {
    setup();

    // Add some items to the selection
    SelectionStore.getState().addSelectedItems(selection);
    // Set `isDragging` to true
    SelectionStore.getState().setIsDragging(true);
  });

  afterEach(cleanup);

  it('clears the selected items list', () => {
    // Clear selection
    clearSelection();

    // Selection should be empty
    expect(SelectionStore.getState().selectedItems).toEqual([]);
  });

  it('resets the dragging state', () => {
    // Clear selection
    clearSelection();

    // Should set `isDragging` to false
    expect(SelectionStore.getState().isDragging).toBe(false);
  });

  it('dispatches selection cleared event', () =>
    new Promise<void>((done) => {
      Events.addListener(SelectionClearedEvent, 'test', (payload) => {
        // Payload data should be the items cleared from the selection
        expect(payload.data).toEqual(selection);
        done();
      });

      // Clear selection
      clearSelection();
    }));
});
