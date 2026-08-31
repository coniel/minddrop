import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { TagsStore } from '../TagsStore';
import { TagGroupNotFoundError } from '../errors';
import { TagRenamedEvent, TagUpdatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  setup,
  tagGroup_1,
  tag_1,
  tag_2,
} from '../test-utils';
import { Tag } from '../types';
import { resolveTagFilePath } from '../utils';
import { updateTag } from './updateTag';

const update = {
  name: 'Updated Tag 1',
};
const updatedTag: Tag = {
  ...tag_1,
  ...update,
  lastModified: mockDate,
};

describe('updateTag', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the tag in the store', async () => {
    await updateTag(tag_1.id, update);

    expect(TagsStore.get(tag_1.id)).toEqual(updatedTag);
  });

  it('writes the tag config to the file system', async () => {
    await updateTag(tag_1.id, update);

    expect(MockFs.readJsonFile(resolveTagFilePath(tag_1.id))).toEqual(
      updatedTag,
    );
  });

  it('returns the updated tag', async () => {
    const tag = await updateTag(tag_1.id, update);

    expect(tag).toEqual(updatedTag);
  });

  it('trims the new name', async () => {
    const tag = await updateTag(tag_1.id, { name: '  Updated Tag 1  ' });

    expect(tag.name).toBe('Updated Tag 1');
  });

  it('allows renaming a tag to its own name', async () => {
    const tag = await updateTag(tag_1.id, { name: tag_1.name });

    expect(tag.name).toBe(tag_1.name);
  });

  it('throws if the new name is already in use (case-insensitive)', async () => {
    await expect(() =>
      updateTag(tag_1.id, { name: tag_2.name.toUpperCase() }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('updates the tag color', async () => {
    const tag = await updateTag(tag_1.id, { color: 'yellow' });

    expect(tag.color).toBe('yellow');
  });

  it('dispatches the tag updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(TagUpdatedEvent, 'test-tag-updated', (payload) => {
        expect(payload.data.original).toEqual(tag_1);
        expect(payload.data.updated).toEqual(updatedTag);
        done();
      });

      updateTag(tag_1.id, update);
    }));

  it('dispatches the tag renamed event when the name changed', async () =>
    new Promise<void>((done) => {
      Events.addListener(TagRenamedEvent, 'test-tag-renamed', (payload) => {
        expect(payload.data.original).toEqual(tag_1);
        expect(payload.data.updated).toEqual(updatedTag);
        done();
      });

      updateTag(tag_1.id, update);
    }));

  it('does not dispatch the tag renamed event when the name is unchanged', async () => {
    // Listen for the tag renamed event, failing the test if it fires
    Events.addListener(TagRenamedEvent, 'test-tag-not-renamed', () => {
      throw new Error('TagRenamedEvent should not dispatch');
    });

    // Update only the color
    await updateTag(tag_1.id, { color: 'yellow' });
  });

  it('assigns the tag to the given group', async () => {
    const tag = await updateTag(tag_1.id, { group: tagGroup_1.id });

    expect(TagsStore.get(tag_1.id)?.group).toBe(tagGroup_1.id);
    expect(tag.group).toBe(tagGroup_1.id);
  });

  it('throws if the given group does not exist', async () => {
    await expect(() =>
      updateTag(tag_1.id, { group: 'tag-group_missing' }),
    ).rejects.toThrow(TagGroupNotFoundError);
  });

  it('ungroups the tag when the group is null', async () => {
    // Assign the tag to a group
    await updateTag(tag_1.id, { group: tagGroup_1.id });

    await updateTag(tag_1.id, { group: null });

    // The tag should no longer carry the group
    expect(TagsStore.get(tag_1.id)?.group).toBeUndefined();
  });

  it('updates the tag icon', async () => {
    await updateTag(tag_1.id, { icon: 'content-icon:star:yellow' });

    expect(TagsStore.get(tag_1.id)?.icon).toBe('content-icon:star:yellow');
  });

  it('leaves the group untouched when not given', async () => {
    // Assign the tag to a group
    await updateTag(tag_1.id, { group: tagGroup_1.id });

    // Update only the color
    await updateTag(tag_1.id, { color: 'yellow' });

    // The tag should still carry the group
    expect(TagsStore.get(tag_1.id)?.group).toBe(tagGroup_1.id);
  });
});
