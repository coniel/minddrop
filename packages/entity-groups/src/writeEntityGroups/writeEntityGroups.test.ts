import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setEntityGroups } from '../setEntityGroups';
import {
  EntityGroupFixtures,
  cleanup,
  readWrittenEntityGroup,
  readWrittenEntityGroups,
  setup,
} from '../test-utils';
import { writeEntityGroups } from './writeEntityGroups';

const {
  addressedItem_1,
  plainItem_1,
  itemAddresses,
  entityGroup_exclusive_1,
  exclusiveGroups,
  groupTypeConfig_exclusive,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

describe('writeEntityGroups', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('writes the type of groups in the order they are listed', async () => {
    await writeEntityGroups(type);

    expect(readWrittenEntityGroups(type).map(({ id }) => id)).toEqual(
      exclusiveGroups.map(({ id }) => id),
    );
  });

  it('writes addressed items as their durable reference', async () => {
    await writeEntityGroups(type);

    expect(
      readWrittenEntityGroup(type, entityGroup_exclusive_1.id)?.items,
    ).toEqual([itemAddresses[addressedItem_1], plainItem_1]);
  });

  it('drops items which no longer resolve to a reference', async () => {
    // An addressed item with no address stands for one deleted
    // outside the app.
    setEntityGroups(type, [
      { ...entityGroup_exclusive_1, items: ['addressed-item_missing'] },
    ]);

    await writeEntityGroups(type);

    expect(
      readWrittenEntityGroup(type, entityGroup_exclusive_1.id)?.items,
    ).toEqual([]);
  });

  it('writes only the given type', async () => {
    await writeEntityGroups(type);

    expect(() => readWrittenEntityGroups('multi')).toThrow();
  });
});
