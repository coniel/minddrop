import { describe, expect, it } from 'vitest';
import { selectionItem_A_1, selectionItem_A_2 } from '../../test-utils';
import { dedupeSelectionItemsArray } from './dedupeSelectionItemsArray';

describe('dedupeSelectionItemsArray', () => {
  it('removes duplicate selection items', () => {
    // Should removed duplicate selection items
    expect(
      dedupeSelectionItemsArray([
        selectionItem_A_1,
        selectionItem_A_2,
        selectionItem_A_1,
      ]),
    ).toEqual([selectionItem_A_1, selectionItem_A_2]);
  });
});
