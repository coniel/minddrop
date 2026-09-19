import { describe, expect, it } from 'vitest';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { entityIdType } from '@minddrop/utils';
import { resolveDraggedItemIds } from './resolveDraggedItemIds';

const { addressedItem_1, plainItem_1, plainItem_2 } = EntityGroupFixtures;

// The types of the fixture items, under which a drag lists them
const addressedType = entityIdType(addressedItem_1) ?? '';
const plainType = entityIdType(plainItem_1) ?? '';

describe('resolveDraggedItemIds', () => {
  it('reads the IDs of the items of the given types', () => {
    expect(
      resolveDraggedItemIds(
        {
          [addressedType]: [{ id: addressedItem_1 }],
          [plainType]: [{ id: plainItem_1 }, { id: plainItem_2 }],
          'text/plain': 'text',
        },
        [addressedType, plainType],
      ),
    ).toEqual([addressedItem_1, plainItem_1, plainItem_2]);
  });

  it('ignores types the drag does not have', () => {
    expect(resolveDraggedItemIds({}, [plainType])).toEqual([]);
  });

  it('ignores items without an ID', () => {
    expect(
      resolveDraggedItemIds({ [plainType]: [{ text: 'no id' }, 'text'] }, [
        plainType,
      ]),
    ).toEqual([]);
  });
});
