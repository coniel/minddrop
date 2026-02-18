import { describe, expect, it } from 'vitest';
import {
  selectionItem_A_1,
  selectionItem_A_2,
  selectionItem_B_1,
} from '../../test-utils';
import { groupSelectionItemsByType } from './groupSelectionItemsByType';

describe('groupSelectionItemsByType', () => {
  it('groups selection items by type', () => {
    const grouped = groupSelectionItemsByType([
      selectionItem_A_1,
      selectionItem_B_1,
      selectionItem_A_2,
    ]);

    expect(grouped).toEqual([
      [selectionItem_A_1.type, [selectionItem_A_1, selectionItem_A_2]],
      [selectionItem_B_1.type, [selectionItem_B_1]],
    ]);
  });
});
