import { describe, expect, it } from 'vitest';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { resolveDropOrder } from './resolveDropOrder';

const { addressedItem_1, addressedItem_2, plainItem_1 } = EntityGroupFixtures;

const items = [addressedItem_1, addressedItem_2, plainItem_1];

describe('resolveDropOrder', () => {
  it('inserts an item the list does not hold at the position', () => {
    expect(
      resolveDropOrder([addressedItem_1, plainItem_1], [addressedItem_2], 1),
    ).toEqual([addressedItem_1, addressedItem_2, plainItem_1]);
  });

  it('moves an item down the list to the position it was dropped at', () => {
    expect(resolveDropOrder(items, [addressedItem_1], 2)).toEqual([
      addressedItem_2,
      addressedItem_1,
      plainItem_1,
    ]);
  });

  it('moves an item up the list to the position it was dropped at', () => {
    expect(resolveDropOrder(items, [plainItem_1], 1)).toEqual([
      addressedItem_1,
      plainItem_1,
      addressedItem_2,
    ]);
  });

  it('keeps the dropped items together in the order they were given', () => {
    expect(resolveDropOrder(items, [plainItem_1, addressedItem_1], 1)).toEqual([
      plainItem_1,
      addressedItem_1,
      addressedItem_2,
    ]);
  });

  it('appends items dropped at the end of the list', () => {
    expect(resolveDropOrder(items, [addressedItem_1], 3)).toEqual([
      addressedItem_2,
      plainItem_1,
      addressedItem_1,
    ]);
  });
});
