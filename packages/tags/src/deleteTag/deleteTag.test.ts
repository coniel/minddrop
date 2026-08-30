import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { TagsStore } from '../TagsStore';
import { TagDeletedEvent } from '../events';
import { MockFs, cleanup, setup, tag_1 } from '../test-utils';
import { resolveTagFilePath } from '../utils';
import { deleteTag } from './deleteTag';

describe('deleteTag', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the tag from the store', async () => {
    await deleteTag(tag_1.id);

    expect(TagsStore.get(tag_1.id)).toBeNull();
  });

  it('deletes the tag config from the file system', async () => {
    await deleteTag(tag_1.id);

    expect(MockFs.exists(resolveTagFilePath(tag_1.id))).toBe(false);
  });

  it('dispatches the tag deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(TagDeletedEvent, 'test-tag-deleted', (payload) => {
        expect(payload.data).toEqual(tag_1);
        done();
      });

      deleteTag(tag_1.id);
    }));
});
