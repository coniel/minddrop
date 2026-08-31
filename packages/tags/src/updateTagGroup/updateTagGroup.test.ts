import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagGroupUpdatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  setup,
  tagGroup_1,
  tagGroup_2,
} from '../test-utils';
import { TagGroup } from '../types';
import { resolveTagGroupFilePath } from '../utils';
import { updateTagGroup } from './updateTagGroup';

const update = {
  name: 'Updated Group 1',
};
const updatedGroup: TagGroup = {
  ...tagGroup_1,
  ...update,
  lastModified: mockDate,
};

describe('updateTagGroup', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the group in the store', async () => {
    await updateTagGroup(tagGroup_1.id, update);

    expect(TagGroupsStore.get(tagGroup_1.id)).toEqual(updatedGroup);
  });

  it('writes the group config to the file system', async () => {
    await updateTagGroup(tagGroup_1.id, update);

    expect(MockFs.readJsonFile(resolveTagGroupFilePath(tagGroup_1.id))).toEqual(
      updatedGroup,
    );
  });

  it('returns the updated group', async () => {
    const group = await updateTagGroup(tagGroup_1.id, update);

    expect(group).toEqual(updatedGroup);
  });

  it('trims the new name', async () => {
    const group = await updateTagGroup(tagGroup_1.id, {
      name: '  Updated Group 1  ',
    });

    expect(group.name).toBe('Updated Group 1');
  });

  it('allows renaming a group to its own name', async () => {
    const group = await updateTagGroup(tagGroup_1.id, {
      name: tagGroup_1.name,
    });

    expect(group.name).toBe(tagGroup_1.name);
  });

  it('throws if the new name is already in use (case-insensitive)', async () => {
    await expect(() =>
      updateTagGroup(tagGroup_1.id, { name: tagGroup_2.name.toUpperCase() }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('dispatches the tag group updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        TagGroupUpdatedEvent,
        'test-tag-group-updated',
        (payload) => {
          expect(payload.data.original).toEqual(tagGroup_1);
          expect(payload.data.updated).toEqual(updatedGroup);
          done();
        },
      );

      updateTagGroup(tagGroup_1.id, update);
    }));
});
