import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, selectionItem_A_1, setup } from '../test-utils';
import { SelectionStore } from '../useSelectionStore';
import { isSelected } from './isSelected';

describe('isSelected', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns `true` if the item is selected', () => {
    // Add an item to the current selection
    SelectionStore.getState().addSelectedItems([selectionItem_A_1]);

    // Should return `true`
    expect(isSelected(selectionItem_A_1)).toBe(true);
  });

  it('returns `false` if the item is not selected', () => {
    // Should return `false`
    expect(isSelected(selectionItem_A_1)).toBe(false);
  });
});
