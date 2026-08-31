import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup, tagGroup_1, tag_1, tag_3 } from '../test-utils';
import { updateTag } from '../updateTag';
import { getGroupTags } from './getGroupTags';

describe('getGroupTags', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves the tags belonging to the group', async () => {
    // Assign two of the three fixture tags to the group
    await updateTag(tag_1.id, { group: tagGroup_1.id });
    await updateTag(tag_3.id, { group: tagGroup_1.id });

    const groupTags = getGroupTags(tagGroup_1.id);

    // Only the assigned tags should be returned
    expect(groupTags.map((tag) => tag.id)).toEqual([tag_1.id, tag_3.id]);
  });

  it('returns an empty array for groups without tags', () => {
    expect(getGroupTags(tagGroup_1.id)).toEqual([]);
  });
});
