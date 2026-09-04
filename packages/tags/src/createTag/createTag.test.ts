import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { TagsStore } from '../TagsStore';
import { TagGroupNotFoundError } from '../errors';
import { TagCreatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  setup,
  tagGroup_1,
  tag_1,
} from '../test-utils';
import { resolveTagFilePath } from '../utils';
import { createTag } from './createTag';

const newTag = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  name: 'Work',
  color: 'purple',
  icon: 'content-icon:tag:purple',
};

describe('createTag', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a tag', async () => {
    const tag = await createTag('Work', 'purple');

    expect(tag).toEqual(newTag);
  });

  it('defaults the color to the next color in the rotation', async () => {
    // Three fixture tags exist, so the rotation yields the fourth
    // non-default content color
    const tag = await createTag('Work');

    expect(tag.color).toBe('pink');
  });

  it('trims the tag name', async () => {
    const tag = await createTag('  Work  ', 'purple');

    expect(tag.name).toBe('Work');
  });

  it('throws if the name is empty', async () => {
    await expect(() => createTag('   ')).rejects.toThrow(InvalidParameterError);
  });

  it('throws if the name is already in use (case-insensitive)', async () => {
    await expect(() => createTag(tag_1.name.toUpperCase())).rejects.toThrow(
      InvalidParameterError,
    );
  });

  it('adds the tag to the store', async () => {
    const tag = await createTag('Work', 'purple');

    expect(TagsStore.get(tag.id)).toEqual(newTag);
  });

  it('writes the tag config to the file system', async () => {
    const tag = await createTag('Work', 'purple');

    expect(MockFs.readJsonFile(resolveTagFilePath(tag.id))).toEqual(newTag);
  });

  it('dispatches the tag created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(TagCreatedEvent, 'test-tag-created', (payload) => {
        expect(payload).toEqual(newTag);
        done();
      });

      createTag('Work', 'purple');
    }));

  it('assigns the tag to the given group', async () => {
    const tag = await createTag('Work', 'purple', tagGroup_1.id);

    expect(tag.group).toBe(tagGroup_1.id);
  });

  it('throws if the given group does not exist', async () => {
    await expect(() =>
      createTag('Work', 'purple', 'tag-group_missing'),
    ).rejects.toThrow(TagGroupNotFoundError);
  });
});
