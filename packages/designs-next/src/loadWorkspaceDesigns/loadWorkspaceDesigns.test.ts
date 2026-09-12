import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DesignsStore } from '../DesignsStore';
import { DesignsLoadedEvent } from '../events';
import { MockFs, cleanup, designs, setup } from '../test-utils';
import { resolveDesignsDirPath } from '../utils';
import { loadWorkspaceDesigns } from './loadWorkspaceDesigns';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('loadWorkspaceDesigns', () => {
  beforeEach(() => setup({ loadDesigns: false }));

  afterEach(cleanup);

  it('loads design files into the store', async () => {
    await loadWorkspaceDesigns(workspace_1);

    expect(DesignsStore).toHaveItems(designs);
  });

  it("loads designs into the workspace's store record", async () => {
    // Give the second workspace a design of its own
    MockFs.addFiles([
      {
        path: `${resolveDesignsDirPath(workspace_2.path)}/${designs[0].id}.json`,
        textContent: JSON.stringify(designs[0]),
      },
    ]);

    await loadWorkspaceDesigns(workspace_2);

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(DesignsStore.in(workspace_2.id).get(designs[0].id)).toEqual(
      designs[0],
    );
    expect(DesignsStore).not.toHaveItem(designs[0].id);
  });

  it('ignores files without the design file extension', async () => {
    // A valid design in a file without the design file extension
    MockFs.addFiles([
      {
        path: `${resolveDesignsDirPath()}/design_3.txt`,
        textContent: JSON.stringify({ ...designs[0], id: 'design_3' }),
      },
    ]);

    await loadWorkspaceDesigns(workspace_1);

    expect(DesignsStore).toHaveItems(designs);
  });

  it('discards entries which are not valid design files', async () => {
    // A file which is not a valid design
    MockFs.addFiles([
      {
        path: `${resolveDesignsDirPath()}/design_invalid.json`,
        textContent: JSON.stringify({ id: 'not-a-design' }),
      },
    ]);

    await loadWorkspaceDesigns(workspace_1);

    expect(DesignsStore).toHaveItems(designs);
  });

  it('dispatches the designs loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        DesignsLoadedEvent,
        'test-designs-loaded',
        (payload) => {
          expect(payload).toEqual(designs);
          done();
        },
      );

      loadWorkspaceDesigns(workspace_1);
    }));

  it('dispatches an empty loaded event if the directory does not exist', async () =>
    new Promise<void>((done) => {
      // Empty the mock file system so the designs directory is missing
      MockFs.clear();

      Events.addListener(
        DesignsLoadedEvent,
        'test-designs-loaded',
        (payload) => {
          expect(payload).toEqual([]);
          done();
        },
      );

      loadWorkspaceDesigns(workspace_1);
    }));
});
