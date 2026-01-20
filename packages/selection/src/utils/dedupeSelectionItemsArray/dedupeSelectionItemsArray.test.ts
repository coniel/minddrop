import { describe, expect, it } from 'vitest';
import { selectionItem1, selectionItem2 } from '../../test-utils';
import { dedupeSelectionItemsArray } from './dedupeSelectionItemsArray';

describe('dedupeSelectionItemsArray', () => {
  it('removes duplicate selection items', () => {
    // Should removed duplicate selection items
    expect(
      dedupeSelectionItemsArray([
        selectionItem1,
        selectionItem2,
        selectionItem1,
      ]),
    ).toEqual([selectionItem1, selectionItem2]);
  });
});
