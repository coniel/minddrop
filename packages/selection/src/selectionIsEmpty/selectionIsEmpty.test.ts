import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, selectedItem1 } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
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
    useSelectionStore.getState().addSelectedItems([selectedItem1]);

    // Should return `false`
    expect(selectionIsEmpty()).toBe(false);
  });
});
