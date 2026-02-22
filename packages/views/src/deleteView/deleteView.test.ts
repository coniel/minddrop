import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewsStore } from '../ViewsStore';
import { ViewDeletedEvent } from '../events';
import { MockFs, cleanup, setup, view_gallery_1 } from '../test-utils';
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

  it('dispatches a view deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(ViewDeletedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(view_gallery_1);
        done();
      });

      deleteView(view_gallery_1.id);
    }));
});
