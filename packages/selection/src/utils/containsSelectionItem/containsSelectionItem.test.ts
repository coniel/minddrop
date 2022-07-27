import { selectedDrop1, selectedDrop2 } from '../../test-utils';
import { containsSelectionItem } from './containsSelectionItem';

describe('containsSelectionItem', () => {
  it('returns `true` if the array contains the item', () => {
    // Should reutrn `true`
    expect(
      containsSelectionItem([selectedDrop1, selectedDrop2], selectedDrop1),
    ).toBe(true);
  });

  it('returns `false` if the array does not contain the item', () => {
    // Should reutrn `true`
    expect(containsSelectionItem([selectedDrop2], selectedDrop1)).toBe(false);
  });
});
