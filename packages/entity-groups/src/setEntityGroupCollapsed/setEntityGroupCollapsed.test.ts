import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  EntityGroupCollapsedStore,
  entityGroupCollapsedKey,
} from '../EntityGroupCollapsedStore';
import { EntityGroupFixtures, cleanup, setup } from '../test-utils';
import { setEntityGroupCollapsed } from './setEntityGroupCollapsed';

const {
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;
const multiType = groupTypeConfig_multi.id;

describe('setEntityGroupCollapsed', () => {
  beforeEach(setup);

  afterEach(cleanup);

  function collapsedState(
    groupType: string,
    groupId: string,
  ): boolean | undefined {
    return EntityGroupCollapsedStore.get(
      entityGroupCollapsedKey(groupType, groupId),
    );
  }

  it('collapses the group', () => {
    setEntityGroupCollapsed(type, entityGroup_exclusive_1.id, true);

    expect(collapsedState(type, entityGroup_exclusive_1.id)).toBe(true);
  });

  it('expands the group', () => {
    setEntityGroupCollapsed(type, entityGroup_exclusive_1.id, true);
    setEntityGroupCollapsed(type, entityGroup_exclusive_1.id, false);

    expect(collapsedState(type, entityGroup_exclusive_1.id)).toBe(false);
  });

  it('collapses one group at a time', () => {
    setEntityGroupCollapsed(type, entityGroup_exclusive_1.id, true);

    expect(collapsedState(type, entityGroup_exclusive_2.id)).toBeUndefined();
  });

  // The app's own groups are identified by a fixed ID, which two
  // types can both use.
  it('collapses the group of the given type only', () => {
    setEntityGroupCollapsed(type, entityGroup_exclusive_1.id, true);

    expect(
      collapsedState(multiType, entityGroup_exclusive_1.id),
    ).toBeUndefined();
  });
});
