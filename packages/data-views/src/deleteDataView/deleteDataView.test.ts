import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
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

describe('deleteDataView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the view from the store', async () => {
    await deleteDataView(dataView_gallery_1.id);

    expect(DataViewsStore.get(dataView_gallery_1.id)).toBeNull();
  });

  it('deletes the view file', async () => {
    await deleteDataView(dataView_gallery_1.id);

    expect(MockFs.exists(resolveViewFilePath(dataView_gallery_1.id))).toBe(
      false,
    );
  });

  it('does not delete a file for virtual views', async () => {
    // Add a virtual data view to the store
    DataViewsStore.set(dataView_virtual_1);

    await deleteDataView(dataView_virtual_1.id);

    // Should not throw or attempt file deletion
    expect(DataViewsStore.get(dataView_virtual_1.id)).toBeNull();
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
