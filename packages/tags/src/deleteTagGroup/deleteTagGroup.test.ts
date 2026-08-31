import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagsStore } from '../TagsStore';
import { TagGroupDeletedEvent } from '../events';
import {
  MockFs,
  cleanup,
  setup,
  tagGroup_1,
  tag_1,
  tag_2,
} from '../test-utils';
import { updateTag } from '../updateTag';
import { resolveTagGroupFilePath } from '../utils';
import { deleteTagGroup } from './deleteTagGroup';

describe('deleteTagGroup', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the group from the store', async () => {
    await deleteTagGroup(tagGroup_1.id);

    expect(TagGroupsStore.get(tagGroup_1.id)).toBeNull();
  });

  it('deletes the group file from the file system', async () => {
    await deleteTagGroup(tagGroup_1.id);

    expect(MockFs.exists(resolveTagGroupFilePath(tagGroup_1.id))).toBe(false);
  });

  it('ungroups the group member tags', async () => {
    // Assign two tags to the group
    await updateTag(tag_1.id, { group: tagGroup_1.id });
    await updateTag(tag_2.id, { group: tagGroup_1.id });

    await deleteTagGroup(tagGroup_1.id);

    // The member tags should no longer carry the group
    expect(TagsStore.get(tag_1.id)?.group).toBeUndefined();
    expect(TagsStore.get(tag_2.id)?.group).toBeUndefined();
  });

  it('dispatches the tag group deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        TagGroupDeletedEvent,
        'test-tag-group-deleted',
        (payload) => {
          expect(payload.data).toEqual(tagGroup_1);
          done();
        },
      );

      deleteTagGroup(tagGroup_1.id);
    }));
});
