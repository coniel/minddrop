import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewDeletedEvent } from '../events';
import {
  MockFs,
  cleanup,
  dataView_gallery_1,
  dataView_virtual_1,
  setup,
} from '../test-utils';
import { resolveViewFilePath } from '../utils';
import { deleteDataView } from './deleteDataView';

const { workspace_2 } = WorkspaceFixtures;

describe('deleteDataView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the view from the store', async () => {
    await deleteDataView(dataView_gallery_1.id);

    expect(DataViewsStore).not.toHaveItem(dataView_gallery_1.id);
  });

  it('deletes the view file', async () => {
    await deleteDataView(dataView_gallery_1.id);

    expect(MockFs.exists(resolveViewFilePath(dataView_gallery_1.id))).toBe(
      false,
    );
  });

  it('deletes the view from the given workspace', async () => {
    const otherPath = resolveViewFilePath(
      dataView_gallery_1.id,
      workspace_2.path,
    );

    // A view held by the second workspace only
    DataViewsStore.in(workspace_2.id).set(dataView_gallery_1);
    MockFs.addFiles([
      { path: otherPath, textContent: JSON.stringify(dataView_gallery_1) },
    ]);

    await deleteDataView(dataView_gallery_1.id, workspace_2.id);

    // Should remove the second workspace's view and file, leaving the
    // active workspace's as they were.
    expect(
      DataViewsStore.in(workspace_2.id).get(dataView_gallery_1.id),
    ).toBeNull();
    expect(MockFs.exists(otherPath)).toBe(false);
    expect(DataViewsStore).toHaveItem(dataView_gallery_1.id);
    expect(MockFs.exists(resolveViewFilePath(dataView_gallery_1.id))).toBe(
      true,
    );
  });

  it('does not delete a file for virtual views', async () => {
    // Add a virtual data view to the store
    DataViewsStore.set(dataView_virtual_1);

    await deleteDataView(dataView_virtual_1.id);

    // Should not throw or attempt file deletion
    expect(DataViewsStore).not.toHaveItem(dataView_virtual_1.id);
  });

  it('dispatches a view deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DataViewDeletedEvent, 'test', (payload) => {
        expect(payload).toEqual(dataView_gallery_1);
        done();
      });

      deleteDataView(dataView_gallery_1.id);
    }));
});
