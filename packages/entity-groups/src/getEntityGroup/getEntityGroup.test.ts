import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroupNotFoundError } from '../errors';
import { setEntityGroups } from '../setEntityGroups';
import { EntityGroupFixtures, cleanup, setup } from '../test-utils';
import { EntityGroupId } from '../types';
import { getEntityGroup } from './getEntityGroup';

const {
  entityGroup_exclusive_1,
  entityGroup_multi_1,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;
const multiType = groupTypeConfig_multi.id;

describe('getEntityGroup', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the group', () => {
    expect(getEntityGroup(type, entityGroup_exclusive_1.id)).toEqual(
      entityGroup_exclusive_1,
    );
  });

  it('returns the group of the given type', () => {
    expect(getEntityGroup(multiType, entityGroup_multi_1.id)).toEqual(
      entityGroup_multi_1,
    );
  });

  it('looks only among the given type of groups', () => {
    expect(getEntityGroup(type, entityGroup_multi_1.id, false)).toBeNull();
  });

  it('tells apart two types of group sharing an ID', () => {
    // Protected group IDs are written by hand rather than minted, so
    // two types can name a group the same.
    const sharedId = 'entity-group_shared' as EntityGroupId;

    setEntityGroups(type, [{ ...entityGroup_exclusive_1, id: sharedId }]);
    setEntityGroups(multiType, [{ ...entityGroup_multi_1, id: sharedId }]);

    expect(getEntityGroup(type, sharedId).name).toBe(
      entityGroup_exclusive_1.name,
    );
    expect(getEntityGroup(multiType, sharedId).name).toBe(
      entityGroup_multi_1.name,
    );
  });

  it('throws when the group does not exist', () => {
    expect(() => getEntityGroup(type, 'entity-group_99')).toThrow(
      EntityGroupNotFoundError,
    );
  });

  it('returns null for a missing group when not throwing', () => {
    expect(getEntityGroup(type, 'entity-group_99', false)).toBeNull();
  });
});
