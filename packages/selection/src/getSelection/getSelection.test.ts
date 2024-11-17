import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem2,
  selectedItem3,
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
