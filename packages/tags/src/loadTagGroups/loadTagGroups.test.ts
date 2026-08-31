import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagGroupsLoadedEvent } from '../events';
import { MockFs, cleanup, setup, tagGroups } from '../test-utils';
import { resolveTagGroupFilePath, resolveTagGroupsDirPath } from '../utils';
import { loadTagGroups } from './loadTagGroups';

describe('loadTagGroups', () => {
  beforeEach(() => setup({ loadTagGroups: false }));

  afterEach(cleanup);

  it('creates the tag groups directory if it does not exist', async () => {
    // Remove the tag groups directory
    MockFs.removeFile(resolveTagGroupsDirPath());

    await loadTagGroups();

    expect(MockFs.exists(resolveTagGroupsDirPath())).toBe(true);
  });

  it('loads tag groups from the tag groups directory into the store', async () => {
    await loadTagGroups();

    expect(TagGroupsStore.getAllArray()).toEqual(tagGroups);
  });

  it('filters out null groups', async () => {
    // Create an invalid tag group file
    MockFs.writeTextFile(
      resolveTagGroupFilePath('invalid-group'),
      'invalid json',
    );

    await loadTagGroups();

    expect(TagGroupsStore.getAllArray()).toEqual(tagGroups);
  });

  it('dispatches a tag groups loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(TagGroupsLoadedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(tagGroups);
        done();
      });

      loadTagGroups();
    }));
});
