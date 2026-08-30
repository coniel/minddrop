import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { TagsStore } from '../TagsStore';
import { TagUpdatedEvent } from '../events';
import { MockFs, cleanup, mockDate, setup, tag_1, tag_2 } from '../test-utils';
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
});
