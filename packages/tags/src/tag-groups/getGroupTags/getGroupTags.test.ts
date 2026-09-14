import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { TagGroupsType } from '../../constants';
import { cleanup, setup, tagGroup_1, tag_1, tag_3 } from '../../test-utils';
import { getGroupTags } from './getGroupTags';

describe('getGroupTags', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves the tags in the group, in its order', async () => {
    await EntityGroups.addItem(TagGroupsType, tagGroup_1.id, tag_3.id);
    await EntityGroups.addItem(TagGroupsType, tagGroup_1.id, tag_1.id);

    expect(getGroupTags(tagGroup_1.id).map((tag) => tag.id)).toEqual([
      tag_3.id,
      tag_1.id,
    ]);
  });

  it('leaves out a listed tag which no longer exists', async () => {
    await EntityGroups.addItem(TagGroupsType, tagGroup_1.id, 'tag_missing');

    expect(getGroupTags(tagGroup_1.id)).toEqual([]);
  });

  it('returns an empty array for a group without tags', () => {
    expect(getGroupTags(tagGroup_1.id)).toEqual([]);
  });

  it('throws when the group does not exist', () => {
    expect(() => getGroupTags('entity-group_missing')).toThrow(
      EntityGroups.errors.NotFound,
    );
  });
});
