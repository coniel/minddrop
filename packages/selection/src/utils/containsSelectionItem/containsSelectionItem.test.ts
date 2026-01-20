import { describe, expect, it } from 'vitest';
import { selectionItem1, selectionItem2 } from '../../test-utils';
import { containsSelectionItem } from './containsSelectionItem';

describe('containsSelectionItem', () => {
  it('returns `true` if the array contains the item', () => {
    // Should reutrn `true`
    expect(
      containsSelectionItem([selectionItem1, selectionItem2], selectionItem1),
    ).toBe(true);
  });

  it('returns `false` if the array does not contain the item', () => {
    // Should reutrn `true`
    expect(containsSelectionItem([selectionItem2], selectionItem1)).toBe(false);
  });
});
