import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  selectionItem_A_1,
  selectionItem_A_2,
  selectionItem_B_1,
  setup,
} from '../test-utils';
import { SelectionStore } from '../useSelectionStore';
import { getSelectionIds } from './getSelectionPaths';

describe('getSelectionPaths', () => {
  beforeEach(() => {
    setup();

    // Add items to the selection
    SelectionStore.getState().addSelectedItems([
      selectionItem_A_1,
      selectionItem_A_2,
      selectionItem_B_1,
    ]);
  });

  afterEach(cleanup);

  it('returns the paths of the entire selection', () => {
    // Should return the paths of the entire selection
    expect(getSelectionIds()).toEqual([
      selectionItem_A_1.id,
      selectionItem_A_2.id,
      selectionItem_B_1.id,
    ]);
  });
});
