import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewUpdatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  dataView_gallery_1,
  dataView_virtual_1,
  mockDate,
  setup,
} from '../test-utils';
import { DataView } from '../types';
import { resolveViewFilePath } from '../utils';
import { updateDataView } from './updateDataView';

const update = {
  options: { layout: 'grid' },
};
const updatedView: DataView = {
  ...dataView_gallery_1,
  options: update.options,
  lastModified: mockDate,
  references: [],
};

// The updated view as written to disk, without the references index
const { references: _references, ...writtenView } = updatedView;

const { workspace_2 } = WorkspaceFixtures;

describe('updateDataView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the view in the store', async () => {
    await updateDataView(dataView_gallery_1.id, update);

    expect(DataViewsStore).toHaveItem(dataView_gallery_1.id, updatedView);
  });

  it('updates the view in the given workspace', async () => {
    // A view held by the second workspace only
    DataViewsStore.in(workspace_2.id).set(dataView_gallery_1);

    await updateDataView(dataView_gallery_1.id, update, true, workspace_2.id);

    // Should update the second workspace's record and write into its
    // views directory, leaving the active workspace's view as it was.
    expect(
      DataViewsStore.in(workspace_2.id).get(dataView_gallery_1.id),
    ).toEqual(updatedView);
    expect(
      MockFs.readJsonFile(
        resolveViewFilePath(dataView_gallery_1.id, workspace_2.path),
      ),
    ).toEqual(writtenView);
    expect(DataViewsStore).toHaveItem(
      dataView_gallery_1.id,
      dataView_gallery_1,
    );
  });

  it('writes the view to the file system', async () => {
    await updateDataView(dataView_gallery_1.id, update);

    expect(
      MockFs.readJsonFile(resolveViewFilePath(dataView_gallery_1.id)),
    ).toEqual(writtenView);
  });

  it('returns the updated view', async () => {
    const result = await updateDataView(dataView_gallery_1.id, update);

    expect(result).toEqual(updatedView);
  });

  it('shallow merges update data if deepMerge is false', async () => {
    const result = await updateDataView(dataView_gallery_1.id, update, false);

    expect(result).toEqual({
      ...updatedView,
      options: update.options,
    });
  });

  it('does not write to the file system for virtual views', async () => {
    // Add a virtual data view to the store
    DataViewsStore.set(dataView_virtual_1);

    await updateDataView(dataView_virtual_1.id, { name: 'Updated' });

    // Should not have created a file
    expect(MockFs.exists(resolveViewFilePath(dataView_virtual_1.id))).toBe(
      false,
    );
  });

  it('allows changing the ID of a virtual view', async () => {
    // Add a virtual data view to the store
    DataViewsStore.set(dataView_virtual_1);

    const result = await updateDataView(dataView_virtual_1.id, {
      id: 'new-virtual-id',
    });

    // Old ID should be removed
    expect(DataViewsStore).not.toHaveItem(dataView_virtual_1.id);

    // New ID should exist
    expect(DataViewsStore).toHaveItem('new-virtual-id');
    expect(result.id).toBe('new-virtual-id');
  });

  it('throws when attempting to change the ID of a non-virtual view', async () => {
    await expect(
      updateDataView(dataView_gallery_1.id, { id: 'new-id' }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('dispatches a view updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DataViewUpdatedEvent, 'test', (payload) => {
        expect(payload.original).toEqual(dataView_gallery_1);
        expect(payload.updated).toEqual(updatedView);
        done();
      });

      updateDataView(dataView_gallery_1.id, update);
    }));
});
