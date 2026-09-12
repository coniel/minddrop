import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { TagsStore } from '../TagsStore';
import { TagsLoadedEvent } from '../events';
import { MockFs, cleanup, setup, tags } from '../test-utils';
import { resolveTagFilePath, resolveTagsDirPath } from '../utils';
import { loadTags } from './loadTags';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('loadTags', () => {
  beforeEach(() => setup({ loadTags: false }));

  afterEach(cleanup);

  it('creates the tags directory if it does not exist', async () => {
    // Remove the tags directory
    MockFs.removeFile(resolveTagsDirPath());

    await loadTags(workspace_1);

    expect(MockFs.exists(resolveTagsDirPath())).toBe(true);
  });

  it('loads tags from the tags directory into the store', async () => {
    await loadTags(workspace_1);

    expect(TagsStore).toHaveItems(tags);
  });

  it("loads tags into the workspace's store record", async () => {
    // Give the second workspace a tag of its own
    MockFs.addFiles([
      {
        path: resolveTagFilePath(tags[0].id, workspace_2.path),
        textContent: JSON.stringify(tags[0]),
      },
    ]);

    await loadTags(workspace_2);

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(TagsStore.in(workspace_2.id).get(tags[0].id)).toEqual(tags[0]);
    expect(TagsStore).not.toHaveItem(tags[0].id);
  });

  it('filters out null tags', async () => {
    // Create an invalid tag file
    MockFs.writeTextFile(resolveTagFilePath('invalid-tag'), 'invalid json');

    await loadTags(workspace_1);

    expect(TagsStore).toHaveItems(tags);
  });

  it('dispatches a tags loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(TagsLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual(tags);
        done();
      });

      loadTags(workspace_1);
    }));
});
