import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewsStore } from '../ViewsStore';
import { ViewDeletedEvent } from '../events';
import {
  MockFs,
  cleanup,
  setup,
  view_gallery_1,
  view_virtual_1,
} from '../test-utils';
import { getViewFilePath } from '../utils';
import { deleteView } from './deleteView';

describe('deleteView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the view from the store', async () => {
    await deleteView(view_gallery_1.id);

    expect(ViewsStore.get(view_gallery_1.id)).toBeNull();
  });

  it('deletes the view file', async () => {
    await deleteView(view_gallery_1.id);

    expect(MockFs.exists(getViewFilePath(view_gallery_1.id))).toBe(false);
  });

  it('does not delete a file for virtual views', async () => {
    // Add a virtual view to the store
    ViewsStore.set(view_virtual_1);

    await deleteView(view_virtual_1.id);

    // Should not throw or attempt file deletion
    expect(ViewsStore.get(view_virtual_1.id)).toBeNull();
  });

  it('dispatches a view deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(ViewDeletedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(view_gallery_1);
        done();
      });

      deleteView(view_gallery_1.id);
    }));
});
