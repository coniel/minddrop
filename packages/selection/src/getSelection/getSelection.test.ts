import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  selectionItem_A_1,
  selectionItem_A_2,
  selectionItem_B_1,
  setup,
} from '../test-utils';
import { SelectionStore } from '../useSelectionStore';
import { getSelection } from './getSelection';

describe('getSelection', () => {
  beforeEach(() => {
    setup();

    // Selected drops and topics
    SelectionStore.getState().addSelectedItems([
      selectionItem_A_1,
      selectionItem_A_2,
      selectionItem_B_1,
    ]);
  });

  afterEach(cleanup);

  it('returns the selection', () => {
    // Should return the entire selection
    expect(getSelection()).toEqual([
      selectionItem_A_1,
      selectionItem_A_2,
      selectionItem_B_1,
    ]);
  });
});
