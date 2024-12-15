import { describe, expect, it } from 'vitest';
import { selectedItem1, selectedItem2 } from '../../test-utils';
import { containsSelectionItem } from './containsSelectionItem';

describe('containsSelectionItem', () => {
  it('returns `true` if the array contains the item', () => {
    // Should reutrn `true`
    expect(
      containsSelectionItem([selectedItem1, selectedItem2], selectedItem1),
    ).toBe(true);
  });

  it('returns `false` if the array does not contain the item', () => {
    // Should reutrn `true`
    expect(containsSelectionItem([selectedItem2], selectedItem1)).toBe(false);
  });
});
