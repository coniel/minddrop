import { describe, it, expect } from 'vitest';
import { selectedItem1, selectedItem2 } from '../../test-utils';
import { dedupeSelectionItemsArray } from './dedupeSelectionItemsArray';

describe('dedupeSelectionItemsArray', () => {
  it('removes duplicate selection items', () => {
    // Should removed duplicate selection items
    expect(
      dedupeSelectionItemsArray([selectedItem1, selectedItem2, selectedItem1]),
    ).toEqual([selectedItem1, selectedItem2]);
  });
});
