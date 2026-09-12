import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { SpacesStore } from '../SpacesStore';
import { SpacesLoadedEvent } from '../events';
import { MockFs, cleanup, setup, spaces } from '../test-utils';
import { resolveSpaceFilePath, resolveSpacesDirPath } from '../utils';
import { loadWorkspaceSpaces } from './loadWorkspaceSpaces';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('loadWorkspaceSpaces', () => {
  beforeEach(() => setup({ loadSpaces: false }));

  afterEach(cleanup);

  it('creates the spaces directory if it does not exist', async () => {
    // Remove the spaces directory
    MockFs.removeFile(resolveSpacesDirPath());

    await loadWorkspaceSpaces(workspace_1);

    expect(MockFs.exists(resolveSpacesDirPath())).toBe(true);
  });

  it('loads spaces from the spaces directory into the store', async () => {
    await loadWorkspaceSpaces(workspace_1);

    expect(SpacesStore).toHaveItems(spaces);
  });

  it("loads spaces into the workspace's store record", async () => {
    const [space] = spaces;

    // Give the second workspace a space of its own
    MockFs.addFiles([
      {
        path: resolveSpaceFilePath(space.id, workspace_2.path),
        textContent: JSON.stringify(space),
      },
    ]);

    await loadWorkspaceSpaces(workspace_2);

    // Should load into the second workspace's records, not the
    // active workspace's.
    expect(SpacesStore.in(workspace_2.id).get(space.id)).toEqual(space);
    expect(SpacesStore).not.toHaveItem(space.id);
    expect(
      Designs.Store.in(workspace_2.id).get(space.design.id),
    ).not.toBeNull();
    expect(Designs.Store).not.toHaveItem(space.design.id);
  });

  it('hydrates the spaces owned designs into the designs store', async () => {
    await loadWorkspaceSpaces(workspace_1);

    // Each space's design should be loaded as a virtual design
    spaces.forEach((space) => {
      expect(Designs.Store).toHaveItem(
        space.design.id,
        expect.objectContaining({
          id: space.design.id,
          virtual: true,
          owner: space.id,
        }),
      );
    });
  });

  it('filters out null spaces', async () => {
    // Create an invalid space file
    MockFs.addFiles([
      {
        path: resolveSpaceFilePath('invalid-space'),
        textContent: 'invalid json',
      },
    ]);

    await loadWorkspaceSpaces(workspace_1);

    expect(SpacesStore).toHaveItems(spaces);
  });

  it('dispatches a spaces loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(SpacesLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual(spaces);
        done();
      });

      loadWorkspaceSpaces(workspace_1);
    }));
});
