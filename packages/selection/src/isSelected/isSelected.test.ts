import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, selectedItem1, setup } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { isSelected } from './isSelected';

describe('isSelected', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns `true` if the item is selected', () => {
    // Add an item to the current selection
    useSelectionStore.getState().addSelectedItems([selectedItem1]);

    // Should return `true`
    expect(isSelected(selectedItem1)).toBe(true);
  });

  it('returns `false` if the item is not selected', () => {
    // Should return `false`
    expect(isSelected(selectedItem1)).toBe(false);
  });
});
