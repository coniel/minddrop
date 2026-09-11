import { describe, expect, it } from 'vitest';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { resolveDropIndex } from './resolveDropIndex';

const { addressedItem_1, addressedItem_2, plainItem_1 } = EntityGroupFixtures;

const items = [addressedItem_1, addressedItem_2, plainItem_1];

describe('resolveDropIndex', () => {
  it('returns the drop position for items the list does not hold', () => {
    expect(resolveDropIndex([addressedItem_2], [addressedItem_1], 1)).toBe(1);
  });

  it('discounts a dropped item the list holds above the position', () => {
    // addressedItem_1 is dropped between plainItem_1 and the end,
    // leaving its own position behind as it moves down.
    expect(resolveDropIndex(items, [addressedItem_1], 3)).toBe(2);
  });

  it('keeps the position of a dropped item the list holds below it', () => {
    expect(resolveDropIndex(items, [plainItem_1], 1)).toBe(1);
  });

  it('discounts each of several dropped items held above the position', () => {
    expect(resolveDropIndex(items, [addressedItem_1, addressedItem_2], 3)).toBe(
      1,
    );
  });
});
