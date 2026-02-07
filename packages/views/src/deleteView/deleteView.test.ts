import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ViewsStore } from '../ViewsStore';
import { ViewDeletedEvent } from '../events';
import { MockFs, cleanup, queriesView1, setup } from '../test-utils';
import { deleteView } from './deleteView';

describe('deleteView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the view from the store', async () => {
    await deleteView('query-view-1');

    expect(ViewsStore.get('query-view-1')).toBeNull();
  });

  it('deletes the view config from the file system', async () => {
    await deleteView('query-view-1');

    expect(MockFs.exists(queriesView1.path)).toBe(false);
  });

  it('dispatches the view deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(ViewDeletedEvent, 'test-view-deleted', (payload) => {
        expect(payload.data).toEqual(queriesView1);
        done();
      });

      deleteView('query-view-1');
    }));
});
