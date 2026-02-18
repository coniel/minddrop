import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, selectionItem_A_1, setup } from '../test-utils';
import { SelectionStore } from '../useSelectionStore';
import { selectionIsEmpty } from './selectionIsEmpty';

describe('selectionIsEmpty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns `true` if the current selection is empty', () => {
    // Should return `true`
    expect(selectionIsEmpty()).toBe(true);
  });

  it('returns `false` if the current selection is not empty', () => {
    // Add a selected item
    SelectionStore.getState().addSelectedItems([selectionItem_A_1]);

    // Should return `false`
    expect(selectionIsEmpty()).toBe(false);
  });
});
