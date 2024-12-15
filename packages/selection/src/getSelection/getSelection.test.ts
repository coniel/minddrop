import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  selectedItem1,
  selectedItem2,
  selectedItem3,
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
      .addSelectedItems([selectedItem1, selectedItem2, selectedItem3]);
  });

  afterEach(cleanup);

  it('returns the selection', () => {
    // Should return the entire selection
    expect(getSelection()).toEqual([
      selectedItem1,
      selectedItem2,
      selectedItem3,
    ]);
  });
});
