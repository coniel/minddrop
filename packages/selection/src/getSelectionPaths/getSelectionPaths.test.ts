import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  selectionItem1,
  selectionItem2,
  selectionItem3,
  setup,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { getSelectionIds } from './getSelectionPaths';

describe('getSelectionPaths', () => {
  beforeEach(() => {
    setup();

    // Add items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectionItem1, selectionItem2, selectionItem3]);
  });

  afterEach(cleanup);

  it('returns the paths of the entire selection', () => {
    // Should return the paths of the entire selection
    expect(getSelectionIds()).toEqual([
      selectionItem1.id,
      selectionItem2.id,
      selectionItem3.id,
    ]);
  });
});
