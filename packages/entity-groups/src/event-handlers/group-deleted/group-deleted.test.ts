import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  EntityGroupCollapsedStore,
  entityGroupCollapsedKey,
} from '../../EntityGroupCollapsedStore';
import { setEntityGroupCollapsed } from '../../setEntityGroupCollapsed';
import { EntityGroupFixtures, cleanup, setup } from '../../test-utils';
import { onGroupDeleted } from './group-deleted';

const {
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  groupTypeConfig_exclusive,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

describe('onGroupDeleted', () => {
  beforeEach(setup);

  afterEach(cleanup);

  function collapsedState(groupId: string): boolean | undefined {
    return EntityGroupCollapsedStore.get(
      entityGroupCollapsedKey(type, groupId),
    );
  }

  it('forgets that the group was collapsed', () => {
    setEntityGroupCollapsed(type, entityGroup_exclusive_1.id, true);

    onGroupDeleted(entityGroup_exclusive_1);

    expect(collapsedState(entityGroup_exclusive_1.id)).toBeUndefined();
  });

  it('leaves the other groups collapsed', () => {
    setEntityGroupCollapsed(type, entityGroup_exclusive_2.id, true);

    onGroupDeleted(entityGroup_exclusive_1);

    expect(collapsedState(entityGroup_exclusive_2.id)).toBe(true);
  });
});
