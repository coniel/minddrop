import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { cleanup, setup } from '../../test-utils';
import { resolveEntityGroupDragSourceId } from './resolveEntityGroupDragSourceId';

const {
  entityGroup_exclusive_1,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
} = EntityGroupFixtures;

describe('resolveEntityGroupDragSourceId', () => {
  beforeEach(setup);

  afterEach(cleanup);

  /**
   * Returns the origin of a drag started in the given group.
   *
   * @param groupId - The ID of the group the drag started in.
   * @returns The drag origin.
   */
  function fromGroup(groupId = entityGroup_exclusive_1.id) {
    return { type: groupTypeConfig_exclusive.id, id: groupId };
  }

  it('returns the ID of the group the drag was started in', () => {
    expect(
      resolveEntityGroupDragSourceId(fromGroup(), groupTypeConfig_exclusive.id),
    ).toBe(entityGroup_exclusive_1.id);
  });

  it('returns null for a drag started in a group of another type', () => {
    expect(
      resolveEntityGroupDragSourceId(fromGroup(), groupTypeConfig_multi.id),
    ).toBe(null);
  });

  it('returns null for a drag started in the ungrouped group', () => {
    expect(
      resolveEntityGroupDragSourceId(
        fromGroup(EntityGroups.constants.UngroupedId),
        groupTypeConfig_exclusive.id,
      ),
    ).toBe(null);
  });

  it('returns null for a drag started from no group', () => {
    expect(
      resolveEntityGroupDragSourceId(null, groupTypeConfig_exclusive.id),
    ).toBe(null);
  });
});
