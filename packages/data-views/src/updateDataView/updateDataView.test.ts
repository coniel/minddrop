import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
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

describe('updateDataView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the view in the store', async () => {
    await updateDataView(dataView_gallery_1.id, update);

    expect(DataViewsStore.get(dataView_gallery_1.id)).toEqual(updatedView);
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
    expect(DataViewsStore.get(dataView_virtual_1.id)).toBeNull();

    // New ID should exist
    expect(DataViewsStore.get('new-virtual-id')).not.toBeNull();
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
        expect(payload.data.original).toEqual(dataView_gallery_1);
        expect(payload.data.updated).toEqual(updatedView);
        done();
      });

      updateDataView(dataView_gallery_1.id, update);
    }));
});
