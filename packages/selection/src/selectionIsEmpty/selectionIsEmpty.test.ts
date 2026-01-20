import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, selectionItem1, setup } from '../test-utils';
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
    useSelectionStore.getState().addSelectedItems([selectionItem1]);

    // Should return `false`
    expect(selectionIsEmpty()).toBe(false);
  });
});
