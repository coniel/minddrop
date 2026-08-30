import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { TagsStore } from '../TagsStore';
import { TagsLoadedEvent } from '../events';
import { MockFs, cleanup, setup, tags } from '../test-utils';
import { resolveTagFilePath, resolveTagsDirPath } from '../utils';
import { initializeTags } from './initializeTags';

describe('initializeTags', () => {
  beforeEach(() => setup({ loadTags: false }));

  afterEach(cleanup);

  it('creates the tags directory if it does not exist', async () => {
    // Remove the tags directory
    MockFs.removeFile(resolveTagsDirPath());

    await initializeTags();

    expect(MockFs.exists(resolveTagsDirPath())).toBe(true);
  });

  it('loads tags from the tags directory into the store', async () => {
    await initializeTags();

    expect(TagsStore.getAllArray()).toEqual(tags);
  });

  it('filters out null tags', async () => {
    // Create an invalid tag file
    MockFs.writeTextFile(resolveTagFilePath('invalid-tag'), 'invalid json');

    await initializeTags();

    expect(TagsStore.getAllArray()).toEqual(tags);
  });

  it('dispatches a tags loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(TagsLoadedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(tags);
        done();
      });

      initializeTags();
    }));
});
