import { selectedDrop1, selectedDrop2 } from '../../test-utils';
import { dedupeSelectionItemsArray } from './dedupeSelectionItemsArray';

describe('dedupeSelectionItemsArray', () => {
  it('removes duplicate selection items', () => {
    // Should removed duplicate selection items
    expect(
      dedupeSelectionItemsArray([selectedDrop1, selectedDrop2, selectedDrop1]),
    ).toEqual([selectedDrop1, selectedDrop2]);
  });
});
