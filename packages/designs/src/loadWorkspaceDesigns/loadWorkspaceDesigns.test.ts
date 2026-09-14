import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DesignsStore } from '../DesignsStore';
import { DesignsLoadedEvent } from '../events';
import { DesignFixtures, MockFs, cleanup, setup } from '../test-utils';
import { resolveDesignFilePath, resolveDesignsDirPath } from '../utils';
import { loadWorkspaceDesigns } from './loadWorkspaceDesigns';

const { workspace_1, workspace_2 } = WorkspaceFixtures;
const { design_books, design_empty } = DesignFixtures;

describe('loadWorkspaceDesigns', () => {
  beforeEach(() => setup({ loadDesigns: false }));
  afterEach(cleanup);

  it('loads designs from the file system into the store', async () => {
    await loadWorkspaceDesigns(workspace_1);

    expect(DesignsStore).toHaveItem(design_books.id, design_books);
    expect(DesignsStore).toHaveItem(design_empty.id, design_empty);
  });

  it("loads designs into the workspace's store record", async () => {
    // Give the second workspace a design of its own
    MockFs.addFiles([
      {
        path: resolveDesignFilePath(design_books.id, workspace_2.path),
        textContent: JSON.stringify(design_books),
      },
    ]);

    await loadWorkspaceDesigns(workspace_2);

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(DesignsStore.in(workspace_2.id).get(design_books.id)).toEqual(
      design_books,
    );
    expect(DesignsStore).not.toHaveItem(design_books.id);
  });

  it('skips entries which are not valid design bundles', async () => {
    MockFs.addFiles([
      {
        path: resolveDesignFilePath('design_invalid'),
        textContent: 'invalid json',
      },
    ]);

    await loadWorkspaceDesigns(workspace_1);

    expect(DesignsStore).not.toHaveItem('design_invalid');
  });

  it('dispatches a designs loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DesignsLoadedEvent, 'test', (payload) => {
        expect(payload.length).toBeGreaterThan(0);
        done();
      });

      loadWorkspaceDesigns(workspace_1);
    }));

  it('dispatches a designs loaded event when there are no designs', async () =>
    new Promise<void>((done) => {
      // Remove the designs directory, as in a fresh workspace
      MockFs.removeDir(resolveDesignsDirPath(), { recursive: true });

      Events.addListener(DesignsLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual([]);
        done();
      });

      loadWorkspaceDesigns(workspace_1);
    }));
});
