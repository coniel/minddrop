import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroupsStore } from '../EntityGroupsStore';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { EntityGroupFixtures, cleanup, setup } from '../test-utils';
import { unregisterEntityGroupType } from './unregisterEntityGroupType';

const {
  entityGroup_multi_1,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

describe('unregisterEntityGroupType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('drops the type of groups', () => {
    unregisterEntityGroupType(type);

    expect(EntityGroupsStore).not.toHaveItem(type);
    expect(getAllEntityGroups(type)).toEqual([]);
  });

  it('leaves the other types of groups alone', () => {
    unregisterEntityGroupType(type);

    expect(getAllEntityGroups(groupTypeConfig_multi.id)[0]).toEqual(
      entityGroup_multi_1,
    );
  });
});
