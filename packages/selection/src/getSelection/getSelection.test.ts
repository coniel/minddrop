import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  selectionItem1,
  selectionItem2,
  selectionItem3,
  setup,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { getSelection } from './getSelection';

describe('getSelection', () => {
  beforeEach(() => {
    setup();

    // Selected drops and topics
    useSelectionStore
      .getState()
      .addSelectedItems([selectionItem1, selectionItem2, selectionItem3]);
  });

  afterEach(cleanup);

  it('returns the selection', () => {
    // Should return the entire selection
    expect(getSelection()).toEqual([
      selectionItem1,
      selectionItem2,
      selectionItem3,
    ]);
  });
});
