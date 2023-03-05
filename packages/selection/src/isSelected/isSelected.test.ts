import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, selectedDrop1 } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { isSelected } from './isSelected';

describe('isSelected', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns `true` if the item is selected', () => {
    // Add an item to the current selection
    useSelectionStore.getState().addSelectedItems([selectedDrop1]);

    // Should return `true`
    expect(isSelected(selectedDrop1)).toBe(true);
  });

  it('returns `false` if the item is not selected', () => {
    // Should return `false`
    expect(isSelected(selectedDrop1)).toBe(false);
  });
});
