import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagGroupsLoadedEvent } from '../events';
import { MockFs, cleanup, setup, tagGroups } from '../test-utils';
import { resolveTagGroupFilePath, resolveTagGroupsDirPath } from '../utils';
import { loadTagGroups } from './loadTagGroups';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('loadTagGroups', () => {
  beforeEach(() => setup({ loadTagGroups: false }));

  afterEach(cleanup);

  it('creates the tag groups directory if it does not exist', async () => {
    // Remove the tag groups directory
    MockFs.removeFile(resolveTagGroupsDirPath());

    await loadTagGroups(workspace_1);

    expect(MockFs.exists(resolveTagGroupsDirPath())).toBe(true);
  });

  it('loads tag groups from the tag groups directory into the store', async () => {
    await loadTagGroups(workspace_1);

    expect(TagGroupsStore).toHaveItems(tagGroups);
  });

  it("loads tag groups into the workspace's store record", async () => {
    // Give the second workspace a tag group of its own
    MockFs.addFiles([
      {
        path: resolveTagGroupFilePath(tagGroups[0].id, workspace_2.path),
        textContent: JSON.stringify(tagGroups[0]),
      },
    ]);

    await loadTagGroups(workspace_2);

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(TagGroupsStore.in(workspace_2.id).get(tagGroups[0].id)).toEqual(
      tagGroups[0],
    );
    expect(TagGroupsStore).not.toHaveItem(tagGroups[0].id);
  });

  it('filters out null groups', async () => {
    // Create an invalid tag group file
    MockFs.writeTextFile(
      resolveTagGroupFilePath('invalid-group'),
      'invalid json',
    );

    await loadTagGroups(workspace_1);

    expect(TagGroupsStore).toHaveItems(tagGroups);
  });

  it('dispatches a tag groups loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(TagGroupsLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual(tagGroups);
        done();
      });

      loadTagGroups(workspace_1);
    }));
});
