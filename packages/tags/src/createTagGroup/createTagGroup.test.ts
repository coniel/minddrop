import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagGroupCreatedEvent } from '../events';
import { MockFs, cleanup, mockDate, setup, tagGroup_1 } from '../test-utils';
import { resolveTagGroupFilePath } from '../utils';
import { createTagGroup } from './createTagGroup';

const newGroup = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  name: 'Topics',
};

describe('createTagGroup', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a tag group', async () => {
    const group = await createTagGroup('Topics');

    expect(group).toEqual(newGroup);
  });

  it('trims the group name', async () => {
    const group = await createTagGroup('  Topics  ');

    expect(group.name).toBe('Topics');
  });

  it('throws if the name is empty', async () => {
    await expect(() => createTagGroup('   ')).rejects.toThrow(
      InvalidParameterError,
    );
  });

  it('throws if the name is already in use (case-insensitive)', async () => {
    await expect(() =>
      createTagGroup(tagGroup_1.name.toUpperCase()),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('adds the group to the store', async () => {
    const group = await createTagGroup('Topics');

    expect(TagGroupsStore.get(group.id)).toEqual(newGroup);
  });

  it('writes the group config to the file system', async () => {
    const group = await createTagGroup('Topics');

    expect(MockFs.readJsonFile(resolveTagGroupFilePath(group.id))).toEqual(
      newGroup,
    );
  });

  it('dispatches the tag group created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        TagGroupCreatedEvent,
        'test-tag-group-created',
        (payload) => {
          expect(payload.data).toEqual(newGroup);
          done();
        },
      );

      createTagGroup('Topics');
    }));
});
