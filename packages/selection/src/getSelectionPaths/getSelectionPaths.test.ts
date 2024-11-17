import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem2,
  selectedItem3,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { getSelectionIds } from './getSelectionPaths';

describe('getSelectionPaths', () => {
  beforeEach(() => {
    setup();

    // Add items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedItem1, selectedItem2, selectedItem3]);
  });

  afterEach(cleanup);

  it('returns the paths of the entire selection', () => {
    // Should return the paths of the entire selection
    expect(getSelectionIds()).toEqual([
      selectedItem1.id,
      selectedItem2.id,
      selectedItem3.id,
    ]);
  });
});
