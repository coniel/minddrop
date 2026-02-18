import { describe, expect, it } from 'vitest';
import { selectionItem_A_1, selectionItem_A_2 } from '../../test-utils';
import { containsSelectionItem } from './containsSelectionItem';

describe('containsSelectionItem', () => {
  it('returns `true` if the array contains the item', () => {
    // Should reutrn `true`
    expect(
      containsSelectionItem(
        [selectionItem_A_1, selectionItem_A_2],
        selectionItem_A_1,
      ),
    ).toBe(true);
  });

  it('returns `false` if the array does not contain the item', () => {
    // Should reutrn `true`
    expect(containsSelectionItem([selectionItem_A_2], selectionItem_A_1)).toBe(
      false,
    );
  });
});
