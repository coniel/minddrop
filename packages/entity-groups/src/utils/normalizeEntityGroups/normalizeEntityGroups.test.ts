import { describe, expect, it } from 'vitest';
import { EntityGroupFixtures } from '../../test-utils';
import { normalizeEntityGroups } from './normalizeEntityGroups';

const {
  addressedItem_1,
  entityGroup_exclusive_1,
  entityGroup_multi_1,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
} = EntityGroupFixtures;

describe('normalizeEntityGroups', () => {
  it('appends the app provided groups to a list without them', () => {
    const groups = normalizeEntityGroups(
      [entityGroup_multi_1],
      groupTypeConfig_multi,
    );

    expect(groups[0]).toEqual(entityGroup_multi_1);
    expect(groups[1]).toMatchObject({
      id: entityGroup_protected.id,
      name: entityGroup_protected.name,
      type: entityGroup_protected.type,
      items: [],
    });
  });

  it('dates an appended app provided group from now', () => {
    const before = Date.now();
    const groups = normalizeEntityGroups([], groupTypeConfig_multi);

    expect(groups[0].created.getTime()).toBeGreaterThanOrEqual(before);
    expect(groups[0].lastModified).toEqual(groups[0].created);
  });

  it('keeps the dates of a stored app provided group', () => {
    const groups = normalizeEntityGroups(
      [{ ...entityGroup_protected, name: 'Renamed' }],
      groupTypeConfig_multi,
    );

    expect(groups[0].created).toEqual(entityGroup_protected.created);
  });

  it('keeps a stored app provided group in its position', () => {
    const groups = normalizeEntityGroups(
      [entityGroup_protected, entityGroup_multi_1],
      groupTypeConfig_multi,
    );

    expect(groups.map(({ id }) => id)).toEqual([
      entityGroup_protected.id,
      entityGroup_multi_1.id,
    ]);
  });

  it('restores the name of a renamed app provided group', () => {
    const groups = normalizeEntityGroups(
      [{ ...entityGroup_protected, name: 'Renamed' }],
      groupTypeConfig_multi,
    );

    expect(groups[0]).toEqual(entityGroup_protected);
  });

  it('drops items given to an app provided group', () => {
    const groups = normalizeEntityGroups(
      [{ ...entityGroup_protected, items: [addressedItem_1] }],
      groupTypeConfig_multi,
    );

    expect(groups[0]).toEqual(entityGroup_protected);
  });

  it('leaves the user groups alone', () => {
    const groups = normalizeEntityGroups(
      [entityGroup_exclusive_1],
      groupTypeConfig_exclusive,
    );

    expect(groups).toEqual([entityGroup_exclusive_1]);
  });

  it('adds nothing to a type without app provided groups', () => {
    const groups = normalizeEntityGroups([], groupTypeConfig_exclusive);

    expect(groups).toEqual([]);
  });
});
